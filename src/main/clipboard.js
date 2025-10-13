const { clipboard } = require('electron');

class ClipboardMonitor {
  constructor(database) {
    this.db = database;
    this.interval = null;
    this.lastContent = '';
    this.checkInterval = 500; // Check every 500ms
  }

  start() {
    const enabled = this.db.getSetting('clipboard_enabled') === 'true';
    if (!enabled) {
      console.log('Clipboard monitoring is disabled');
      return;
    }

    console.log('Starting clipboard monitor...');
    this.lastContent = clipboard.readText();

    this.interval = setInterval(() => {
      this.checkClipboard();
    }, this.checkInterval);
  }

  checkClipboard() {
    try {
      const currentContent = clipboard.readText();
      
      // Check if content has changed and is not empty
      if (currentContent && currentContent !== this.lastContent) {
        this.lastContent = currentContent;
        
        // Don't save very long content (> 100KB)
        if (currentContent.length < 100000) {
          this.db.addClipboardItem(currentContent, 'text');
          console.log('Clipboard item saved:', currentContent.substring(0, 50) + '...');
        }
      }
    } catch (error) {
      console.error('Error checking clipboard:', error);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Clipboard monitor stopped');
    }
  }

  setCheckInterval(ms) {
    this.checkInterval = ms;
    if (this.interval) {
      this.stop();
      this.start();
    }
  }
}

module.exports = ClipboardMonitor;
