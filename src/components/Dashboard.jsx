import React, { useState } from 'react';
import logo from '../assets/bandhayudha-logo.png';
import moodleLogo from '../assets/moodle-logo.png';
import nextcloudLogo from '../assets/nextcloud-logo.png';
import udemylogo from '../assets/udemy-logo.png';
import n8nlogo from '../assets/n8n-logo.png';
import openprojectlogo from '../assets/openproject-logo.png';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();

  const [showWiFiTutorial, setShowWiFiTutorial] = useState(false);
  const [showNews, setShowNews] = useState(false);

  // Komponen Modal untuk Tutorial WiFi
  const WiFiTutorial = () => (
    <div className="wifi-tutorial-overlay" onClick={() => setShowWiFiTutorial(false)}>
      <div className="wifi-tutorial-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Panduan Koneksi WiFi</h3>
          <button className="close-button" onClick={() => setShowWiFiTutorial(false)}>×</button>
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

  const News = () => (
    <div className="news-tutorial-overlay" onClick={() => setShowWiFiTutorial(false)}>
      <div className="news-tutorial-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>News</h3>
          <button className="close-button" onClick={() => setShowNews(false)}>×</button>
        </div>
        <div className="modal-content">
          <h4>Under Maintenance</h4>
        </div>
      </div>
    </div>
  );

  const [showProfile, setShowProfile] = useState(false);

  const applications = [
    { 
      name: 'Drive', 
      url: 'https://drive.bandhayudha.icu', 
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
    { 
      name: 'Udemy', 
      url: 'https://udemy.bandhayudha.com', 
      icon: udemylogo, 
      description: 'Online Learning Platform',
      isImage: true
    },
    { 
      name: 'WiFi Guide', 
      url: '#', // url bisa tetap ada atau dihapus
      icon: '📶', 
      description: 'Panduan Koneksi WiFi',
      action: () => setShowWiFiTutorial(true) // Aksi khusus
    },
    { 
      name: 'News', 
      url: '#', 
      icon: '📰', 
      description: 'Berita & Pengumuman',
      action: () => setShowNews(true) 
    },
    { 
      name: 'N8N', 
      url: 'https://n8n.bandhayudha.com', 
      icon: n8nlogo, 
      description: 'Workflow Automation',
      isImage: true
    },
    { 
      name: 'Task Management', 
      url: 'https://task.bandhayudha.com', 
      icon: openprojectlogo, 
      description: 'Project & Task Manager',
      isImage: true
    }
  ];
  
  // --- PERUBAHAN 1: Handler klik yang lebih cerdas ---
  const handleCardClick = (app) => {
    if (app.action) {
      app.action();
    } else if (app.url) {
      window.open(app.url, '_blank');
    }
  };


  return (
    <div className="dashboard-wrapper">
      {/* Header */}
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
                <span>{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="profile-dropdown-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="profile-info">
              <div className="profile-avatar">
                <span>{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="profile-details">
                <h4>{user?.name || 'N/A'}</h4>
                <p>{user?.email || 'N/A'}</p>
              </div>
            </div>
            <hr />
            <button className="logout-btn-dropdown" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Modal Tutorial WiFi */}
      {showWiFiTutorial && <WiFiTutorial />}
      {showNews && <News />}

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>Welcome to your Bandhayudha dashboard</h2>
            <p>Please select your required application to login</p>
          </div>

          {/* Applications Grid */}
          <div className="applications-grid">
            {applications.map((app) => (
              // --- PERUBAHAN 2: Menggunakan handler baru di sini ---
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