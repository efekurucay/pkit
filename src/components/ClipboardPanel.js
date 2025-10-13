import React, { useState } from 'react';
import { Copy, RefreshCw, Calendar, Clock } from 'lucide-react';
import './ClipboardPanel.css';

function ClipboardPanel({ items, onCopy, onRefresh }) {
  const [copiedId, setCopiedId] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopy = (item) => {
    onCopy(item.content);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Tarihe göre grupla
  const groupByDate = () => {
    const groups = {};
    items.forEach(item => {
      const dateKey = formatDate(item.created_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });
    return groups;
  };

  const groupedItems = groupByDate();

  return (
    <div className="clipboard-panel">
      <div className="clipboard-header">
        <div className="clipboard-header-left">
          <h2>Clipboard Geçmişi</h2>
          <span className="item-count">{items.length} öğe</span>
        </div>
        <button
          className="icon-button"
          onClick={onRefresh}
          title="Yenile"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="clipboard-content">
        {items.length === 0 ? (
          <div className="empty-clipboard">
            <p>Henüz clipboard geçmişi yok</p>
            <p className="empty-subtitle">Kopyaladığınız metinler otomatik olarak burada görünecek</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([date, dateItems]) => (
            <div key={date} className="clipboard-group">
              <div className="group-header">
                <Calendar size={14} />
                <span>{date}</span>
              </div>
              <div className="group-items">
                {dateItems.map((item) => (
                  <div key={item.id} className="clipboard-item">
                    <div className="clipboard-item-header">
                      <div className="clipboard-time">
                        <Clock size={12} />
                        {formatTime(item.created_at)}
                      </div>
                      <button
                        className={`copy-button ${copiedId === item.id ? 'copied' : ''}`}
                        onClick={() => handleCopy(item)}
                        title="Kopyala"
                      >
                        <Copy size={16} />
                        {copiedId === item.id ? 'Kopyalandı!' : 'Kopyala'}
                      </button>
                    </div>
                    <div className="clipboard-content-text">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClipboardPanel;
