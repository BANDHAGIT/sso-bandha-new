import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
// import ProtectedRoute from './ProtectedRoute'; // Commented out for development
// import AuthCallback from './AuthCallback'; // Commented out for development
// import SilentRenew from './SilentRenew'; // Commented out for development

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Development mode: direct access to all routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Redirect root to dashboard for development */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Auth-related routes disabled for development */}
        {/* <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/silent-renew" element={<SilentRenew />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } /> */}
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
