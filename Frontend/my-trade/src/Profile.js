import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authCode = location.state?.authCode || JSON.parse(localStorage.getItem('accessToken'));
  const [name, setName] = useState('');
  const [instrumentType, setInstrumentType] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [date, setDate] = useState('');
  const [instrumentKey, setInstrumentKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authCode) {
      navigate('/');
    }
  }, [authCode, navigate]);

  const handleLogout = async () => {
    const url = 'https://api.upstox.com/v2/logout';
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authCode.access_token}`
    };

    try {
      const response = await axios.delete(url, { headers });
      console.log(response.status);
      console.log(response.data);
      localStorage.removeItem('accessToken');
      navigate('/');
    } catch (error) {
      console.error(error.response?.status);
      console.error(error.response?.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'https://5000-zuhakhalida-tradeautoma-j3gpuxzd16m.ws-us115.gitpod.io/getInstrumentKey'; // Replace with your backend API URL
    const headers = {
      'Authorization': `Bearer ${authCode.access_token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, {
        name,
        instrumentType,
        strikePrice,
        date: date.trim() === '' ? '30Apr24' : date,
      }, { headers });

      setInstrumentKey(response.data.instrumentKey);
      setError(null);
    } catch (error) {
      console.error('Error fetching instrument key:', error);
      setError('Failed to retrieve instrument key. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>User Profile</h2>
      {authCode ? (
        <>
          <div>
            <h3>Access Token Details:</h3>
            <pre>Email: {authCode.email}</pre>
            <pre>User Name: {authCode.user_name}</pre>
            <pre>Access Token: {authCode.access_token}</pre>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div>
              <label>
                Select Name:
                <select value={name} onChange={(e) => setName(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="nifty">Nifty</option>
                  <option value="banknifty">BankNifty</option>
                  <option value="finnifty">FinNifty</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
            </div>
            {name === 'custom' && (
              <div>
                <label>
                  Custom Name:
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
              </div>
            )}
            <div>
              <label>
                Instrument Type:
                <input type="text" value={instrumentType} onChange={(e) => setInstrumentType(e.target.value)} required />
              </label>
            </div>
            <div>
              <label>
                Strike Price:
                <input type="text" value={strikePrice} onChange={(e) => setStrikePrice(e.target.value)} required />
              </label>
            </div>
            <div>
              <label>
                Date (leave empty for default):
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>
            <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>Submit</button>
          </form>

          {instrumentKey && (
            <div>
              <h3>Instrument Key:</h3>
              <p>{instrumentKey}</p>
            </div>
          )}
          {error && <div style={{ color: 'red' }}>{error}</div>}

          <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Logout
          </button>
        </>
      ) : (
        <p>No user details available. Please log in again.</p>
      )}
    </div>
  );
};

export default Profile;
