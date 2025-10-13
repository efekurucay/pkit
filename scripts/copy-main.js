const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'main');
const buildDir = path.join(__dirname, '..', 'build');

console.log('Copying main process files to build directory...');

// Copy all files from src/main to build
fs.copySync(srcDir, buildDir, {
  filter: (src) => {
    // Copy all files
    return true;
  }
});

// Rename main.js to electron.js
const mainPath = path.join(buildDir, 'main.js');
const electronPath = path.join(buildDir, 'electron.js');

if (fs.existsSync(mainPath)) {
  fs.renameSync(mainPath, electronPath);
  console.log('✓ Renamed main.js to electron.js');
}

console.log('✓ Main process files copied successfully!');
