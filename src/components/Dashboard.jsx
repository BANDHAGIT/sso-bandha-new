import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

import logo from '../assets/bandhayudha-logo.png';
import moodleLogo from '../assets/moodle-logo.png';
import nextcloudLogo from '../assets/nextcloud-logo.png';
import udemylogo from '../assets/udemy-logo.png';
import n8nlogo from '../assets/n8n-logo.png';
import newslogo from '../assets/news-logo.png';
import openprojectlogo from '../assets/openproject-logo.png';
import cartlogo from '../assets/cart-logo.png';

import { db } from '../firebase/firebase.js'; 
import { collection, getDocs, setDoc, doc } from "firebase/firestore";


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


const UserSettings = ({ users, onSave, onClose }) => {
  const [localUsers, setLocalUsers] = useState(JSON.parse(JSON.stringify(users))); 

  const handleRoleChange = (username, roleType) => {
    setLocalUsers(prevUsers =>
      prevUsers.map(user =>
        user.username === username
          ? { ...user, [roleType]: !user[roleType] }
          : user
      )
    );
  };


  const handleSaveChanges = () => {
    onSave(localUsers);
    onClose();
  };

  
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' };
  const thStyle = { background: '#f4f4f4', padding: '10px', border: '1px solid #ddd', textAlign: 'left' };
  const tdStyle = { padding: '10px', border: '1px solid #ddd', textAlign: 'center' };
  const usernameStyle = { ...tdStyle, textAlign: 'left', fontWeight: '500' };

  return (
    <div className="news-tutorial-overlay" onClick={onClose}>
      <div className="news-tutorial-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Manage User Roles</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <p>Atur peran pengguna dalam sistem. Perubahan akan aktif setelah disimpan.</p>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Admin</th>
                <th style={thStyle}>Program</th>
                <th style={thStyle}>Electric</th>
                <th style={thStyle}>Mechanic</th>
              </tr>
            </thead>
            <tbody>
              {localUsers.map(user => (
                <tr key={user.username}>
                  <td style={usernameStyle}>{user.username}</td>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={user.isAdmin}
                      onChange={() => handleRoleChange(user.username, 'isAdmin')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={user.isProgram}
                      onChange={() => handleRoleChange(user.username, 'isProgram')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={user.isElectric}
                      onChange={() => handleRoleChange(user.username, 'isElectric')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={user.isMechanic}
                      onChange={() => handleRoleChange(user.username, 'isMechanic')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            onClick={handleSaveChanges} 
            style={{ 
              marginTop: '20px', 
              padding: '10px 15px', 
              cursor: 'pointer', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};




function Dashboard() {
  const { user, logout } = useAuth();
  console.log("User Profile:", user?.profile);
  const navigate = useNavigate();
  
  // --- State untuk Modal (Tetap Sama) ---
  const [showWiFiTutorial, setShowWiFiTutorial] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showUdemy, setShowUdemy] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  
 
  const [userRoles, setUserRoles] = useState([]);
  
  const [loadingRoles, setLoadingRoles] = useState(true);


  useEffect(() => {
   
    const fetchUserRoles = async () => {
      setLoadingRoles(true); 
      try {
        const usersCollectionRef = collection(db, "users");
        const dataSnapshot = await getDocs(usersCollectionRef);
        
        const rolesList = dataSnapshot.docs.map(doc => ({
          username: doc.id, 
          ...doc.data()    
        }));
        
        setUserRoles(rolesList);

      } catch (error) {
        console.error("Error mengambil data roles dari Firestore:", error);
      }
      setLoadingRoles(false); 
    };

    fetchUserRoles();
  }, []);


  const handleSaveRoles = async (newRoles) => {
    setUserRoles(newRoles);
    
    try {
      await Promise.all(
        newRoles.map(userRole => {
          const userDocRef = doc(db, "users", userRole.username);
          
          const dataToSave = {
            isAdmin: userRole.isAdmin,
            isProgram: userRole.isProgram,
            isElectric: userRole.isElectric,
            isMechanic: userRole.isMechanic
          };
          
          return setDoc(userDocRef, dataToSave, { merge: true });
        })
      );
      
      console.log("Roles berhasil disimpan ke Firestore!");

    } catch (error) {
      console.error("Error menyimpan roles ke Firestore:", error);
    }
  };


  const isAdmin = useMemo(() => {

    if (!user?.profile?.preferred_username) {

        return false;

    }

    const foundUser = userRoles.find(

      u => u.username === user.profile.preferred_username

    );

    return foundUser ? foundUser.isAdmin : false;

  }, [user, userRoles]);



  const isProgram = useMemo(() => {

    if (!user?.profile?.preferred_username) {

        return false;

    }

    const foundUser = userRoles.find(

      u => u.username === user.profile.preferred_username

    );

    return foundUser ? foundUser.isProgram : false;

  }, [user, userRoles]);



  const isElectric = useMemo(() => {

    if (!user?.profile?.preferred_username) {

        return false;

    }

    const foundUser = userRoles.find(

      u => u.username === user.profile.preferred_username

    );

    return foundUser ? foundUser.isElectric : false;
    

  }, [user, userRoles]);

  const isMechanic = useMemo(() => {

    if (!user?.profile?.preferred_username) {

        return false;

    }

    const foundUser = userRoles.find(

      u => u.username === user.profile.preferred_username

    );

    return foundUser ? foundUser.isMechanic : false;
    

  }, [user, userRoles]);


  const applications = useMemo(() => {

    const baseApps = [

      { name: 'Drive', url: 'https://drive.bandhayudha.icu', icon: nextcloudLogo, description: 'File Storage & Sharing', isImage: true },
      { name: 'BandhaLab', url: 'https://lab.bandhayudha.com', icon: moodleLogo, description: 'Virtual Laboratory', isImage: true },
      { name: 'Udemy', url: '#', icon: udemylogo, description: 'Online Learning Platform', isImage: true, action: () => setShowUdemy(true) },
      { name: 'WiFi Guide', url: '#', icon: '📶', description: 'Panduan Koneksi WiFi', action: () => setShowWiFiTutorial(true) },
      { name: 'News', url: '#', icon: newslogo, isImage: true, description: 'Berita & Pengumuman', isImage: true, action: () => setShowNews(true) },
      { name: 'N8N', url: 'https://n8n.bandhayudha.com', icon: n8nlogo, description: 'Workflow Automation', isImage: true },
      { name: 'Task Management', url: 'https://task.bandhayudha.com', icon: openprojectlogo, description: 'Project & Task Manager', isImage: true },

    ];


    if (isAdmin || isProgram || isElectric || isMechanic) { 
      if (!baseApps.some(app => app.name === 'Order Tracking')) {
         baseApps.push({ 
           name: 'Order Tracking', 
           url: '#', 
           icon: cartlogo, 
           description: 'Package Tracking', 
           isImage: true, 
           action: () => navigate('/order-tracking') 
         });
      }
    }
    
    if (isAdmin) {
       if (!baseApps.some(app => app.name === 'User Settings')) {
          baseApps.push({
            name: 'User Settings',
            url: '#',
            icon: '⚙️', 
            description: 'Manage user roles',
            isImage: false,
            action: () => setShowSettings(true)
          });
       }
    }

    return baseApps;
  }, [isAdmin, isProgram, isElectric, isMechanic, navigate]);

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
                 <span>{user?.profile.preferred_username?.charAt(0) || 'U'}</span>
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
                <div className="user-roles">
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>
              {' '}
              {userRoles.find(u => u.username === user?.profile.preferred_username)
                ? [
                    isAdmin && 'Admin',
                    isProgram && 'Program',
                    isElectric && 'Electric', 
                    isMechanic && 'Mechanic'
                  ].filter(Boolean).join(', ') || 'No roles assigned'
                : 'Loading roles...'}
            </p>
          </div>
              </div>
             </div>
            <hr />
            <button className="logout-btn-dropdown" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      )}
      
      {showWiFiTutorial && <WiFiTutorial onClose={() => setShowWiFiTutorial(false)} />}
      {showNews && <News onClose={() => setShowNews(false)} />}
      {showUdemy && <Udemy onClose={() => setShowUdemy(false)} />}


      {showSettings && (
        <UserSettings
          users={userRoles}
          onSave={handleSaveRoles} 
          onClose={() => setShowSettings(false)}
        />
      )}

      <main className="dashboard-main">
        {loadingRoles ? (
          <div className="welcome-section">
            <h2>Loading user data...</h2>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}

export default Dashboard;