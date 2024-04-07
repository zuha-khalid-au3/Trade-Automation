const { app, shell } = require('electron');
const express = require('express');
const url = require('url');
const axios = require('axios');
const qs = require('qs');

// Express app setup
const expressApp = express();
const port = 3000;

let mainWindow;

expressApp.get('/callback', (req, res) => {
  const query = url.parse(req.url, true).query;
  const code = query.code;
  console.log('Received code:', code);

  // Use axios to make POST request for token exchange
  let data = qs.stringify({
    'code': code,
    'client_id': '450f5a3d-24a0-4660-8552-5e84eaa857c2',
    'client_secret': 'etgnuwhlzt',
    'redirect_uri': 'http://localhost:3000/callback',
    'grant_type': 'authorization_code'
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.upstox.com/v2/login/authorization/token',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      console.log('Token response:', response.data);
      res.send('Callback received successfully. You can close this window.');
    })
    .catch((error) => {
      console.error('Error fetching token:', error);
      res.status(500).send('Error occurred while fetching token.');
    });
});

function createWindow() {
  // Open the URL in the default external browser
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
