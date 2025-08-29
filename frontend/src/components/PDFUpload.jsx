import React, { useRef, useState } from 'react';

const PDFUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === 'application/pdf') {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Chat with your PDF
          </span>
        </h1>
        <p className="text-sm opacity-70 leading-relaxed">
          Upload any PDF document and ask questions about its content.
          <br />
          Your document stays private and secure.
        </p>
      </div>

      <div 
        className={`upload-area relative w-full max-w-md transition-all duration-300 ${
          dragActive 
            ? 'border-purple-400/60 bg-purple-400/10 scale-[1.02]' 
            : 'border-gray-400/30 hover:border-purple-400/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 opacity-60 transform transition-transform duration-200 hover:scale-110">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">
              {dragActive ? 'Drop your PDF here' : 'Choose File'}
            </p>
            <p className="text-xs opacity-60">
              {dragActive ? 'Release to upload' : 'No file chosen'}
            </p>
          </div>

          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary !px-4 !py-2 !text-sm"
          >
            Browse Files
          </button>
        </div>
      </div>

      <div className="glass-card p-4 max-w-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { icon: "🔒", title: "Session-based", desc: "No storage" },
            { icon: "⚡", title: "Fast", desc: "Instant analysis" },
            { icon: "🛡️", title: "Private", desc: "Secure data" }
          ].map((feature) => (
            <div key={feature.title} className="space-y-1">
              <div className="text-lg">{feature.icon}</div>
              <h3 className="text-xs font-medium">{feature.title}</h3>
              <p className="text-xs opacity-60">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;
