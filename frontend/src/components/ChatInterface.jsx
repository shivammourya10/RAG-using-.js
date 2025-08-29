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
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Chat with PDF
            </h2>
            <p className="opacity-70 mt-1 text-sm">📄 {pdfName}</p>
          </div>
          <div className="flex items-center space-x-2 glass-card px-3 py-1.5">
            <div className={`w-2 h-2 rounded-full ${isIndexing ? 'bg-yellow-400 loading-pulse' : 'bg-green-400'}`}></div>
            <span className="text-xs opacity-70">
              {isIndexing ? 'Processing...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass-card p-4 space-y-4">
        {isIndexing && (
          <div className="glass-card p-3 border border-yellow-400/30 bg-yellow-400/10">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
              <span className="text-yellow-300 text-sm">Processing your PDF...</span>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${
              message.type === 'user' 
                ? 'message-user' 
                : message.type === 'system'
                ? 'glass-card p-3 border border-blue-400/30 bg-blue-400/10'
                : message.type === 'error'
                ? 'glass-card p-3 border border-red-400/30 bg-red-400/10'
                : 'message-bot'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="message-bot">
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
                <span className="opacity-70 text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="glass-card p-3">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isIndexing ? "Please wait..." : "Ask a question about your PDF..."}
              disabled={isIndexing || isLoading}
              className="flex-1 bg-transparent text-white placeholder-white/50 border-none outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isIndexing || isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed !px-4 !py-1.5"
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

      {/* Quick Questions */}
      {messages.length === 1 && !isIndexing && (
        <div className="mt-4 glass-card p-4">
          <p className="text-xs opacity-60 mb-3">💡 Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "What is this about?",
              "Summarize main points",
              "Key findings?",
              "Give overview"
            ].map((question) => (
              <button
                key={question}
                onClick={() => setInputMessage(question)}
                className="btn-secondary !px-3 !py-1.5 text-xs hover:scale-105 transition-all duration-200"
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
