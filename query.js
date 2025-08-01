import * as dotenv from 'dotenv';
dotenv.config();
import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({}); //now we can leave the curly braces empty as it automatically picks up the environment variables (GOOGLE_API_KEY) earlier we had to pass the api key here
const History = []

async function transformQuery(question){

History.push({
    role:'user',
    parts:[{text:question}]
    })  

const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You are a query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history.
    Only output the rewritten question and nothing else.
      `,
    },
 });
 
 History.pop()
 
 return response.text


}

async function chatting(userProblem) {

    //convert this userProblem into vector
    const queries = await transformQuery(userProblem);


    //we have to convert the user input into embeddings so that we can query the database 
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY, // Ensure you have set this in
        model: 'text-embedding-004', // Specify the model you want to use
    });

    // Create a query vector from the user input
    const queryVector = await embeddings.embedQuery(queries);
    //console.log("Query vector created");

    // make connection with Pinecone database
    const pinecone = new Pinecone(); 
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const searchResults = await pineconeIndex.query({
        topK:10,
        vector: queryVector,
        includeMetadata: true,
    });
   //console.log(searchResults, 'searchResults');

    //from search results, we will get the metadata and then we will send it to the llm (context)
    const context = searchResults.matches.map(match => match.metadata.text).join('\n\n--\n\n');

    //console.log(context, 'context');
    History.push({
    role:'user',
    parts:[{text:queries}]
    })       

    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You have to behave like a Data Structure and Algorithm Expert.
    You will be given a context of relevant information and a user question.
    Your task is to answer the user's question based ONLY on the provided context.
    If the answer is not in the context, you must say "I could not find the answer in the provided document."
    Keep your answers clear, concise, and educational.
      
      Context: ${context}
      `,
    },
   });


   History.push({
    role:'model',
    parts:[{text:response.text}]
  })

  console.log("\n");
  console.log(response.text);

}

async function main(){
   const userProblem = readlineSync.question("Ask me anything--> ");
   await chatting(userProblem);
   main();
}



main();

