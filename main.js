const { app, shell } = require('electron');
const express = require('express');
const url = require('url');

// Express app setup
const expressApp = express();
const port = 3000;

let mainWindow;

expressApp.get('/callback', (req, res) => {
  const query = url.parse(req.url, true).query;
  const code = query.code;
  console.log('Received code:', code);
  res.send('Callback received successfully. You can close this window.');
});

function createWindow() {
  // We don't need to create a BrowserWindow
  // We'll just open the URL in the default browser
  shell.openExternal('https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=450f5a3d-24a0-4660-8552-5e84eaa857c2&redirect_uri=http://localhost:3000/callback');

  // Express server setup
  expressApp.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
