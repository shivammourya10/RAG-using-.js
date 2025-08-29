import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PDFUpload from './components/PDFUpload';
import ChatInterface from './components/ChatInterface';
import About from './components/About';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPDF, setCurrentPDF] = useState(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [messages, setMessages] = useState([]);

  const handlePDFUpload = async (file) => {
    setCurrentPDF(file);
    setIsIndexing(true);
    setMessages([]);
    
    // TODO: Send PDF to backend for indexing
    setTimeout(() => {
      setIsIndexing(false);
      setMessages([{
        type: 'system',
        content: `PDF "${file.name}" has been processed. You can now ask questions about its content.`
      }]);
    }, 3000);
  };

  const handleReset = () => {
    setCurrentPDF(null);
    setMessages([]);
    setIsIndexing(false);
    // TODO: Clear backend session
  };

  const handleSendMessage = async (message) => {
    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    
    // TODO: Send to backend and get response
    setTimeout(() => {
      const botMessage = { 
        type: 'bot', 
        content: 'This is a demo response. Backend integration coming soon!' 
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-black text-white min-h-screen">
        <Navbar 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onReset={handleReset}
          onAbout={() => setShowAbout(true)}
        />
        
        <main className="container mx-auto px-4 py-8">
          {showAbout ? (
            <About onClose={() => setShowAbout(false)} />
          ) : (
            <>
              {!currentPDF ? (
                <PDFUpload onUpload={handlePDFUpload} />
              ) : (
                <ChatInterface 
                  pdfName={currentPDF.name}
                  messages={messages}
                  isIndexing={isIndexing}
                  onSendMessage={handleSendMessage}
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
