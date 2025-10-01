import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Komponen Halaman
import Login from './Login';
import Dashboard from './Dashboard';
import AuthCallback from './AuthCallback'; // Tambahkan impor ini
import SilentRenew from './SilentRenew';   // Tambahkan impor ini
import OrderTracking from './OrderTracking';

// Konteks dan Rute Pelindung
import { AppAuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
    <div className="App" style={{ background: 'transparent', minHeight: '100vh' }}>
      <AppAuthProvider>
        <Routes>
          {/* Rute publik */}
          <Route path="/login" element={<Login />} />
          
          {/* --- KUNCI PERBAIKAN: Tambahkan rute OIDC kembali --- */}
          {/* Rute ini penting agar library auth bisa memproses token */}
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/silent-renew" element={<SilentRenew />} />

          {/* Rute yang dilindungi */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/order-tracking" 
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            } 
          />
          
          {/* Logika pengalihan */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppAuthProvider>
    </div>
  );
}

export default App;