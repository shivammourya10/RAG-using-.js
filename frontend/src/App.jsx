import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PDFUpload from './components/PDFUpload';
import ChatInterface from './components/ChatInterface';
import About from './components/About';
import APIService from './services/api';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPDF, setCurrentPDF] = useState(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [messages, setMessages] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  // Check backend health on startup
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await APIService.healthCheck();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
      console.error('Backend is not available:', error);
    }
  };

  const handlePDFUpload = async (file) => {
    try {
      setCurrentPDF(file);
      setIsIndexing(true);
      setMessages([]);
      
      const result = await APIService.uploadPDF(file);
      
      setIsIndexing(false);
      setMessages([{
        type: 'system',
        content: `PDF "${file.name}" has been processed successfully! You can now ask questions about its content.`
      }]);

    } catch (error) {
      setIsIndexing(false);
      setMessages([{
        type: 'error',
        content: `Failed to process PDF: ${error.message}`
      }]);
      console.error('Upload error:', error);
    }
  };

  const handleReset = async () => {
    try {
      await APIService.resetSession();
      setCurrentPDF(null);
      setMessages([]);
      setIsIndexing(false);
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleSendMessage = async (message) => {
    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const result = await APIService.sendQuery(message);
      const botMessage = { 
        type: 'bot', 
        content: result.response 
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      const errorMessage = { 
        type: 'error', 
        content: `Sorry, I couldn't process your question: ${error.message}` 
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Query error:', error);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Floating Gradient Lines - Gemini Style */}
      <div className="floating-lines">
        <div className="gradient-line"></div>
        <div className="gradient-line"></div>
        <div className="gradient-line"></div>
        <div className="gradient-line"></div>
      </div>

      <div className="min-h-screen relative z-10">
        <Navbar 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onReset={handleReset}
          onAbout={() => setShowAbout(true)}
          backendStatus={backendStatus}
        />
        
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {backendStatus === 'disconnected' && (
            <div className="mb-4">
              <div className="glass-card p-3 border-red-500/30 bg-red-500/10 text-sm">
                <p className="text-red-300">⚠️ Backend server is not running. Please start the backend server on port 3001.</p>
              </div>
            </div>
          )}

          {showAbout ? (
            <About onClose={() => setShowAbout(false)} />
          ) : (
            <>
              {!currentPDF ? (
                <PDFUpload 
                  onUpload={handlePDFUpload} 
                  disabled={backendStatus !== 'connected'}
                />
              ) : (
                <ChatInterface 
                  pdfName={currentPDF.name}
                  messages={messages}
                  isIndexing={isIndexing}
                  onSendMessage={handleSendMessage}
                  disabled={backendStatus !== 'connected'}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
