import React, { useState, useEffect } from 'react';
import { Folder, Palette, Save, X } from 'lucide-react';

const FolderDialog = ({ isOpen, onClose, onSave, folder = null, folders = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    parent_id: null,
    color: '#6366f1',
    icon: 'folder'
  });

  useEffect(() => {
    if (folder) {
      setFormData({
        name: folder.name || '',
        parent_id: folder.parent_id || null,
        color: folder.color || '#6366f1',
        icon: folder.icon || 'folder'
      });
    } else {
      setFormData({
        name: '',
        parent_id: null,
        color: '#6366f1',
        icon: 'folder'
      });
    }
  }, [folder, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave({
        ...formData,
        name: formData.name.trim()
      });
      onClose();
    }
  };

  const colorOptions = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#ec4899', // Pink
    '#6b7280'  // Gray
  ];

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-panel" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <div className="dialog-title">
            <Folder size={20} />
            <h2>{folder ? 'Klasörü Düzenle' : 'Yeni Klasör'}</h2>
          </div>
          <button className="dialog-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dialog-content">
          <div className="form-group">
            <label htmlFor="folder-name">Klasör Adı</label>
            <input
              id="folder-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Klasör adı girin..."
              className="form-input"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label>Üst Klasör</label>
            <select
              value={formData.parent_id || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value || null }))}
              className="form-select"
            >
              <option value="">Kök klasör</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Renk</label>
            <div className="color-picker">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn-primary">
              <Save size={18} />
              {folder ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderDialog;
