import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const AuthForm = () => {
  const [clientId, setClientId] = useState('');
  const [redirectUri, setRedirectUri] = useState('https://3000-zuhakhalida-tradeautoma-vqmazprdo6m.ws-us114.gitpod.io/');
  const [authCode, setAuthCode] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = (e) => {
    e.preventDefault();
    const baseUrl = 'https://api.upstox.com/v2/login/authorization/dialog';
    const url = `${baseUrl}?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  const handleGetAccessToken = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code) {
      try {
        const response = await axios.post('https://5000-zuhakhalida-tradeautoma-vqmazprdo6m.ws-us114.gitpod.io/getAccessToken', {
          code,
          client_id: clientId,
          client_secret: 'etgnuwhlzt', // replace with your actual client secret
          redirect_uri: redirectUri,
        });
        setAuthCode(response.data);
        // Store access token in localStorage
        localStorage.setItem('accessToken', response.data.access_token);
        // Redirect to profile page
        navigate('/profile');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Upstox Authorization</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Client ID:
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Redirect URI:
            <input
              type="text"
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Authorize</button>
      </form>
      <form onSubmit={handleGetAccessToken}>
        <button type="submit" style={{ padding: '10px 20px', marginTop: '20px' }}>Get Access Token</button>
      </form>
      {authCode && (
        <div>
          <h3>Access Token:</h3>
          <pre>{JSON.stringify(authCode, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
