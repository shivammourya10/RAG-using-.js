import * as dotenv from 'dotenv';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

dotenv.config({ path: '../.env' });

const chunkSize = parseInt(process.env.CHUNK_SIZE) || 2000;
const chunkOverlap = parseInt(process.env.CHUNK_OVERLAP) || 400;

export async function indexPDF(pdfPath, sessionId) {
  try {
    console.log(`Starting PDF indexing for session ${sessionId}...`);

    // 1. Extract text from PDF using LangChain PDFLoader
    let extractedText;
    try {
      console.log('Extracting text from PDF using LangChain...');
      
      // Use LangChain's PDFLoader for better PDF text extraction
      const loader = new PDFLoader(pdfPath);
      const docs = await loader.load();
      
      // Combine all pages into one text
      extractedText = docs.map(doc => doc.pageContent).join('\n\n');
      
      console.log(`Extracted ${extractedText.length} characters from PDF`);
      console.log(`First 200 characters: ${extractedText.substring(0, 200)}...`);
      
      // Check if we got meaningful text
      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('No meaningful text extracted from PDF');
      }
      
    } catch (error) {
      console.log('LangChain PDF extraction failed, trying pdf-parse fallback...');
      
      try {
        // Fallback to pdf-parse
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
        
        console.log(`Fallback extraction: ${extractedText.length} characters`);
        console.log(`First 200 characters: ${extractedText.substring(0, 200)}...`);
        
      } catch (fallbackError) {
        console.log('All PDF extraction methods failed:', fallbackError.message);
        extractedText = `This PDF document could not be processed for text extraction. This might be because:
1. The PDF contains only images/scanned content
2. The PDF is password protected  
3. The PDF has an unsupported format

Please try uploading a different PDF file with selectable text content.`;
      }
    }
    
    console.log(`Processed text content (${extractedText.length} characters)`);

    // 2. Split text into chunks using LangChain's text splitter
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
    });
    
    // Create document-like objects for the splitter
    const docs = [{ pageContent: extractedText, metadata: { source: pdfPath } }];
    const chunkedDocs = await textSplitter.splitDocuments(docs);
    
    console.log(`Created ${chunkedDocs.length} chunks`);

    // 3. Create embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'text-embedding-004',
    });
    console.log('Embedding model configured');

    // 4. Configure Pinecone
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    console.log('Pinecone configured');

    // 5. Process chunks in batches and store in Pinecone
    const batchSize = 20; // Increased batch size for faster processing
    for (let i = 0; i < chunkedDocs.length; i += batchSize) {
      const batch = chunkedDocs.slice(i, i + batchSize);
      
      // Create embeddings for batch in parallel
      const embeddingPromises = batch.map(async (doc, j) => {
        const embedding = await embeddings.embedQuery(doc.pageContent);
        return {
          id: `${sessionId}-chunk-${i + j}`,
          values: embedding,
          metadata: {
            text: doc.pageContent,
            sessionId: sessionId,
            chunkIndex: i + j,
            source: doc.metadata.source
          }
        };
      });

      // Wait for all embeddings in the batch to complete
      const vectors = await Promise.all(embeddingPromises);

      // Upsert to Pinecone with namespace
      await pineconeIndex.namespace(sessionId).upsert(vectors);

      console.log(`Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunkedDocs.length/batchSize)}`);
      
      // Small delay to avoid rate limiting (except for last batch)
      if (i + batchSize < chunkedDocs.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`PDF indexed successfully for session ${sessionId}`);
    return { success: true, chunks: chunkedDocs.length };

  } catch (error) {
    console.error(`Error indexing PDF for session ${sessionId}:`, error);
    throw new Error(`Failed to index PDF: ${error.message}`);
  }
}
