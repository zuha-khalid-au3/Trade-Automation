// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthForm from './AuthForm';
import Profile from './Profile';
import OptionsPage from './OptionsPage'; // Import the OptionsPage component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/options" element={<OptionsPage />} /> {/* Add the route for OptionsPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
