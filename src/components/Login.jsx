import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/bandhayudha-logo.png';

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="auth-container">
        <img src={logo} alt="Bandhayudha Logo" />
        <h1>Single Sign On (SSO)</h1>
        <h2>Bandhayudha</h2>
        <p>Silahkan Masuk</p>
        <button className="login-button" onClick={login}>
          <img src={logo} alt="Bandhayudha Logo" />
          SSO Bandhayudha
        </button>
      </div>
    </div>
  );
};

export default Login;
