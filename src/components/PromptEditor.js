import React, { useState, useEffect } from 'react';
import { Save, Copy, Trash2, Star, FolderOpen } from 'lucide-react';
import './PromptEditor.css';

function PromptEditor({ prompt, folders, onSave, onDelete, onCopy }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folderId, setFolderId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tags, setTags] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title || '');
      setContent(prompt.content || '');
      setFolderId(prompt.folder_id || null);
      setIsFavorite(prompt.is_favorite || false);
      setTags(prompt.tags || '');
      setHasChanges(false);
    }
  }, [prompt]);

  // Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (hasChanges && prompt) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges, prompt, title, content, folderId, isFavorite, tags]);

  const handleSave = () => {
    if (prompt && hasChanges) {
      onSave(prompt.id, {
        title,
        content,
        folder_id: folderId,
        is_favorite: isFavorite,
        tags
      });
      setHasChanges(false);
    }
  };

  const handleCopy = () => {
    onCopy(content);
  };

  const handleDelete = () => {
    if (prompt && window.confirm('Bu promptu silmek istediğinize emin misiniz?')) {
      onDelete(prompt.id);
    }
  };

  const handleChange = (setter) => (value) => {
    setter(value);
    setHasChanges(true);
  };

  if (!prompt) {
    return (
      <div className="prompt-editor empty">
        <div className="empty-editor-state">
          <p>Bir prompt seçin veya yeni bir tane oluşturun</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prompt-editor">
      <div className="editor-header">
        <div className="editor-actions">
          <button
            className="icon-button"
            onClick={() => handleChange(setIsFavorite)(!isFavorite)}
            title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          >
            <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} color={isFavorite ? '#fbbf24' : '#6b7280'} />
          </button>
          <button
            className="icon-button"
            onClick={handleCopy}
            title="Kopyala"
          >
            <Copy size={20} />
          </button>
          <button
            className="icon-button danger"
            onClick={handleDelete}
            title="Sil"
          >
            <Trash2 size={20} />
          </button>
        </div>
        <button
          className={`save-button ${hasChanges ? 'has-changes' : ''}`}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          <Save size={18} />
          {hasChanges ? 'Kaydet' : 'Kaydedildi'}
        </button>
      </div>

      <div className="editor-content">
        <input
          type="text"
          className="title-input"
          placeholder="Prompt başlığı..."
          value={title}
          onChange={(e) => handleChange(setTitle)(e.target.value)}
        />

        <div className="editor-meta">
          <div className="meta-item">
            <FolderOpen size={16} />
            <select
              value={folderId || ''}
              onChange={(e) => handleChange(setFolderId)(e.target.value || null)}
              className="folder-select"
            >
              <option value="">Klasör Seç</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          className="content-textarea"
          placeholder="Prompt içeriğini buraya yazın..."
          value={content}
          onChange={(e) => handleChange(setContent)(e.target.value)}
        />

        <div className="editor-footer">
          <div className="character-count">
            {content.length} karakter
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptEditor;
