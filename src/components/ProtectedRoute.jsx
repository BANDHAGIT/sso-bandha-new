import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Route pelindung + kill-switch 10 detik agar tidak "loading selamanya"
const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const t = setTimeout(() => setTimedOut(true), 10000); // 10 detik
      return () => clearTimeout(t);
    } else {
      setTimedOut(false);
    }
  }, [isLoading]);

  if (isLoading && !timedOut) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.1rem'
      }}>
        Loading authentication...
      </div>
    );
  }

  if ((isLoading && timedOut) || !isAuthenticated || !user) {
    // Jika masih loading lewat 10 detik ATAU belum autentik → balik ke login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
