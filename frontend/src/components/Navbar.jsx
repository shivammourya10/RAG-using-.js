import React from 'react';

const Navbar = ({ isDarkMode, setIsDarkMode, onReset, onAbout, backendStatus }) => {
  const getStatusColor = () => {
    switch(backendStatus) {
      case 'connected': return 'bg-green-400';
      case 'disconnected': return 'bg-red-400';
      default: return 'bg-yellow-400';
    }
  };

  const getStatusText = () => {
    switch(backendStatus) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      default: return 'Checking...';
    }
  };

  return (
    <nav className="nav-glass">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="text-lg font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              RAGChat
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="opacity-70">{getStatusText()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={onAbout}
            className="text-xs opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-105"
          >
            About
          </button>
          
          <button 
            onClick={onReset}
            className="btn-secondary !px-3 !py-1.5 !text-xs"
            disabled={backendStatus !== 'connected'}
          >
            Reset
          </button>
          
          {/* Custom Theme Toggle */}
          <div 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="theme-toggle"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className="theme-toggle-knob flex items-center justify-center">
              {isDarkMode ? (
                <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
