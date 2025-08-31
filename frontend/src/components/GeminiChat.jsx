import React, { useState, useRef, useEffect } from 'react';
import config from '../config.js';

const GeminiChat = ({ onFileUpload, onSendMessage, backendStatus }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [currentPDF, setCurrentPDF] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') return;

    setCurrentPDF(file);
    setIsIndexing(true);
    
    // Add file upload message
    const fileMessage = {
      type: 'file',
      content: `📄 Uploaded: ${file.name}`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, fileMessage]);

    try {
      await onFileUpload(file);
      setHasUploadedFile(true);
      setIsIndexing(false);
      
      const successMessage = {
        type: 'system',
        content: `PDF "${file.name}" has been processed successfully! You can now ask questions about its content.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      setIsIndexing(false);
      const errorMessage = {
        type: 'error',
        content: `Failed to process PDF: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Check if user is trying to chat without uploading a file
    if (!hasUploadedFile && !isIndexing) {
      const warningMessage = {
        type: 'warning',
        content: 'Please upload a PDF file first before asking questions.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, warningMessage]);
      return;
    }

    if (isIndexing) {
      const warningMessage = {
        type: 'warning',
        content: 'Please wait while your PDF is being processed...',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, warningMessage]);
      return;
    }

    const userMessage = {
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(inputMessage.trim());
      const botMessage = {
        type: 'bot',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: `Sorry, I couldn't process your question: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderMessage = (message, index) => {
    const baseClasses = "p-3 rounded-xl text-sm max-w-[80%] text-white";
    
    switch (message.type) {
      case 'user':
        return (
          <div key={index} className="flex justify-end">
            <div className={`${baseClasses} bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 ml-12`}>
              {message.content}
            </div>
          </div>
        );
      case 'bot':
        return (
          <div key={index} className="flex justify-start">
            <div className={`${baseClasses} bg-white/10 backdrop-blur-sm border border-white/20 mr-12`}>
              {message.content}
            </div>
          </div>
        );
      case 'file':
        return (
          <div key={index} className="flex justify-center">
            <div className={`${baseClasses} bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-center`}>
              {message.content}
            </div>
          </div>
        );
      case 'system':
        return (
          <div key={index} className="flex justify-center">
            <div className={`${baseClasses} bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 text-center`}>
              {message.content}
            </div>
          </div>
        );
      case 'warning':
        return (
          <div key={index} className="flex justify-center">
            <div className={`${baseClasses} bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 text-center text-yellow-300`}>
              ⚠️ {message.content}
            </div>
          </div>
        );
      case 'error':
        return (
          <div key={index} className="flex justify-center">
            <div className={`${baseClasses} bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-center text-red-300`}>
              ❌ {message.content}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col pt-16">
      {/* Floating Background Lines */}
      <div className="floating-lines">
        <div className="floating-line"></div>
        <div className="floating-line"></div>
        <div className="floating-line"></div>
        <div className="floating-line"></div>
        <div className="floating-line"></div>
        <div className="floating-line"></div>
      </div>

      {/* Header with Simple Title */}
      <div className="text-center mb-8 px-6">
        <h1 className="text-4xl font-semibold text-white mb-2 drop-shadow-lg">
          Chat with your PDF
        </h1>
        <p className="text-gray-400 text-sm">
          Upload a PDF and start asking questions about its content
        </p>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-6 pb-4 space-y-4"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        {messages.map((message, index) => renderMessage(message, index))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mr-12 text-sm border border-white/20 text-white">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                <span className="opacity-70">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {isIndexing && (
          <div className="flex justify-center">
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-3 text-sm border border-purple-400/30 text-white">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                <span className="text-purple-300">Processing PDF...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="sticky bottom-0 bg-gray-900/80 backdrop-blur-sm border-t border-white/10 p-4">
        <form onSubmit={handleSubmit}>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3">
            <div className="flex items-center space-x-3">
              {/* File Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 opacity-70 hover:opacity-100"
                disabled={backendStatus !== 'connected'}
                title="Upload PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  backendStatus !== 'connected' 
                    ? "Please check server connection..." 
                    : !hasUploadedFile 
                      ? "Click 📎 to upload PDF or drag & drop, then ask questions..."
                      : isIndexing
                        ? "Processing PDF..."
                        : "Ask a question about your PDF..."
                }
                disabled={backendStatus !== 'connected' || isLoading}
                className="flex-1 bg-transparent text-white placeholder-white/50 border-none outline-none text-sm"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading || backendStatus !== 'connected'}
                className="p-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default GeminiChat;
