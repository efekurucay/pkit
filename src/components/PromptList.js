import React from 'react';
import { Plus, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import './PromptList.css';

function PromptList({ prompts, selectedPrompt, onSelectPrompt, onCreatePrompt }) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 0 ? 'Az önce' : `${minutes} dakika önce`;
      }
      return `${hours} saat önce`;
    } else if (days === 1) {
      return 'Dün';
    } else if (days < 7) {
      return `${days} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }
  };

  const handleCreateNew = () => {
    const newPrompt = {
      title: 'Yeni Prompt',
      content: '',
      folder_id: null,
      tags: '',
      is_favorite: false
    };
    onCreatePrompt(newPrompt);
  };

  return (
    <div className="prompt-list">
      <div className="prompt-list-header">
        <h2>Promptlar ({prompts.length})</h2>
        <button
          className="icon-button primary"
          onClick={handleCreateNew}
          title="Yeni Prompt"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="prompt-items">
        {prompts.length === 0 ? (
          <div className="empty-state">
            <p>Henüz prompt yok</p>
            <button className="create-first-button" onClick={handleCreateNew}>
              <Plus size={18} />
              İlk Promptu Oluştur
            </button>
          </div>
        ) : (
          prompts.map((prompt) => (
            <Card
              key={prompt.id}
              className={`prompt-item ${selectedPrompt?.id === prompt.id ? 'selected' : ''}`}
              onClick={() => onSelectPrompt(prompt)}
            >
              <CardHeader>
                <CardTitle className="prompt-title">
                  {prompt.is_favorite && <Star size={14} className="favorite-icon" fill="currentColor" />}
                  {prompt.title}
                </CardTitle>
                <span className="prompt-time">
                  <Clock size={12} />
                  {formatDate(prompt.updated_at)}
                </span>
              </CardHeader>
              <CardContent>
                <p className="prompt-preview">
                  {prompt.content.substring(0, 100)}
                  {prompt.content.length > 100 && '...'}
                </p>
                {prompt.folder_name && (
                  <div className="prompt-folder">
                    <span
                      className="folder-badge"
                      style={{ backgroundColor: prompt.folder_color + '20', color: prompt.folder_color }}
                    >
                      {prompt.folder_name}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default PromptList;
