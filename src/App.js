import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import PromptList from './components/PromptList';
import PromptEditor from './components/PromptEditor';
import ClipboardPanel from './components/ClipboardPanel';
import Header from './components/Header';

function App() {
  const [folders, setFolders] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [clipboardItems, setClipboardItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('prompts'); // 'prompts' or 'clipboard'
  const [isElectronReady, setIsElectronReady] = useState(false);

  useEffect(() => {
    console.log('App mounted, checking electronAPI...');
    console.log('window.electronAPI:', window.electronAPI);
    
    // Electron API kontrolü
    if (!window.electronAPI) {
      console.error('Electron API bulunamadı! Uygulama Electron içinde çalışmıyor olabilir.');
      console.log('Available window properties:', Object.keys(window));
      
      // Birkaç kez dene
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        console.log(`Attempt ${attempts}: Checking electronAPI...`);
        
        if (window.electronAPI) {
          console.log('electronAPI found!');
          clearInterval(checkInterval);
          setIsElectronReady(true);
        } else if (attempts >= 10) {
          console.error('electronAPI not found after 10 attempts');
          clearInterval(checkInterval);
          // Yine de göster, en azından UI görünsün
          setIsElectronReady(true);
        }
      }, 500);
      
      return () => clearInterval(checkInterval);
    }

    console.log('electronAPI is ready!');
    setIsElectronReady(true);
  }, []);

  useEffect(() => {
    if (!isElectronReady) return;

    loadFolders();
    loadPrompts();
    loadClipboard();

    // Clipboard'ı her 2 saniyede bir yenile
    const interval = setInterval(() => {
      loadClipboard();
    }, 2000);

    return () => clearInterval(interval);
  }, [isElectronReady]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else if (selectedFolder) {
      loadPromptsByFolder(selectedFolder);
    } else {
      loadPrompts();
    }
  }, [selectedFolder, searchQuery]);

  const loadFolders = async () => {
    if (window.electronAPI) {
      const data = await window.electronAPI.folders.getAll();
      setFolders(data);
    }
  };

  const loadPrompts = async () => {
    if (window.electronAPI) {
      const data = await window.electronAPI.prompts.getAll();
      setPrompts(data);
    }
  };

  const loadPromptsByFolder = async (folderId) => {
    if (window.electronAPI) {
      const data = await window.electronAPI.prompts.getByFolder(folderId);
      setPrompts(data);
    }
  };

  const loadClipboard = async () => {
    if (window.electronAPI) {
      const data = await window.electronAPI.clipboard.getAll(100);
      setClipboardItems(data);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadPrompts();
      return;
    }
    if (window.electronAPI) {
      const data = await window.electronAPI.prompts.search(query);
      setPrompts(data);
    }
  };

  const handleCreateFolder = async (folder) => {
    if (window.electronAPI) {
      await window.electronAPI.folders.create(folder);
      loadFolders();
    }
  };

  const handleUpdateFolder = async (id, folder) => {
    if (window.electronAPI) {
      await window.electronAPI.folders.update(id, folder);
      loadFolders();
    }
  };

  const handleDeleteFolder = async (id) => {
    if (window.electronAPI) {
      await window.electronAPI.folders.delete(id);
      loadFolders();
      if (selectedFolder === id) {
        setSelectedFolder(null);
        loadPrompts();
      }
    }
  };

  const handleCreatePrompt = async (prompt) => {
    if (window.electronAPI) {
      const newPrompt = await window.electronAPI.prompts.create(prompt);
      loadPrompts();
      setSelectedPrompt(newPrompt);
    }
  };

  const handleUpdatePrompt = async (id, prompt) => {
    if (window.electronAPI) {
      await window.electronAPI.prompts.update(id, prompt);
      loadPrompts();
    }
  };

  const handleDeletePrompt = async (id) => {
    if (window.electronAPI) {
      await window.electronAPI.prompts.delete(id);
      loadPrompts();
      if (selectedPrompt?.id === id) {
        setSelectedPrompt(null);
      }
    }
  };

  const handleCopyToClipboard = async (text) => {
    if (window.electronAPI) {
      await window.electronAPI.clipboard.copyToClipboard(text);
    }
  };

  if (!isElectronReady) {
    return (
      <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f0f2f5' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#6366f1', marginBottom: '16px' }}>PromptKit Yükleniyor...</h2>
          <p style={{ color: '#6b7280' }}>Electron API bekleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        view={view}
        onViewChange={setView}
      />
      <div className="app-content">
        <Sidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onCreateFolder={handleCreateFolder}
          onUpdateFolder={handleUpdateFolder}
          onDeleteFolder={handleDeleteFolder}
        />
        
        {view === 'prompts' ? (
          <>
            <PromptList
              prompts={prompts}
              selectedPrompt={selectedPrompt}
              onSelectPrompt={setSelectedPrompt}
              onCreatePrompt={handleCreatePrompt}
            />
            <PromptEditor
              prompt={selectedPrompt}
              folders={folders}
              onSave={handleUpdatePrompt}
              onDelete={handleDeletePrompt}
              onCopy={handleCopyToClipboard}
            />
          </>
        ) : (
          <ClipboardPanel
            items={clipboardItems}
            onCopy={handleCopyToClipboard}
            onRefresh={loadClipboard}
          />
        )}
      </div>
    </div>
  );
}

export default App;
