import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userManager from '../services/authService';

const AuthCallback = () => {
  const { isLoading, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('Finishing authentication...');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const hasCode = url.searchParams.get('code');
    const hasState = url.searchParams.get('state');
    const alreadyDone = sessionStorage.getItem('oidc_cb_done');

    if (hasCode && hasState && !alreadyDone) {
      (async () => {
        try {
          setMsg('Completing authentication (fallback)...');
          await userManager.signinRedirectCallback();
          sessionStorage.setItem('oidc_cb_done', '1');
          navigate('/dashboard', { replace: true });
        } catch (e) {
          console.error('[OIDC] fallback callback error:', e);
          setMsg(`Authentication error: ${e?.message || 'Unknown error'}`);
          setTimeout(() => navigate('/', { replace: true }), 3000);
        }
      })();
    }
  }, [navigate]);

  return (
    <div style={{
      textAlign: 'center',
      padding: 20,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontSize: '1.2em', marginBottom: 20, color: '#2c3e50' }}>
        {error ? `Authentication error: ${error}` : msg}
      </div>
      <div style={{
        width: 40, height: 40,
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #e74c3c',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: 20
      }} />
      <style>{`@keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default AuthCallback;
