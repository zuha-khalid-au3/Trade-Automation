import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const AuthForm = () => {
  const [clientId, setClientId] = useState('450f5a3d-24a0-4660-8552-5e84eaa857c2');
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
        const response = await axios.post(process.env.REACT_APP_SERVER_URL, {
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
    <div className="container mt-5">
      <h2>Upstox Authorization</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Client ID:</label>
          <input
            type="text"
            className="form-control"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Redirect URI:</label>
          <input
            type="text"
            className="form-control"
            value={redirectUri}
            onChange={(e) => setRedirectUri(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Authorize</button>
      </form>
      <form onSubmit={handleGetAccessToken} className="mt-3">
        <button type="submit" className="btn btn-secondary">Get Access Token</button>
      </form>
      {authCode && (
        <div className="mt-3">
          <h3>Access Token:</h3>
          <pre>{JSON.stringify(authCode, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
