// This file is part of the LangChain project where we load a PDF document using the PDFLoader from LangChain.

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();
// Import necessary classes from LangChain
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';


// Constants for chunk size and overlap
const chunkSize = parseInt(process.env.CHUNK_SIZE) || 1000; // Default to 1000 if not set
const chunkOverlap = parseInt(process.env.CHUNK_OVERLAP) || 200; // Default to 200 if not set

async function indexDocument() {

    //1st step is loading the document
    const PDF_PATH = './Dsa.pdf';
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();

    // Log the number of documents loaded (pages in the PDF)
    //console.log(rawDocs.length, 'documents loaded');

    //2nd step is chunking the documents 
    const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE, //number of workds in each chunk
    chunkOverlap: CHUNK_OVERLAP, //number of words that overlap between chunks 

  });
  const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

  //console.log(chunkedDocs, 'chunkedDocs');
    // Split the documents into smaller chunks
    // This will return an array of Document objects with text and metadata

    //3rd step embedding the documents
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY, // Ensure you have set this in your .env file
        model: 'text-embedding-004', // Specify the model you want to use
    });  

    //configure database 


}

indexDocument();