import React from 'react';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const authCode = location.state?.authCode;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>User Profile</h2>
      {authCode && (
        <div>
          <h3>Access Token:</h3>
          {/* <pre>{JSON.stringify(authCode, null, 2)}</pre> */}
          <pre>Email:{JSON.stringify(authCode.email, null, 2)}</pre>
          <pre>User Name:{JSON.stringify(authCode.user_name, null, 2)}</pre>
          <pre>Access_Token:{JSON.stringify(authCode.access_token, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Profile;
