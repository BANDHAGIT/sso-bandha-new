import React, { useState } from 'react';
import logo from '../assets/bandhayudha-logo.png';
import moodleLogo from '../assets/moodle-logo.png';
import nextcloudLogo from '../assets/nextcloud-logo.png';
import udemylogo from '../assets/udemy-logo.png';
import n8nlogo from '../assets/n8n-logo.png';
import openprojectlogo from '../assets/openproject-logo.png';

function Dashboard() {
  const user = {
    name: 'Development User',
    email: 'dev@example.com'
  };

  const [showProfile, setShowProfile] = useState(false);

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
    { 
      name: 'Udemy', 
      url: 'https://udemy.bandhayudha.com', 
      icon: udemylogo, 
      description: 'Online Learning Platform',
      isImage: true
    },
    { 
      name: 'WiFi Guide', 
      url: 'https://wifi-guide.bandhayudha.com', 
      icon: '📶', 
      description: 'Panduan Koneksi WiFi' 
    },
    { 
      name: 'News', 
      url: 'https://bandhayudha.com/news', 
      icon: '📰', 
      description: 'Berita & Pengumuman' 
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

  const handleAppClick = (url) => window.open(url, '_blank');

  const handleLogout = () => {
    console.log('Logout clicked - development mode');
    window.location.href = '/login';
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
            <button className="logout-btn-dropdown" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}

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
              <div key={app.name} className="app-card-new" onClick={() => handleAppClick(app.url)}>
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
