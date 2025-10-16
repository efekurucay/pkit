import React, { useState } from 'react';
import { Folder, FolderPlus, ChevronRight, ChevronDown, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import FolderDialog from './FolderDialog';
import './Sidebar.css';
import './FolderDialog.css';

function Sidebar({ folders, selectedFolder, onSelectFolder, onCreateFolder, onUpdateFolder, onDeleteFolder }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder({ name: newFolderName.trim() });
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e, folder) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, folder });
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setShowDialog(true);
    setContextMenu(null);
  };

  const handleSaveFolder = (folderData) => {
    if (editingFolder) {
      onUpdateFolder(editingFolder.id, folderData);
    } else {
      onCreateFolder(folderData);
    }
    setShowDialog(false);
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folder) => {
    if (window.confirm(`"${folder.name}" klasörünü ve tüm içeriğini silmek istediğinize emin misiniz?`)) {
      onDeleteFolder(folder.id);
    }
    setContextMenu(null);
  };

  // Klasörleri hiyerarşik yapıya dönüştür
  const buildFolderTree = () => {
    const rootFolders = folders.filter(f => !f.parent_id);
    const folderMap = {};
    folders.forEach(f => {
      folderMap[f.id] = { ...f, children: [] };
    });
    folders.forEach(f => {
      if (f.parent_id && folderMap[f.parent_id]) {
        folderMap[f.parent_id].children.push(folderMap[f.id]);
      }
    });
    return rootFolders.map(f => folderMap[f.id]);
  };

  const renderFolder = (folder, level = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolder === folder.id;

    return (
      <div key={folder.id} className="folder-item-container">
        <div
          className={`folder-item ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => onSelectFolder(folder.id)}
          onContextMenu={(e) => handleContextMenu(e, folder)}
        >
          {hasChildren && (
            <button
              className="folder-toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          {!hasChildren && <div className="folder-spacer" />}
          <Folder size={18} style={{ color: folder.color }} />
          <span className="folder-name" title={folder.name}>{folder.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="folder-children">
            {folder.children.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const folderTree = buildFolderTree();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Klasörler</h2>
        <button
          className="icon-button"
          onClick={() => {
            setEditingFolder(null);
            setShowDialog(true);
          }}
          title="Yeni Klasör"
        >
          <FolderPlus size={20} />
        </button>
      </div>

      <div className="folder-list">
        <div
          className={`folder-item ${selectedFolder === null ? 'selected' : ''}`}
          onClick={() => onSelectFolder(null)}
        >
          <Folder size={18} />
          <span className="folder-name">Tüm Promptlar</span>
        </div>

        {folderTree.map(folder => renderFolder(folder))}

        {isCreating && (
          <div className="folder-item new-folder">
            <Folder size={18} />
            <input
              type="text"
              placeholder="Klasör adı..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewFolderName('');
                }
              }}
              onBlur={handleCreateFolder}
              autoFocus
              className="folder-input"
            />
          </div>
        )}
      </div>

      {contextMenu && (
        <>
          <div
            className="context-menu-overlay"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              className="context-menu-item"
              onClick={() => handleEditFolder(contextMenu.folder)}
            >
              <Edit2 size={16} />
              Düzenle
            </button>
            <button
              className="context-menu-item danger"
              onClick={() => handleDeleteFolder(contextMenu.folder)}
            >
              <Trash2 size={16} />
              Sil
            </button>
          </div>
        </>
      )}
      <FolderDialog
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          setEditingFolder(null);
        }}
        onSave={handleSaveFolder}
        folder={editingFolder}
        folders={folders}
      />
    </div>
  );
}

export default Sidebar;
