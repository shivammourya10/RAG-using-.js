# Simple RAG in JS

This project implements a Retrieval-Augmented Generation (RAG) system in JavaScript. It allows you to chat with a PDF document by leveraging the power of Large Language Models (LLMs) and vector databases. The system first indexes the content of a PDF and then uses that index to find relevant information to answer user queries.

## How to Clone and Run

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/shivammourya10/RAG-using-.js.git
cd RAG-using-.js
```

### 2. Install Dependencies

You'll need to have Node.js and npm (or yarn) installed.

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
PINECONE_INDEX_NAME=YOUR_PINECONE_INDEX_NAME
PINECONE_ENVIRONMENT=YOUR_PINECONE_ENVIRONMENT
PINECONE_API_KEY=YOUR_PINECONE_API_KEY
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

#### How to get your own completely free credentials:

*   **GOOGLE_API_KEY**:
    1.  Go to the [Google AI Studio](https://aistudio.google.com/).
    2.  Click on "Get API key" and create a new project or select an existing one.
    3.  Your API key will be generated. Copy and paste it into your `.env` file.

*   **PINECONE_API_KEY, PINECONE_INDEX_NAME, and PINECONE_ENVIRONMENT**:
    1.  Sign up for a free account on the [Pinecone](https://www.pinecone.io/) website.
    2.  After logging in, create a new index.
    3.  **`PINECONE_INDEX_NAME`**: This will be the name you give to your index.
    4.  **`PINECONE_ENVIRONMENT`**: This will be the environment provided by Pinecone for your index (e.g., `us-west1-gcp`).
    5.  **`PINECONE_API_KEY`**: Navigate to the "API Keys" section in your Pinecone dashboard to find your API key.

### 4. Run the Project

This project has two main parts: indexing the document and chatting with it.

**First, index your PDF:**

1.  Place your PDF file in the root of the project and name it `Dsa.pdf` (or update the `PDF_PATH` in `index.js`).
2.  Run the indexing script:

    ```bash
    node index.js
    ```

**Then, start the chat:**

```bash
node query.js
```

## Tech Stack Used

*   **Node.js**: A JavaScript runtime environment.
*   **LangChain.js**: A framework for developing applications powered by language models.
    *   `@langchain/community`: For community-contributed components like the PDFLoader.
    *   `@langchain/textsplitters`: For splitting text into smaller chunks.
    *   `@langchain/google-genai`: For Google Generative AI embeddings.
    *   `@langchain/pinecone`: For integrating with Pinecone.
*   **Google Generative AI**: For generating text embeddings and powering the chat functionality.
*   **Pinecone**: A vector database for storing and retrieving document embeddings.
*   **dotenv**: A module to load environment variables from a `.env` file.
*   **readline-sync**: To get user input from the command line.

## Customization for Your Confidential PDF

This RAG system is designed to work with your own documents, ensuring that the full content of your confidential PDF is not sent to the LLM. Here's how you can customize it:

1.  **Change the PDF File**:
    *   Place your desired PDF in the project's root directory.
    *   In `index.js`, update the `PDF_PATH` constant to the name of your new PDF file:
        ```javascript
        const PDF_PATH = './your-document-name.pdf';
        ```

2.  **Adjust the System Prompt**:
    *   The effectiveness of the RAG system heavily depends on the system prompt provided to the LLM.
    *   Open the `query.js` file.
    *   Locate the `systemInstruction` within the `chatting` function.
    *   Modify the prompt to be more specific to the content of your PDF. For example, if you are using a legal document, you might change it to:
        ```javascript
        systemInstruction: `You are a legal assistant. You will be given a context of relevant information from a legal document and a user question. Your task is to answer the user's question based ONLY on the provided context. If the answer is not in the context, you must say "I could not find the answer in the provided document." Keep your answers clear, concise, and professional.
        
        Context: ${context}
        `,
        ```

By doing this, only the relevant chunks of your document (the context) are sent to the LLM with each query, not the entire file. This maintains the confidentiality of your data.

## Project Explanation

This project works in two main phases: **Indexing** and **Querying**.

### Indexing (`index.js`)

The goal of the indexing phase is to process a PDF document and store its content in a way that can be efficiently searched.

1.  **Load the Document**: The `PDFLoader` from LangChain reads the specified PDF file (`Dsa.pdf`). Each page of the PDF is treated as a separate document.

2.  **Chunk the Documents**: Since LLMs have a limited context window, the loaded documents are split into smaller, manageable chunks. The `RecursiveCharacterTextSplitter` is used for this purpose. It tries to split text based on a hierarchy of characters (like `\n\n`, `\n`, ` `) to keep related pieces of text together. `chunkSize` defines the maximum size of each chunk, and `chunkOverlap` specifies how many characters should be repeated between consecutive chunks to maintain context.

3.  **Embed the Chunks**: Each text chunk is then converted into a numerical representation called an "embedding" or "vector". This is done using the `GoogleGenerativeAIEmbeddings` model (`text-embedding-004`). These embeddings capture the semantic meaning of the text.

4.  **Store in Pinecone**: The generated embeddings, along with their corresponding text chunks (as metadata), are stored in a Pinecone index. Pinecone is a vector database that is highly optimized for fast similarity searches on these embeddings.

### Querying (`query.js`)

The querying phase is where the user interacts with the indexed document.

1.  **Get User Input**: The script uses `readline-sync` to prompt the user for a question in the command line.

2.  **Transform the Query**: The user's question is passed to the `transformQuery` function. This function uses a Gemini model to rewrite the user's question into a standalone query, considering the chat history. This is particularly useful for handling follow-up questions.

3.  **Embed the Query**: The (potentially transformed) user question is then converted into an embedding using the same `GoogleGenerativeAIEmbeddings` model that was used for indexing. This is crucial for comparing the query with the document chunks.

4.  **Search Pinecone**: The query embedding is used to search the Pinecone index. Pinecone performs a similarity search and returns the `topK` (in this case, 10) most similar document chunks from the indexed PDF.

5.  **Retrieve Context**: The text from these top matching chunks is concatenated to form a single "context".

6.  **Generate an Answer with the LLM**: This context, along with the user's original question, is passed to a Gemini model. The model is given a strict system prompt to answer the question *only* based on the provided context. This step is what makes it a "Retrieval-Augmented Generation" system—the LLM's generation is augmented by the retrieved information.

7.  **Display the Answer**: The final answer from the LLM is printed to the console, and the process repeats for the next question.

## Project Pipeline

Here is a visual representation of the project's workflow:

```mermaid
graph TD
    subgraph Document Indexing (index.js)
        G[Load PDF] --> H[Chunk PDF]
        H --> I[Embed Chunks]
        I --> J[Store in Pinecone]
    end

    subgraph Chatting (query.js)
        A[User Input] --> B[transformQuery]
        B --> C[Embedding Query]
        C --> D[Pinecone Search]
        D --> E[Retrieve Context]
        E --> F[LLM Answer]
        F --> K[Display to User]
    end

    J --> D
```


## Further Improvements

Here are some additional points to enhance this project to an industry-level standard:

*   **Frontend Interface**: Create a user-friendly chat interface on a webpage that communicates with the backend API.
*   **Scalability**: For handling a large number of documents or high query loads, consider optimizations in the indexing process and potentially scaling your Pinecone instance.
*   **Advanced Chunking Strategies**: Explore more advanced text splitting strategies that are aware of the document's structure (e.g., splitting by sections or paragraphs).
*   **Hybrid Search**: Implement a hybrid search approach that combines the semantic search of vector embeddings with traditional keyword-based search for better retrieval accuracy.
*   **Evaluation**: Set up an evaluation framework to measure the quality of the RAG system's responses based on metrics like relevance, accuracy, and faithfulness to the source document.
```