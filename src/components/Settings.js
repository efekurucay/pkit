import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, Save } from 'lucide-react';
import './Settings.css';

function Settings({ onClose, onSave }) {
  const [settings, setSettings] = useState({
    clipboard_enabled: 'true',
    clipboard_max_items: '1000',
    clipboard_ignore_duplicates: 'true'
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (window.electronAPI) {
      const enabled = await window.electronAPI.settings.get('clipboard_enabled');
      const maxItems = await window.electronAPI.settings.get('clipboard_max_items');
      const ignoreDuplicates = await window.electronAPI.settings.get('clipboard_ignore_duplicates');
      
      setSettings({
        clipboard_enabled: enabled || 'true',
        clipboard_max_items: maxItems || '1000',
        clipboard_ignore_duplicates: ignoreDuplicates || 'true'
      });
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (window.electronAPI) {
      for (const [key, value] of Object.entries(settings)) {
        await window.electronAPI.settings.set(key, value);
      }
      setHasChanges(false);
      onSave?.('Ayarlar kaydedildi');
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <div className="settings-title">
            <SettingsIcon size={20} />
            <h2>Ayarlar</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Clipboard Geçmişi</h3>
            
            <div className="setting-item">
              <div className="setting-label">
                <label htmlFor="clipboard-enabled">Clipboard İzleme</label>
                <p className="setting-description">
                  Kopyalanan metinleri otomatik olarak kaydet
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  id="clipboard-enabled"
                  type="checkbox"
                  checked={settings.clipboard_enabled === 'true'}
                  onChange={(e) => handleChange('clipboard_enabled', e.target.checked ? 'true' : 'false')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <label htmlFor="ignore-duplicates">Tekrarları Yoksay</label>
                <p className="setting-description">
                  Aynı içeriği birden fazla kez kaydetme
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  id="ignore-duplicates"
                  type="checkbox"
                  checked={settings.clipboard_ignore_duplicates === 'true'}
                  onChange={(e) => handleChange('clipboard_ignore_duplicates', e.target.checked ? 'true' : 'false')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <label htmlFor="max-items">Maksimum Öğe Sayısı</label>
                <p className="setting-description">
                  Clipboard geçmişinde saklanacak maksimum öğe sayısı
                </p>
              </div>
              <input
                id="max-items"
                type="number"
                min="100"
                max="10000"
                step="100"
                value={settings.clipboard_max_items}
                onChange={(e) => handleChange('clipboard_max_items', e.target.value)}
                className="number-input"
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>Klavye Kısayolları</h3>
            <div className="keyboard-shortcuts">
              <div className="shortcut-item">
                <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>N</kbd></span>
                <span className="shortcut-desc">Yeni Prompt</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>
                <span className="shortcut-desc">Kaydet</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>F</kbd></span>
                <span className="shortcut-desc">Arama</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>1</kbd></span>
                <span className="shortcut-desc">Promptlar</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>2</kbd></span>
                <span className="shortcut-desc">Clipboard</span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="cancel-button" onClick={onClose}>
            İptal
          </button>
          <button 
            className={`save-button ${hasChanges ? 'has-changes' : ''}`}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save size={18} />
            {hasChanges ? 'Kaydet' : 'Kaydedildi'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
