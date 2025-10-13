import React from 'react';
import { Search, FileText, Clipboard } from 'lucide-react';
import './Header.css';

function Header({ searchQuery, onSearchChange, view, onViewChange }) {
  return (
    <div className="header">
      <div className="header-left">
        <h1 className="app-title">PromptKit</h1>
      </div>
      
      <div className="header-center">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Prompt veya içerik ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <button
          className={`view-toggle ${view === 'prompts' ? 'active' : ''}`}
          onClick={() => onViewChange('prompts')}
          title="Promptlar"
        >
          <FileText size={20} />
        </button>
        <button
          className={`view-toggle ${view === 'clipboard' ? 'active' : ''}`}
          onClick={() => onViewChange('clipboard')}
          title="Clipboard Geçmişi"
        >
          <Clipboard size={20} />
        </button>
      </div>
    </div>
  );
}

export default Header;
