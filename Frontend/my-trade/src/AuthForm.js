import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [clientId, setClientId] = useState('');
  const [redirectUri, setRedirectUri] = useState(process.env.REACT_APP_REDIRECT_URI);
  const [authCode, setAuthCode] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const url = `${baseUrl}?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  const handleGetAccessToken = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      try {
        const response = await axios.post('https://5000-zuhakhalida-tradeautoma-j3gpuxzd16m.ws-us115.gitpod.io/', {  // <-- Updated endpoint
          code,
          client_id: clientId,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          redirect_uri: process.env.REACT_APP_REDIRECT_URI,
        });
        setAuthCode(response.data);
        localStorage.setItem('accessToken', response.data.access_token);
        navigate('/profile', { state: { authCode: response.data } });
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
