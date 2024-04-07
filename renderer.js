window.onload = () => {
    document.getElementById('startProcess').addEventListener('click', () => {
      ipcRenderer.send('startProcess');
    });
  
    ipcRenderer.receive('processResponse', (responseUrl) => {
      console.log('Redirect URL:', responseUrl);
      // You can perform further actions here with the redirect URL
    });
  };
  