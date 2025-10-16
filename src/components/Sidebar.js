import React, { useState, useMemo } from 'react';
import { Folder, FolderPlus, ChevronRight, ChevronDown, MoreVertical, Edit2, Trash2, GripVertical } from 'lucide-react';
import FolderDialog from './FolderDialog';
import './Sidebar.css';
import './FolderDialog.css';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableTreeItem = ({ id, item, depth, onCollapse, isExpanded, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    paddingLeft: `${depth * 24}px`,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="tree-item" onClick={onSelect}>
      <div className="drag-handle" {...listeners}>
        <GripVertical size={16} />
      </div>
      {item.children.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCollapse();
          }}
          className="folder-toggle"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      )}
      <Folder size={18} style={{ color: item.color }} />
      <span className="item-name">{item.name}</span>
    </div>
  );
};

function Sidebar({ folders, selectedFolder, onSelectFolder, onCreateFolder, onUpdateFolder, onDeleteFolder, onFoldersChange }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const folderTree = useMemo(() => {
    const buildTree = () => {
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
    return buildTree();
  }, [folders]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over || active.id === over.id) return;

    const activeFolder = folders.find(f => f.id === active.id);
    const overFolder = folders.find(f => f.id === over.id);

    if (!activeFolder || !overFolder) return;

    const newFolders = [...folders];
    const activeIndex = newFolders.findIndex(f => f.id === active.id);

    // Hedef klasörün üzerine gelindiğinde, içine taşı
    if (over.data.current?.type === 'folder') {
      newFolders[activeIndex].parent_id = over.id;
    } else {
      // Kök dizine veya başka bir klasörün yanına taşı
      newFolders[activeIndex].parent_id = overFolder.parent_id;
    }

    const overIndex = newFolders.findIndex(f => f.id === over.id);
    const [movedItem] = newFolders.splice(activeIndex, 1);
    newFolders.splice(overIndex, 0, movedItem);

    onFoldersChange(newFolders);

    newFolders.forEach((folder, index) => {
      onUpdateFolder(folder.id, { ...folder, sort_order: index });
    });
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
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

  const renderTree = (items, depth = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <SortableTreeItem
          id={item.id}
          item={item}
          depth={depth}
          onCollapse={() => toggleFolder(item.id)}
          isExpanded={expandedFolders.has(item.id)}
          onSelect={() => onSelectFolder(item.id)}
        />
        {expandedFolders.has(item.id) && item.children.length > 0 && (
          <div className="tree-children">
            {renderTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={folders.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {renderTree(folderTree)}
          </SortableContext>
        </DndContext>
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
