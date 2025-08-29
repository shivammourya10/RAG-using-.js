import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ pdfName, messages, isIndexing, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isIndexing || isLoading) return;

    setIsLoading(true);
    await onSendMessage(inputMessage.trim());
    setInputMessage('');
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Chat with PDF</h2>
            <p className="text-gray-400 text-sm">{pdfName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">
              {isIndexing ? 'Processing...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto card space-y-4">
        {isIndexing && (
          <div className="flex items-center space-x-3 p-4 bg-peach-500/10 border border-peach-500/20 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-peach-500"></div>
            <span className="text-peach-300">Processing your PDF... This may take a moment.</span>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg ${
              message.type === 'user' 
                ? 'bg-peach-500 text-black' 
                : message.type === 'system'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-gray-800 text-white'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isIndexing ? "Please wait while PDF is being processed..." : "Ask a question about your PDF..."}
            disabled={isIndexing || isLoading}
            className="flex-1 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-peach-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isIndexing || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Quick Questions */}
      {messages.length === 1 && !isIndexing && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-400">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "What is this document about?",
              "Summarize the main points",
              "What are the key findings?",
              "Give me an overview"
            ].map((question) => (
              <button
                key={question}
                onClick={() => setInputMessage(question)}
                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full border border-gray-600 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
