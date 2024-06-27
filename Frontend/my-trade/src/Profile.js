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
      // Clear localStorage and navigate to the home page or login page
      localStorage.removeItem('accessToken');
      navigate('/');
    } catch (error) {
      console.error(error.response.status);
      console.error(error.response.data);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>User Profile</h2>
      {authCode && (
        <div>
          <h3>Access Token Details:</h3>
          <pre>Email: {authCode.email}</pre>
          <pre>User Name: {authCode.user_name}</pre>
          <pre>Access Token: {authCode.access_token}</pre>
        </div>
      )}
      <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px' }}>Logout</button>
    </div>
  );
};

export default Profile;
