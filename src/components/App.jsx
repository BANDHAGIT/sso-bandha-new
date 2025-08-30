import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import AuthCallback from './AuthCallback';
import SilentRenew from './SilentRenew';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/silent-renew" element={<SilentRenew />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
