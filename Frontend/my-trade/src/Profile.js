// Profile.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authCode = location.state?.authCode;

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

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <header className="App-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/options')} style={{ padding: '10px 20px' }}>Options</button>
        <button onClick={handleLogout} style={{ padding: '10px 20px' }}>Logout</button>
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
        </>
      ) : (
        <p>No user details available. Please log in again.</p>
      )}
    </div>
  );
};

export default Profile;
