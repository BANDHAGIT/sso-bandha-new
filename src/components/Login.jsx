import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // Commented out for development

function Login() {
  // const { login } = useAuth(); // Commented out for development
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Login clicked - development mode');
    // Directly navigate to dashboard in development mode
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <div className="development-notice">
          <p><strong>Development Mode:</strong> Authentication is disabled</p>
        </div>
        <button onClick={handleLogin} className="login-btn">
          Enter Dashboard (Dev Mode)
        </button>
      </div>
    </div>
  );
}

export default Login;
