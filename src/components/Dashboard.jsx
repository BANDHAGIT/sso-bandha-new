import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/bandhayudha-logo.png';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const applications = [
    { name: 'Drive', url: 'https://drive.bandhayudha.icu', icon: '💾', description: 'File Storage & Sharing' },
    { name: 'BandhaLab', url: 'https://bandhalab.bandhayudha.icu', icon: '🔬', description: 'Virtual Laboratory' },
    { name: 'Udemy', url: 'https://udemy.bandhayudha.icu', icon: '📚', description: 'Online Learning Platform' },
    { name: 'WiFi Connect Guide', url: 'https://wifi-guide.bandhayudha.icu', icon: '📶', description: 'Panduan Koneksi WiFi' },
    { name: 'News', url: 'https://news.bandhayudha.icu', icon: '📰', description: 'Berita & Pengumuman' },
    { name: 'N8N', url: 'https://n8n.bandhayudha.icu', icon: '⚡', description: 'Workflow Automation' },
    { name: 'Task Management', url: 'https://tasks.bandhayudha.icu', icon: '✅', description: 'Project & Task Manager' },
  ];

  const handleAppClick = (url) => window.open(url, '_blank');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback jika logout gagal
      window.location.href = '/';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="Bandhayudha Logo" className="header-logo" />
          <div className="header-text">
            <h1>Dashboard SSO Bandhayudha</h1>
            <p>Selamat datang, {user?.profile?.name || user?.profile?.preferred_username || 'User'}!</p>
          </div>
        </div>
        <div className="header-right">
          <button className="profile-button" onClick={() => setShowProfile(!showProfile)}>
            <span className="profile-icon">👤</span>
            Profile
          </button>
          <button 
            className="logout-button" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {showProfile && (
        <div className="profile-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header">
              <h3>Informasi Profile</h3>
              <button className="close-button" onClick={() => setShowProfile(false)}>×</button>
            </div>
            <div className="profile-content">
              <div className="profile-item"><strong>Nama:</strong> {user?.profile?.name || 'N/A'}</div>
              <div className="profile-item"><strong>Username:</strong> {user?.profile?.preferred_username || 'N/A'}</div>
              <div className="profile-item"><strong>Email:</strong> {user?.profile?.email || 'N/A'}</div>
              <div className="profile-item"><strong>Subject ID:</strong> {user?.profile?.sub || 'N/A'}</div>
              {user?.profile?.groups && (
                <div className="profile-item"><strong>Groups:</strong> {user.profile.groups.join(', ')}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="apps-section">
        <h2>Layanan Bandhayudha</h2>
        <div className="apps-grid">
          {applications.map((app) => (
            <div key={app.name} className="app-card" onClick={() => handleAppClick(app.url)}>
              <div className="app-icon">{app.icon}</div>
              <h3>{app.name}</h3>
              <p>{app.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
