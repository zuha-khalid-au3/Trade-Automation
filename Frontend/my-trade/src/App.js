import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthForm from './AuthForm';
import Profile from './Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<AuthForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

const NotFound = () => (
  <div>
    <h2>Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export default App;
