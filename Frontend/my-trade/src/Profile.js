import React from 'react';

const Profile = () => {
  // Retrieve access token from localStorage
  const accessToken = localStorage.getItem('accessToken');

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>User Profile</h2>
      <div>
        <h3>Access Token:</h3>
        <p>{accessToken}</p>
      </div>
      {/* Add other profile information here */}
    </div>
  );
};

export default Profile;
