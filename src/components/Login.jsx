import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBg from '../assets/login-bg.jpg';
import { useAuth } from '../contexts/AuthContext'; 
import LoginIcon from '../assets/Bandha no bg.png';// Pastikan path ini benar

function Login() {
  const navigate = useNavigate();
  // Mengambil fungsi dan state dari AuthContext
  const { login, isAuthenticated, isLoading, error } = useAuth();

  // useEffect untuk redirect otomatis jika user sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fungsi untuk menangani klik pada tombol login
  const handleLogin = () => {
    // Memanggil fungsi login dari useAuth yang akan me-redirect ke halaman SSO provider
    login();
  };
  
  // Jika sedang loading atau sudah terautentikasi, jangan tampilkan apa-apa (karena akan redirect)
  if (isLoading || isAuthenticated) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            Loading authentication status...
        </div>
    );
  }

  return (
    <div className="login-container-new" style={{backgroundImage: `url(${loginBg})`}}>
      <div className="login-card-new">
        <div className="login-icon">
          <img src={LoginIcon} alt="Login Icon" style={{ width: '128px', height: '128px' }} />
          </div>
        
        <h2 className="login-title">Sign in to Your Account</h2>
        <p className="login-subtitle">Access your Bandhayudha dashboard</p>
        
        {/* Menampilkan error jika ada dari proses login */}
        {error && (
          <div className="login-error">
            {error.message || 'An authentication error occurred.'}
          </div>
        )}
        
        {/* Tombol login yang memicu SSO, bukan submit form */}
        <div className="login-form">
          <button onClick={handleLogin} className="login-btn-new" disabled={isLoading}>
            {isLoading ? 'Redirecting...' : 'Sign in with SSO'}
          </button>
        </div>
        
        <div className="login-hint">
          <small>You will be redirected to the official login page.</small>
        </div>
      </div>
    </div>
  );
}

export default Login;