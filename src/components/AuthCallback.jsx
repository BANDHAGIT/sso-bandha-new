import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userManager from '../services/authService';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('Processing authentication...');
  const [hasError, setHasError] = useState(false);
  const ranOnceRef = useRef(false);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    if (ranOnceRef.current) return; // guard untuk Strict Mode (dev)
    ranOnceRef.current = true;

    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const errorParam = url.searchParams.get('error');

        if (errorParam) {
          const errorDescription = url.searchParams.get('error_description') || 'Unknown error';
          setHasError(true);
          setMsg(`Authentication error: ${errorDescription}`);
          const t = setTimeout(() => navigate('/', { replace: true }), 3000);
          timeoutsRef.current.push(t);
          return;
        }

        setMsg('Completing authentication...');
        const user = await userManager.signinRedirectCallback();

        console.info('[AuthCallback] Authentication successful:', user);
        setMsg('Authentication successful! Redirecting...');
        const t = setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        timeoutsRef.current.push(t);
      } catch (error) {
        console.error('[AuthCallback] Callback error:', error);

        // Fallback bila error terkait userinfo/Content-Type
        if (error?.message?.includes('userinfo') || error?.message?.includes('Content-Type')) {
          console.warn('[AuthCallback] Userinfo error, checking for valid token...');
          try {
            const user = await userManager.getUser();
            if (user && !user.expired) {
              console.info('[AuthCallback] Valid user found despite userinfo error');
              setMsg('Authentication successful! Redirecting...');
              const t = setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
              timeoutsRef.current.push(t);
              return;
            }
          } catch (userError) {
            console.error('[AuthCallback] Failed to get user:', userError);
          }
        }

        setHasError(true);
        setMsg(`Authentication failed: ${error?.message || 'Unknown error'}`);
        const t = setTimeout(() => navigate('/', { replace: true }), 3000);
        timeoutsRef.current.push(t);
      }
    };

    handleCallback();

    // Bersihkan timeout kalau komponen unmount
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
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
      <div style={{
        fontSize: '1.2em',
        marginBottom: 20,
        color: hasError ? '#e74c3c' : '#2c3e50',
        maxWidth: '600px',
        wordWrap: 'break-word'
      }}>
        {msg}
      </div>
      {!hasError && (
        <div style={{
          width: 40, height: 40,
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #e74c3c',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: 20
        }} />
      )}
      <style>{`@keyframes spin {0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default AuthCallback;
