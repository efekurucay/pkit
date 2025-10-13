const { spawn } = require('child_process');
const path = require('path');

// React dev server'ı başlat
const reactProcess = spawn('npm', ['run', 'start:react'], {
  shell: true,
  stdio: 'inherit'
});

// 5 saniye bekle ve Electron'u başlat
setTimeout(() => {
  const electronProcess = spawn('npm', ['run', 'start:electron'], {
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, ELECTRON_START_URL: 'http://localhost:3000' }
  });

  electronProcess.on('close', () => {
    reactProcess.kill();
    process.exit();
  });
}, 5000);

process.on('SIGINT', () => {
  reactProcess.kill();
  process.exit();
});
