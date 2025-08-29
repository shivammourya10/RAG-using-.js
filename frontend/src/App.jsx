import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GeminiChat from './components/GeminiChat';
import About from './components/About';
import APIService from './services/api';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
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
      const result = await APIService.uploadPDF(file);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleReset = async () => {
    try {
      await APIService.resetSession();
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleSendMessage = async (message) => {
    try {
      const result = await APIService.sendQuery(message);
      return result.response;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
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
        
        <main className="container mx-auto px-4 max-w-6xl">
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
            <GeminiChat 
              onFileUpload={handlePDFUpload}
              onSendMessage={handleSendMessage}
              backendStatus={backendStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
