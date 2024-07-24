// Profile.js
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
  const [showOptions, setShowOptions] = useState(false);

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

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <header className="App-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/options')} style={{ padding: '10px 20px' }}>
          Options
        </button>
        <button onClick={handleLogout} style={{ padding: '10px 20px' }}>
          Logout
        </button>
      </header>
      <h2>User Profile</h2>
      {authCode ? (
        <>
          <div>
            <h3>Access Token Details:</h3>
            <pre>Email: {authCode.email}</pre>
            <pre>User Name: {authCode.user_name}</pre>
            <pre>Access Token: {authCode.access_token}</pre>
          </div>

          <button onClick={toggleOptions} style={{ marginTop: '20px', padding: '10px 20px' }}>
            {showOptions ? 'Hide Options' : 'Show Options'}
          </button>

          {showOptions && (
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
                </label
