import * as dotenv from 'dotenv';
dotenv.config();
import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';


async function chatting(userProblem) {

    //we have to convert the user input into embeddings so that we can query the database 
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY, // Ensure you have set this in
        model: 'text-embedding-004', // Specify the model you want to use
    });

    // Create a query vector from the user input
    const queryVector = await embeddings.embedQuery(userProblem);
    console.log("Query vector created");

    // make connection with Pinecone database
    const pinecone = new Pinecone(); 
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const searchResults = await pineconeIndex.query({
        topK:10,
        vector: queryVector,
        includeMetadata: true,
    });
    console.log(searchResults, 'searchResults');
}

async function main(){
   const userProblem = readlineSync.question("Ask me anything--> ");
   await chatting(userProblem);
   main();
}



main();
