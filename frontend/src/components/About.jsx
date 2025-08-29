import React from 'react';

const About = ({ onClose }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold">About RAGChat</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* What is RAGChat */}
          <section>
            <h3 className="text-xl font-semibold text-peach-500 mb-3">What is RAGChat?</h3>
            <p className="text-gray-300 leading-relaxed">
              RAGChat is a privacy-focused document intelligence system that uses Retrieval-Augmented Generation (RAG) 
              to help you extract insights from your PDF documents. Simply upload any PDF and start asking questions 
              about its content in natural language.
            </p>
          </section>

          {/* How it Works */}
          <section>
            <h3 className="text-xl font-semibold text-peach-500 mb-3">How it Works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-peach-500 text-black rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium">Document Processing</h4>
                  <p className="text-gray-400">Your PDF is broken into smaller chunks and converted into vector embeddings for semantic search.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-peach-500 text-black rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium">Intelligent Retrieval</h4>
                  <p className="text-gray-400">When you ask a question, the system finds the most relevant sections from your document.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-peach-500 text-black rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium">AI-Powered Answers</h4>
                  <p className="text-gray-400">Only the relevant context is sent to the AI model, which generates accurate answers based on your document.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section>
            <h3 className="text-xl font-semibold text-peach-500 mb-3">Privacy & Security</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-green-400">Session-Based</span>
                </div>
                <p className="text-gray-300 text-sm">No permanent storage of your documents</p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-green-400">Contextual Processing</span>
                </div>
                <p className="text-gray-300 text-sm">Only relevant snippets sent to AI, not full document</p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-green-400">Auto-Delete</span>
                </div>
                <p className="text-gray-300 text-sm">Data automatically cleared when session ends</p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-green-400">Local Processing</span>
                </div>
                <p className="text-gray-300 text-sm">Document parsing happens in your browser</p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section>
            <h3 className="text-xl font-semibold text-peach-500 mb-3">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'React', desc: 'Frontend framework' },
                { name: 'LangChain', desc: 'RAG pipeline' },
                { name: 'Pinecone', desc: 'Vector database' },
                { name: 'Google Gemini', desc: 'AI language model' }
              ].map((tech) => (
                <div key={tech.name} className="bg-gray-800 rounded-lg p-3 text-center">
                  <h4 className="font-medium">{tech.name}</h4>
                  <p className="text-gray-400 text-xs mt-1">{tech.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-xl font-semibold text-peach-500 mb-3">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Upload any PDF document',
                'Ask questions in natural language',
                'Get contextual, accurate answers',
                'Conversation memory for follow-ups',
                'Dark/light theme support',
                'Mobile-responsive design',
                'No sign-up required',
                'Complete data privacy'
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-peach-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
