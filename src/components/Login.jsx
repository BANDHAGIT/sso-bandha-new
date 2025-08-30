import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import loginBg from '../assets/login-bg.jpg';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      // Check credentials
      if (email === 'testuser' && password === 'testuser') {
        console.log('Login successful');
        navigate('/dashboard');
      } else {
        setError('Invalid username or password. Use testuser/testuser');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container-new" style={{backgroundImage: `url(${loginBg})`}}>
      <div className="login-card-new">
        <div className="login-icon">
          <div className="login-key-icon">
            <KeyRound size={32} color="#6b7280" />
          </div>
        </div>
        
        <h2 className="login-title">Sign in with email</h2>
        <p className="login-subtitle">Access your Bandhayudha dashboard</p>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" className="login-btn-new" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Get Started'}
          </button>
        </form>
        
        <div className="login-hint">
          <small>Demo: testuser / testuser</small>
        </div>
      </div>
    </div>
  );
}

export default Login;
