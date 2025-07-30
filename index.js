// This file is part of the LangChain project where we load a PDF document using the PDFLoader from LangChain.

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();
// Import necessary classes from LangChain
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import {Pinecone} from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';


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
    chunkSize: chunkSize, //number of workds in each chunk
    chunkOverlap: chunkOverlap, //number of words that overlap between chunks 

  });
  const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
  console.log("Chunking Completed");

  //console.log(chunkedDocs, 'chunkedDocs');
    // Split the documents into smaller chunks
    // This will return an array of Document objects with text and metadata

    //3rd step embedding the documents
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY, // Ensure you have set this in your .env file
        model: 'text-embedding-004', // Specify the model you want to use
    });  
    console.log("Embedding model configured");

    //4th configure database 
    const pinecone = new Pinecone(); // this automatically uses the environment variables set in .env file like PINECONE_API_KEY and PINECONE_ENVIRONMENT 
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
     console.log("pineconeconfigured");

    // langchain pipeline from chunking documents to embeddings
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,
        maxConcurrency:5, //what this does is it will run 5 requests at a time to the Pinecone database and it will not wait for the previous request to finish
    });
    console.log("data stored completed");
}

indexDocument();