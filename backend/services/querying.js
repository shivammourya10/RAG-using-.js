import * as dotenv from 'dotenv';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: '../.env' });

const ai = new GoogleGenAI({});  // Empty object like in CLI - automatically picks up GOOGLE_API_KEY

export async function queryRAG(userQuestion, sessionId, conversationHistory = []) {
  let context = ""; // Define context at function scope for error handling
  
  try {
    console.log(`Processing query for session ${sessionId}: "${userQuestion}"`);

    // 1. Transform query for better context (using conversation history)
    const transformedQuery = await transformQuery(userQuestion, conversationHistory);
    console.log(`Transformed query: "${transformedQuery}"`);

    // 2. Create embeddings for the query
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'text-embedding-004',
    });

    const queryVector = await embeddings.embedQuery(transformedQuery);

    // 3. Search Pinecone with session namespace
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const searchResults = await pineconeIndex.namespace(sessionId).query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
    });

    if (!searchResults.matches || searchResults.matches.length === 0) {
      return "I couldn't find any relevant information in the uploaded document to answer your question.";
    }

    // 4. Extract context from search results
    context = searchResults.matches
      .map(match => match.metadata?.text || '')
      .filter(text => text.length > 0)
      .join('\n\n--\n\n');

    if (!context.trim()) {
      return "I found some relevant sections, but couldn't extract readable text. Please try rephrasing your question.";
    }

    console.log(`Retrieved context length: ${context.length} characters`);

    // 5. Generate response using the context
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: 'user',
          parts: [{ text: transformedQuery }]
        }
      ],
      config: {
        systemInstruction: `You are an intelligent document assistant. You will be given a context from a PDF document and a user question.

Your task is to answer the user's question based ONLY on the provided context from the document.

IMPORTANT RULES:
1. Answer ONLY based on the information provided in the context
2. If the answer is not in the context, clearly state "I could not find the answer in the provided document"
3. Be clear, concise, and educational in your responses
4. If you can partially answer, mention what you found and what you couldn't find
5. Use specific details from the context when possible
6. Maintain a helpful and professional tone

Context from document:
${context}`,
      },
    });

    const answer = response.text || "I apologize, but I couldn't generate a proper response. Please try asking your question differently.";
    
    console.log(`Query processed successfully for session ${sessionId}`);
    return answer;

  } catch (error) {
    console.error(`Error processing query for session ${sessionId}:`, error);
    
    // If it's a quota error, provide a helpful fallback response
    if (error.status === 429 || error.message.includes('Quota exceeded')) {
      return `I found relevant information in your document, but I'm currently experiencing API rate limits. Here's the raw context I found:

${context.substring(0, 1500)}...

Please try again in a few minutes, or check your Google API quota limits.`;
    }
    
    throw new Error(`Failed to process query: ${error.message}`);
  }
}

async function transformQuery(question, conversationHistory) {
  try {
    // If no conversation history, return the question as-is
    if (!conversationHistory || conversationHistory.length === 0) {
      return question;
    }

    // Create a context-aware query transformation
    const historyContext = conversationHistory
      .slice(-6) // Last 3 exchanges (6 messages)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ],
      config: {
        systemInstruction: `You are a query rewriting expert. Based on the provided conversation history, rephrase the user's current question into a complete, standalone question that can be understood without the conversation history.

If the current question is already standalone and clear, return it unchanged.
If the question refers to previous context (like "tell me more about that", "what else", "can you explain this"), rewrite it to be self-contained.

Only output the rewritten question and nothing else.

Conversation History:
${historyContext}`,
      },
    });

    return response.text || question;

  } catch (error) {
    console.error('Error transforming query:', error);
    // If transformation fails, return original question
    return question;
  }
}
