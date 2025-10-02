import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

// Import semua logo Anda di sini...
import logo from '../assets/bandhayudha-logo.png';
import moodleLogo from '../assets/moodle-logo.png';
import nextcloudLogo from '../assets/nextcloud-logo.png';
import udemylogo from '../assets/udemy-logo.png';
import n8nlogo from '../assets/n8n-logo.png';
import newslogo from '../assets/news-logo.png';
import openprojectlogo from '../assets/openproject-logo.png';
import cartlogo from '../assets/cart-logo.png';

// --- PERBAIKAN 1: Pindahkan komponen Modal ke luar ---
// Ini mencegah pembuatan ulang komponen pada setiap render, sehingga lebih efisien.
// Terima 'onClose' sebagai prop untuk menutup modal.

const WiFiTutorial = ({ onClose }) => (
  <div className="wifi-tutorial-overlay" onClick={onClose}>
    <div className="wifi-tutorial-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Panduan Koneksi WiFi</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="modal-content">
        <h4>Langkah-langkah koneksi:</h4>
        <ol>
          <li>Hubungi Athaya Divisi Electric</li>
        </ol>
      </div>
    </div>
  </div>
);

const News = ({ onClose }) => (
  <div className="news-tutorial-overlay" onClick={onClose}>
    <div className="news-tutorial-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>News</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="modal-content">
        <h4>Under Maintenance</h4>
      </div>
    </div>
  </div>
);

const Udemy = ({ onClose }) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const email = 'bandhayudha@gmail.com';
  const password = 'bandhayudha123';

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'email') {
        setEmailCopied(true);
        setPasswordCopied(false);
        setTimeout(() => setEmailCopied(false), 2000);
      } else if (type === 'password') {
        setPasswordCopied(true);
        setEmailCopied(false);
        setTimeout(() => setPasswordCopied(false), 2000);
      }
    });
  };

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const textStyle = {
    margin: 0,
    fontFamily: 'sans-serif', 
    color: '#333',
  };

  const getButtonStyle = (isCopied) => ({
    marginLeft: '15px',
    padding: '8px 12px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.1s ease',
    backgroundColor: isCopied ? '#28a745' : '#007bff', 
  });


  return (
    <div className="news-tutorial-overlay" onClick={onClose}>
      <div className="news-tutorial-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Udemy</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <h4>Silakan gunakan akun berikut:</h4>
          <div style={itemStyle}>
            <h5 style={textStyle}>Email : {email}</h5>
            <button 
              className="copy-button" 
              style={getButtonStyle(emailCopied)} 
              onClick={() => copyToClipboard(email, 'email')}
            >
              {emailCopied ? 'Tersalin!' : 'Copy'}
            </button>
          </div>
          <div style={itemStyle}>
            <h5 style={textStyle}>Password : {password}</h5>
            <button
              className="copy-button"
              style={getButtonStyle(passwordCopied)} 
              onClick={() => copyToClipboard(password, 'password')}
            >
              {passwordCopied ? 'Tersalin!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- KOMPONEN UTAMA DASHBOARD ---

function Dashboard() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWiFiTutorial, setShowWiFiTutorial] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showUdemy, setShowUdemy] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const adminUsernames = ['bagas', 'admin_utama', 'banda'];
  const isAdmin = useMemo(() => {
    if (!user?.profile?.preferred_username) {
        return false;
    }
    return adminUsernames.includes(user.profile.preferred_username);
    
}, [user]);

  // --- PERBAIKAN 4: Gunakan useMemo untuk membuat daftar aplikasi secara kondisional ---
  const applications = useMemo(() => {
    const baseApps = [
      { name: 'Drive', url: 'https://drive.bandhayudha.icu', icon: nextcloudLogo, description: 'File Storage & Sharing', isImage: true },
      { name: 'BandhaLab', url: 'https://lab.bandhayudha.com', icon: moodleLogo, description: 'Virtual Laboratory', isImage: true },
      { name: 'Udemy', url: '#', icon: udemylogo, description: 'Online Learning Platform', isImage: true, action: () => setShowUdemy(true) },
      { name: 'WiFi Guide', url: '#', icon: '📶', description: 'Panduan Koneksi WiFi', action: () => setShowWiFiTutorial(true) },
      { name: 'News', url: '#', icon: newslogo, isImage: true, description: 'Berita & Pengumuman', action: () => setShowNews(true) },
      { name: 'N8N', url: 'https://n8n.bandhayudha.com', icon: n8nlogo, description: 'Workflow Automation', isImage: true },
      { name: 'Task Management', url: 'https://task.bandhayudha.com', icon: openprojectlogo, description: 'Project & Task Manager', isImage: true },
    ];

    if (isAdmin) {
      baseApps.push({ 
        name: 'Order Tracking', 
        url: '#', 
        icon: cartlogo, 
        description: 'Package Tracking', 
        isImage: true, 
        action: () => navigate('/order-tracking') 
      });
    }

    return baseApps;
  }, [isAdmin, navigate]);
  
  const handleCardClick = (app) => {
    if (app.action) {
      app.action();
    } else if (app.url) {
      window.open(app.url, '_blank');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header-new">
        <div className="header-container">
          <div className="header-left">
            <img src={logo} alt="Bandhayudha Logo" className="header-logo-new" />
            <div className="header-brand">
              <h1>Bandhayudha</h1>
              <span>Single Sign-On Portal</span>
            </div>
          </div>
          <div className="header-right">
            <div className="user-menu" onClick={() => setShowProfile(!showProfile)}>
              <div className="user-avatar">
                <span>{user?.profile.name?.charAt(0) || 'U'}</span>
              </div>
              <span className="user-name">{user?.profile.name || 'User'}</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
      </header>

      {showProfile && (
        <div className="profile-dropdown-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="profile-info">
              <div className="profile-avatar">
                <span>{user?.profile.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="profile-details">
                <h4>{user?.profile.name || 'N/A'}</h4>
                <p>{user?.profile.email || 'N/A'}</p>
              </div>
            </div>
            <hr />
            <button className="logout-btn-dropdown" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      )}
      
      {/* Panggil komponen modal dengan prop 'onClose' */}
      {showWiFiTutorial && <WiFiTutorial onClose={() => setShowWiFiTutorial(false)} />}
      {showNews && <News onClose={() => setShowNews(false)} />}
      {showUdemy && <Udemy onClose={() => setShowUdemy(false)} />}

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome to your Bandhayudha dashboard</h2>
            <p>Please select your required application to login</p>
          </div>

          <div className="applications-grid">
            {applications.map((app) => (
              <div key={app.name} className="app-card-new" onClick={() => handleCardClick(app)}>
                <div className="app-icon-container">
                  {app.isImage ? (
                    <img src={app.icon} alt={`${app.name} icon`} className="app-icon-img" />
                  ) : (
                    <span className="app-icon-emoji">{app.icon}</span>
                  )}
                </div>
                <h3 className="app-name">{app.name}</h3>
                <p className="app-description">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;