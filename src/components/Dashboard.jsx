import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext'; // Commented out for development
import logo from '../assets/bandhayudha-logo.png';
import moodleLogo from '../assets/moodle-logo.png';
import nextcloudLogo from '../assets/nextcloud-logo.png';
import udemylogo from '../assets/udemy-logo.png';
import n8nlogo from '../assets/n8n-logo.png';
import openprojectlogo from '../assets/openproject-logo.png';

function Dashboard() {
  // const { user, logout } = useAuth(); // Commented out for development
  
  // Mock user data for development
  const user = {
    name: 'Development User',
    email: 'dev@example.com'
  };

  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const applications = [
    { 
      name: 'Drive', 
      url: 'https://drive.bandhayudha.com', 
      icon: nextcloudLogo, 
      description: 'File Storage & Sharing',
      isImage: true
    },
    { 
      name: 'BandhaLab', 
      url: 'https://lab.bandhayudha.com', 
      icon: moodleLogo, 
      description: 'Virtual Laboratory',
      isImage: true
    },
    { name: 'Udemy', 
      url: 'https://udemy.bandhayudha.com', 
      icon: udemylogo, 
      description: 'Online Learning Platform',
      isImage: true
    },
    { name: 'WiFi Connect Guide', url: 'https://wifi-guide.bandhayudha.com', icon: '📶', description: 'Panduan Koneksi WiFi' },
    { name: 'News', url: 'https://news.bandhayudha.com', icon: '📰', description: 'Berita & Pengumuman' },
    { name: 'N8N', 
      url: 'https://n8n.bandhayudha.com', 
      icon: n8nlogo, 
      description: 'Workflow Automation',
      isImage: true
    },
    { name: 'Task Management', 
      url: 'https://task.bandhayudha.com', 
      icon: openprojectlogo, 
      description: 'Project & Task Manager',
      isImage: true
    },
  ];

  const handleAppClick = (url) => window.open(url, '_blank');

  const handleLogout = () => {
    console.log('Logout clicked - development mode');
    // Redirect to login or show logout UI
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="Bandhayudha Logo" className="header-logo" />
          <div className="header-text">
            <h1>Dashboard SSO Bandhayudha</h1>
            <p>Selamat datang, {user?.name || 'User'}!</p>
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
              <div className="profile-item"><strong>Nama:</strong> {user?.name || 'N/A'}</div>
              <div className="profile-item"><strong>Email:</strong> {user?.email || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="apps-section">
        <h2>Layanan Bandhayudha</h2>
        <div className="apps-grid">
          {applications.map((app) => (
            <div key={app.name} className="app-card" onClick={() => handleAppClick(app.url)}>
              <div className="app-icon">
                {app.isImage ? (
                  <img src={app.icon} alt={`${app.name} icon`} className="app-icon-image" />
                ) : (
                  app.icon
                )}
              </div>
              <h3>{app.name}</h3>
              <p>{app.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
