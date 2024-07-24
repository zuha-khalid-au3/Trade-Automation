import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const OptionsPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [instrumentType, setInstrumentType] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [date, setDate] = useState('');
  const [instrumentKey, setInstrumentKey] = useState(null);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('accessToken'); // Directly retrieve the access token

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_SERVER_URL}/getInstrumentKey`; // Replace with your backend API URL
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
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

  const handleLogout = async () => {
    const url = 'https://api.upstox.com/v2/logout';
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
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

  return (
    <div className="container mt-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-primary" onClick={() => navigate('/profile')}>Home</button>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </header>
      <h2>Options Page</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <label>Select Name:</label>
          <select className="form-control" value={name} onChange={(e) => setName(e.target.value)} required>
            <option value="">Select</option>
            <option value="nifty">Nifty</option>
            <option value="banknifty">BankNifty</option>
            <option value="finnifty">FinNifty</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        {name === 'custom' && (
          <div className="form-group">
            <label>Custom Name:</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label>Instrument Type:</label>
          <input type="text" className="form-control" value={instrumentType} onChange={(e) => setInstrumentType(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Strike Price:</label>
          <input type="text" className="form-control" value={strikePrice} onChange={(e) => setStrikePrice(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date (leave empty for default):</label>
          <input type="text" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Submit</button>
      </form>
      {instrumentKey && (
        <div className="mt-3">
          <h3>Instrument Key:</h3>
          <p>{instrumentKey}</p>
        </div>
      )}
      {error && <div className="text-danger mt-3">{error}</div>}
    </div>
  );
};

export default OptionsPage;
