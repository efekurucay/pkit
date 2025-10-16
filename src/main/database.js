const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

class DatabaseManager {
  constructor(userDataPath) {
    this.dbPath = path.join(userDataPath, 'promptkit.db');
    this.db = null;
    this.initDatabase();
  }

  async initDatabase() {
    const SQL = await initSqlJs();
    
    // Eğer database dosyası varsa yükle
    if (fs.existsSync(this.dbPath)) {
      const buffer = fs.readFileSync(this.dbPath);
      this.db = new SQL.Database(buffer);
    } else {
      this.db = new SQL.Database();
    }
    
    this.initTables();
  }

  saveDatabase() {
    if (this.db) {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    }
  }

  initTables() {
    // Folders table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        parent_id INTEGER,
        color TEXT DEFAULT '#6366f1',
        icon TEXT DEFAULT 'folder',
        sort_order INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
      )
    `);

    // Prompts table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        folder_id INTEGER,
        tags TEXT,
        is_favorite INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
      )
    `);

    // Clipboard history table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS clipboard_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        content_type TEXT DEFAULT 'text',
        source_app TEXT,
        created_at INTEGER NOT NULL
      )
    `);

    // Settings table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    // Canvases table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS canvases (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        data TEXT NOT NULL,
        viewport TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    // Create indexes
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_prompts_folder ON prompts(folder_id)`);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_prompts_favorite ON prompts(is_favorite)`);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_clipboard_created ON clipboard_history(created_at DESC)`);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_folders_parent ON folders(parent_id)`);

    // Insert default settings
    const defaultSettings = {
      clipboard_enabled: 'true',
      clipboard_max_items: '1000',
      clipboard_ignore_duplicates: 'true'
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      this.db.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', [key, value]);
    }
    
    this.saveDatabase();
  }

  // Folders
  getAllFolders() {
    const result = this.db.exec('SELECT * FROM folders ORDER BY sort_order, name');
    return this.rowsToObjects(result);
  }

  createFolder(folder) {
    const now = Date.now();
    this.db.run(
      'INSERT INTO folders (name, parent_id, color, icon, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [folder.name, folder.parent_id || null, folder.color || '#6366f1', folder.icon || 'folder', folder.sort_order || 0, now, now]
    );
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    const id = result[0].values[0][0];
    this.saveDatabase();
    return { id, ...folder, created_at: now, updated_at: now };
  }

  updateFolder(id, folder) {
    const now = Date.now();
    this.db.run(
      'UPDATE folders SET name = ?, parent_id = ?, color = ?, icon = ?, sort_order = ?, updated_at = ? WHERE id = ?',
      [folder.name, folder.parent_id || null, folder.color, folder.icon, folder.sort_order, now, id]
    );
    this.saveDatabase();
    return { id, ...folder, updated_at: now };
  }

  deleteFolder(id) {
    this.db.run('DELETE FROM folders WHERE id = ?', [id]);
    this.saveDatabase();
    return true;
  }

  // Prompts
  getAllPrompts() {
    const result = this.db.exec(`
      SELECT p.*, f.name as folder_name, f.color as folder_color
      FROM prompts p
      LEFT JOIN folders f ON p.folder_id = f.id
      ORDER BY p.updated_at DESC
    `);
    return this.rowsToObjects(result);
  }

  getPromptsByFolder(folderId) {
    if (folderId === null || folderId === 'all') {
      return this.getAllPrompts();
    }
    const stmt = this.db.prepare(`
      SELECT p.*, f.name as folder_name, f.color as folder_color
      FROM prompts p
      LEFT JOIN folders f ON p.folder_id = f.id
      WHERE p.folder_id = ?
      ORDER BY p.updated_at DESC
    `);
    stmt.bind([folderId]);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();
    return result;
  }

  createPrompt(prompt) {
    const now = Date.now();
    this.db.run(
      'INSERT INTO prompts (title, content, folder_id, tags, is_favorite, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [prompt.title, prompt.content, prompt.folder_id || null, prompt.tags || '', prompt.is_favorite ? 1 : 0, now, now]
    );
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    const id = result[0].values[0][0];
    this.saveDatabase();
    return { id, ...prompt, created_at: now, updated_at: now };
  }

  updatePrompt(id, prompt) {
    const now = Date.now();
    this.db.run(
      'UPDATE prompts SET title = ?, content = ?, folder_id = ?, tags = ?, is_favorite = ?, updated_at = ? WHERE id = ?',
      [prompt.title, prompt.content, prompt.folder_id || null, prompt.tags || '', prompt.is_favorite ? 1 : 0, now, id]
    );
    this.saveDatabase();
    return { id, ...prompt, updated_at: now };
  }

  deletePrompt(id) {
    this.db.run('DELETE FROM prompts WHERE id = ?', [id]);
    this.saveDatabase();
    return true;
  }

  searchPrompts(query) {
    const searchPattern = `%${query}%`;
    const stmt = this.db.prepare(`
      SELECT p.*, f.name as folder_name, f.color as folder_color
      FROM prompts p
      LEFT JOIN folders f ON p.folder_id = f.id
      WHERE p.title LIKE ? OR p.content LIKE ? OR p.tags LIKE ?
      ORDER BY p.updated_at DESC
    `);
    stmt.bind([searchPattern, searchPattern, searchPattern]);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();
    return result;
  }

  // Clipboard
  getClipboardHistory(limit = 100) {
    const result = this.db.exec(`SELECT * FROM clipboard_history ORDER BY created_at DESC LIMIT ${limit}`);
    return this.rowsToObjects(result);
  }

  addClipboardItem(content, contentType = 'text', sourceApp = null) {
    const now = Date.now();
    
    // Check if duplicates should be ignored
    const ignoreDuplicates = this.getSetting('clipboard_ignore_duplicates') === 'true';
    if (ignoreDuplicates) {
      const stmt = this.db.prepare('SELECT id FROM clipboard_history WHERE content = ? ORDER BY created_at DESC LIMIT 1');
      stmt.bind([content]);
      if (stmt.step()) {
        const existingId = stmt.getAsObject().id;
        stmt.free();
        return { id: existingId };
      }
      stmt.free();
    }

    this.db.run(
      'INSERT INTO clipboard_history (content, content_type, source_app, created_at) VALUES (?, ?, ?, ?)',
      [content, contentType, sourceApp, now]
    );
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    const id = result[0].values[0][0];

    // Clean up old items if limit exceeded
    const maxItems = parseInt(this.getSetting('clipboard_max_items') || '1000');
    this.db.run(`
      DELETE FROM clipboard_history 
      WHERE id NOT IN (
        SELECT id FROM clipboard_history 
        ORDER BY created_at DESC 
        LIMIT ${maxItems}
      )
    `);

    this.saveDatabase();
    return { id, content, content_type: contentType, source_app: sourceApp, created_at: now };
  }

  searchClipboard(query) {
    const searchPattern = `%${query}%`;
    const stmt = this.db.prepare('SELECT * FROM clipboard_history WHERE content LIKE ? ORDER BY created_at DESC LIMIT 100');
    stmt.bind([searchPattern]);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();
    return result;
  }

  deleteClipboardItem(id) {
    this.db.run('DELETE FROM clipboard_history WHERE id = ?', [id]);
    this.saveDatabase();
    return true;
  }

  clearClipboardHistory() {
    this.db.run('DELETE FROM clipboard_history');
    this.saveDatabase();
    return true;
  }

  // Settings
  getSetting(key) {
    const stmt = this.db.prepare('SELECT value FROM settings WHERE key = ?');
    stmt.bind([key]);
    if (stmt.step()) {
      const value = stmt.getAsObject().value;
      stmt.free();
      return value;
    }
    stmt.free();
    return null;
  }

  setSetting(key, value) {
    this.db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
    this.saveDatabase();
    return true;
  }

  // Canvases
  getAllCanvases() {
    const result = this.db.exec('SELECT * FROM canvases ORDER BY updated_at DESC');
    return this.rowsToObjects(result);
  }

  createCanvas(canvas) {
    const now = Date.now();
    this.db.run(
      'INSERT INTO canvases (id, name, description, data, viewport, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [canvas.id, canvas.name, canvas.description || '', canvas.data, canvas.viewport, now, now]
    );
    this.saveDatabase();
    return { ...canvas, created_at: now, updated_at: now };
  }

  updateCanvas(id, canvas) {
    const now = Date.now();
    this.db.run(
      'UPDATE canvases SET name = ?, description = ?, data = ?, viewport = ?, updated_at = ? WHERE id = ?',
      [canvas.name, canvas.description, canvas.data, canvas.viewport, now, id]
    );
    this.saveDatabase();
    return { id, ...canvas, updated_at: now };
  }

  deleteCanvas(id) {
    this.db.run('DELETE FROM canvases WHERE id = ?', [id]);
    this.saveDatabase();
    return true;
  }

  // Helper method to convert sql.js result to objects
  rowsToObjects(result) {
    if (!result || result.length === 0 || !result[0].values || result[0].values.length === 0) {
      return [];
    }
    const columns = result[0].columns;
    const values = result[0].values;
    return values.map(row => {
      const obj = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  }

  close() {
    this.saveDatabase();
    this.db.close();
  }
}

module.exports = DatabaseManager;
