import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App" style={{background: 'transparent', minHeight: '100vh'}}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Redirect root to login instead of dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all route redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
