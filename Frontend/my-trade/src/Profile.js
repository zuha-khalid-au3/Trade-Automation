import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

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
    <div className="container mt-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-primary" onClick={() => navigate('/options')}>Options</button>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </header>
      <h2>User Profile</h2>
      {authCode ? (
        <div>
          <h3>Access Token Details:</h3>
          <pre>Email: {authCode.email}</pre>
          <pre>User Name: {authCode.user_name}</pre>
          <pre>Access Token: {authCode.access_token}</pre>
        </div>
      ) : (
        <p>No user details available. Please log in again.</p>
      )}
    </div>
  );
};

export default Profile;
