import React from 'react';

const About = ({ onClose }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            About RAGChat
          </h2>
          <button 
            onClick={onClose}
            className="btn-primary !px-3 !py-1.5 hover:scale-110 transition-all duration-200"
            title="Close About"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* What is RAGChat */}
          <section className="glass-card p-4">
            <h3 className="text-lg font-medium mb-3">What is RAGChat?</h3>
            <p className="opacity-80 leading-relaxed text-sm">
              RAGChat is a privacy-focused document intelligence system that uses Retrieval-Augmented Generation (RAG) 
              to help you extract insights from your PDF documents. Simply upload any PDF and start asking questions 
              about its content in natural language.
            </p>
          </section>

          {/* How it Works */}
          <section className="glass-card p-4">
            <h3 className="text-lg font-medium mb-4">How it Works</h3>
            <div className="space-y-4">
              {[
                { 
                  step: "1", 
                  title: "Document Processing", 
                  desc: "Your PDF is broken into smaller chunks and converted into vector embeddings for semantic search." 
                },
                { 
                  step: "2", 
                  title: "Intelligent Retrieval", 
                  desc: "When you ask a question, the system finds the most relevant sections from your document." 
                },
                { 
                  step: "3", 
                  title: "AI-Powered Answers", 
                  desc: "Only the relevant context is sent to the AI model, which generates accurate answers based on your document." 
                }
              ].map((item) => (
                <div key={item.step} className="flex items-start space-x-3 glass-card p-3">
                  <div className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-semibold shadow-lg">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                    <p className="opacity-70 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="glass-card p-4">
            <h3 className="text-lg font-medium mb-4">Privacy & Security</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { title: "Session-Based", desc: "No permanent storage of your documents" },
                { title: "Contextual Processing", desc: "Only relevant snippets sent to AI, not full document" },
                { title: "Auto-Delete", desc: "Data automatically cleared when session ends" },
                { title: "Local Processing", desc: "Document parsing happens in your browser" }
              ].map((feature) => (
                <div key={feature.title} className="glass-card p-3 border border-green-400/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-green-400 text-sm">{feature.title}</span>
                  </div>
                  <p className="opacity-70 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Technology Stack */}
          <section className="glass-card p-4">
            <h3 className="text-lg font-medium mb-4">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'React', desc: 'Frontend framework' },
                { name: 'LangChain', desc: 'RAG pipeline' },
                { name: 'Pinecone', desc: 'Vector database' },
                { name: 'Google Gemini', desc: 'AI language model' }
              ].map((tech) => (
                <div key={tech.name} className="glass-card p-3 text-center hover:scale-105 transition-transform duration-200">
                  <h4 className="font-medium text-sm">{tech.name}</h4>
                  <p className="opacity-60 text-xs mt-1">{tech.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Back to Home Button */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={onClose}
              className="btn-primary !px-6 !py-2 text-sm font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
