import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import your existing RAG functions (we'll modularize them)
import { indexPDF } from './services/indexing.js';
import { queryRAG } from './services/querying.js';
import { clearSession } from './services/session.js';

dotenv.config({ path: '../.env' }); // Load from parent directory

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || false
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const sessionId = req.body.sessionId || uuidv4();
    const filename = `${sessionId}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Store active sessions
const activeSessions = new Map();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RAG Backend is running' });
});

// Upload and index PDF
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const sessionId = uuidv4();
    const filePath = req.file.path;
    
    console.log(`Starting indexing for session ${sessionId}...`);
    
    // Index the PDF
    await indexPDF(filePath, sessionId);
    
    // Store session info
    activeSessions.set(sessionId, {
      filePath,
      originalName: req.file.originalname,
      createdAt: new Date(),
      conversationHistory: []
    });

    console.log(`Indexing completed for session ${sessionId}`);

    res.json({
      sessionId,
      message: 'PDF uploaded and indexed successfully',
      filename: req.file.originalname
    });

  } catch (error) {
    console.error('Upload/Index error:', error);
    res.status(500).json({ error: 'Failed to process PDF: ' + error.message });
  }
});

// Query the RAG system
app.post('/api/query', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !activeSessions.has(sessionId)) {
      return res.status(400).json({ error: 'Invalid or expired session' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const session = activeSessions.get(sessionId);
    
    console.log(`Processing query for session ${sessionId}: ${message}`);

    // Get response from RAG system
    const response = await queryRAG(message, sessionId, session.conversationHistory);

    // Update conversation history
    session.conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    );

    console.log(`Query completed for session ${sessionId}`);

    res.json({
      response,
      sessionId
    });

  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Failed to process query: ' + error.message });
  }
});

// Reset/clear session
app.post('/api/reset', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (sessionId && activeSessions.has(sessionId)) {
      const session = activeSessions.get(sessionId);
      
      // Delete uploaded file
      if (fs.existsSync(session.filePath)) {
        fs.unlinkSync(session.filePath);
      }

      // Clear Pinecone namespace
      await clearSession(sessionId);

      // Remove from active sessions
      activeSessions.delete(sessionId);

      console.log(`Session ${sessionId} cleared`);
    }

    res.json({ message: 'Session cleared successfully' });

  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ error: 'Failed to clear session: ' + error.message });
  }
});

// Get session info
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (!activeSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const session = activeSessions.get(sessionId);
  res.json({
    sessionId,
    filename: session.originalName,
    createdAt: session.createdAt,
    messageCount: session.conversationHistory.length / 2
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Cleanup function for expired sessions (run every hour)
setInterval(() => {
  const now = new Date();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.createdAt > maxAge) {
      try {
        if (fs.existsSync(session.filePath)) {
          fs.unlinkSync(session.filePath);
        }
        clearSession(sessionId).catch(console.error);
        activeSessions.delete(sessionId);
        console.log(`Expired session ${sessionId} cleaned up`);
      } catch (error) {
        console.error(`Error cleaning up session ${sessionId}:`, error);
      }
    }
  }
}, 60 * 60 * 1000); // Run every hour

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

const server = app.listen(PORT, '0.0.0.0', () => {
  const mode = process.env.NODE_ENV || 'development';
  console.log(`🚀 RAG Backend server running on port ${PORT} in ${mode} mode`);
  
  if (mode === 'development') {
    console.log(`📄 Frontend URL: http://localhost:5173`);
    console.log(`🔗 Backend URL: http://localhost:${PORT}`);
  }
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
