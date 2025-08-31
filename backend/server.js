import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { indexPDF } from './services/indexing.js';
import { queryRAG } from './services/querying.js';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Store sessions in memory
const sessions = new Map();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'RAG Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Test endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RAG Backend is live!',
    endpoints: ['/api/health', '/api/upload', '/api/query'],
    timestamp: new Date().toISOString()
  });
});

// PDF Upload and indexing endpoint
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const sessionId = uuidv4();
    console.log(`Starting indexing for session ${sessionId}...`);
    
    await indexPDF(req.file.buffer, sessionId, req.file.originalname);
    
    sessions.set(sessionId, {
      filename: req.file.originalname,
      uploadTime: new Date().toISOString()
    });

    console.log(`Indexing completed for session ${sessionId}`);

    res.json({
      success: true,
      message: 'PDF uploaded and indexed successfully',
      sessionId: sessionId,
      filename: req.file.originalname
    });

  } catch (error) {
    console.error('Upload/Index error:', error);
    res.status(500).json({
      error: 'Failed to process PDF',
      details: error.message
    });
  }
});

// Query endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { question, sessionId } = req.body;

    if (!question || !sessionId) {
      return res.status(400).json({ 
        error: 'Question and sessionId are required' 
      });
    }

    if (!sessions.has(sessionId)) {
      return res.status(404).json({ 
        error: 'Session not found. Please upload a PDF first.' 
      });
    }

    console.log(`Processing query for session ${sessionId}: ${question}`);
    
    const response = await queryRAG(question, sessionId);
    
    res.json({
      success: true,
      answer: response,
      sessionId: sessionId
    });

  } catch (error) {
    console.error(`Query error:`, error);
    res.status(500).json({
      error: 'Failed to process query',
      details: error.message
    });
  }
});

// Reset session endpoint
app.post('/api/reset', (req, res) => {
  const { sessionId } = req.body;
  
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
  }
  
  res.json({ success: true, message: 'Session reset' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(` RAG Backend server running on port ${PORT}`);
  console.log(` Frontend URL: http://localhost:5173`);
  console.log(` Backend URL: http://localhost:${PORT}`);
});
