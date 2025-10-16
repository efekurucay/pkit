import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import PromptList from './components/PromptList';
import PromptEditor from './components/PromptEditor';
import ClipboardPanel from './components/ClipboardPanel';
import Header from './components/Header';
import Toast from './components/Toast';
import Settings from './components/Settings';

function App() {
  const [folders, setFolders] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [clipboardItems, setClipboardItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('prompts'); // 'prompts' or 'clipboard'
  const [isElectronReady, setIsElectronReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

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

    // Clipboard'ı sadece clipboard görünümündeyken yenile (5 saniyede bir)
    const interval = setInterval(() => {
      if (view === 'clipboard') {
        loadClipboard();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isElectronReady, view]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else if (selectedFolder) {
      loadPromptsByFolder(selectedFolder);
    } else {
      loadPrompts();
    }
  }, [selectedFolder, searchQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+N: New prompt
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (view === 'prompts') {
          handleCreatePrompt({
            title: 'Yeni Prompt',
            content: '',
            folder_id: selectedFolder,
            tags: '',
            is_favorite: false
          });
        }
      }
      // Ctrl+F: Focus search
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
      }
      // Ctrl+1: Switch to prompts view
      if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        setView('prompts');
      }
      // Ctrl+2: Switch to clipboard view
      if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        setView('clipboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, selectedFolder]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const loadFolders = async () => {
    try {
      if (window.electronAPI) {
        const data = await window.electronAPI.folders.getAll();
        setFolders(data);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
      showToast('Klasörler yüklenirken hata oluştu', 'error');
    }
  };

  const loadPrompts = async () => {
    try {
      if (window.electronAPI) {
        const data = await window.electronAPI.prompts.getAll();
        setPrompts(data);
      }
    } catch (error) {
      console.error('Error loading prompts:', error);
      showToast('Promptlar yüklenirken hata oluştu', 'error');
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
    try {
      if (window.electronAPI) {
        await window.electronAPI.folders.create(folder);
        loadFolders();
        showToast('Klasör oluşturuldu', 'success');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      showToast('Klasör oluşturulurken hata oluştu', 'error');
    }
  };

  const handleUpdateFolder = async (id, folder) => {
    if (window.electronAPI) {
      await window.electronAPI.folders.update(id, folder);
      loadFolders();
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.folders.delete(id);
        loadFolders();
        if (selectedFolder === id) {
          setSelectedFolder(null);
          loadPrompts();
        }
        showToast('Klasör silindi', 'success');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      showToast('Klasör silinirken hata oluştu', 'error');
    }
  };

  const handleCreatePrompt = async (prompt) => {
    try {
      if (window.electronAPI) {
        const newPrompt = await window.electronAPI.prompts.create(prompt);
        loadPrompts();
        setSelectedPrompt(newPrompt);
        showToast('Prompt oluşturuldu', 'success');
      }
    } catch (error) {
      console.error('Error creating prompt:', error);
      showToast('Prompt oluşturulurken hata oluştu', 'error');
    }
  };

  const handleUpdatePrompt = async (id, prompt) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.prompts.update(id, prompt);
        loadPrompts();
        showToast('Prompt kaydedildi', 'success');
      }
    } catch (error) {
      console.error('Error updating prompt:', error);
      showToast('Prompt kaydedilirken hata oluştu', 'error');
    }
  };

  const handleDeletePrompt = async (id) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.prompts.delete(id);
        loadPrompts();
        if (selectedPrompt?.id === id) {
          setSelectedPrompt(null);
        }
        showToast('Prompt silindi', 'success');
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      showToast('Prompt silinirken hata oluştu', 'error');
    }
  };

  const handleCopyToClipboard = async (text) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.clipboard.copyToClipboard(text);
        showToast('Panoya kopyalandı', 'success');
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast('Kopyalama başarısız', 'error');
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
        onSettingsClick={() => setShowSettings(true)}
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onSave={(message) => {
            setShowSettings(false);
            showToast(message, 'success');
          }}
        />
      )}
    </div>
  );
}

export default App;
