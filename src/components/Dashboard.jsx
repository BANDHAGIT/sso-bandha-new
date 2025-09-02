import React, { useState } from 'react';
import logo from '../assets/bandhayudha-logo.png';
import moodleLogo from '../assets/moodle-logo.png';
import nextcloudLogo from '../assets/nextcloud-logo.png';
import udemylogo from '../assets/udemy-logo.png';
import n8nlogo from '../assets/n8n-logo.png';
import newslogo from '../assets/news-logo.png';
import openprojectlogo from '../assets/openproject-logo.png';
import cartlogo from '../assets/cart-logo.png';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();

  const [showWiFiTutorial, setShowWiFiTutorial] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showUdemy, setShowUdemy] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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

  const Tracking = () => {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuu_zEgzEKPFJZFJqjZsUOD85_hOwJydcEW8MXyuEJVU18dvI4zFBth2jpoWveHpmNeA/exec";

    // State untuk menyimpan semua data dari input form
    const [formData, setFormData] = useState({
      nama: '',
      divisi: '',
      namaBarang: '',
      linkBarang: '',
      jumlahBarang: '',
      hargaTotal: ''
    });

    // State untuk menampilkan status pengiriman (untuk feedback ke user)
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'submitting', 'success', 'error'

    // Fungsi untuk format angka dengan separator ribuan
    const formatNumber = (num) => {
      if (!num) return '';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Fungsi untuk menghilangkan format (untuk menyimpan nilai asli)
    const unformatNumber = (formattedNum) => {
      return formattedNum.replace(/\./g, '');
    };

    // Fungsi ini dijalankan setiap kali ada perubahan di salah satu input
    const handleChange = (e) => {
      const { name, value } = e.target;
      
      if (name === 'hargaTotal') {
        // Hapus semua karakter non-digit
        const numericValue = value.replace(/\D/g, '');
        setFormData(prevData => ({
          ...prevData,
          [name]: numericValue
        }));
      } else {
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      }
    };

    // Fungsi ini dijalankan saat tombol "Send" ditekan
    const handleSubmit = (e) => {
      e.preventDefault(); // Mencegah form me-refresh halaman
      setSubmissionStatus('submitting'); // Tandai sebagai "sedang mengirim"

      const dataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        dataToSubmit.append(key, formData[key]);
      });

      // Mengirim data ke URL Google Apps Script
      fetch(SCRIPT_URL, {
        method: 'POST',
        body: dataToSubmit,
      })
      .then(response => response.json())
      .then(data => {
        if (data.result === 'success') {
          setSubmissionStatus('success');
          // Kosongkan form setelah berhasil
          setFormData({
            nama: '', divisi: '', namaBarang: '', linkBarang: '',
            jumlahBarang: '', hargaTotal: ''
          });
        } else {
          // Jika script mengembalikan error
          throw new Error(data.error?.message || 'Unknown error from script');
        }
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        setSubmissionStatus('error');
      });
    };

    return (
      <div className="track-tutorial-overlay" onClick={() => setShowTracking(false)}>
        <div className="track-tutorial-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Order Tracking</h3>
            <button className="close-button" onClick={() => setShowTracking(false)}>×</button>
          </div>
          <div className="modal-content">
            <h4>Tambahkan Request Barang</h4>
            <p>Silakan isi detail di bawah ini.</p>
            
            {submissionStatus === 'success' && <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Data berhasil terkirim!</p>}
            {submissionStatus === 'error' && <p style={{ color: 'red', fontWeight: 'bold' }}>❌ Terjadi kesalahan. Gagal mengirim data.</p>}
            
            <form className="track-request-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nama">Nama</label>
                <input type="text" id="nama" name="nama" value={formData.nama} onChange={handleChange} placeholder="Masukkan nama Anda" required />
              </div>
              <div className="form-group">
                <label htmlFor="divisi">Divisi</label>
                <input type="text" id="divisi" name="divisi" value={formData.divisi} onChange={handleChange} placeholder="Contoh: Electric, Program, Mekanik" required />
              </div>
              <div className="form-group">
                <label htmlFor="namaBarang">Nama Barang</label>
                <input type="text" id="namaBarang" name="namaBarang" value={formData.namaBarang} onChange={handleChange} placeholder="Contoh: PCB, LiDAR, Roti Bakar" required />
              </div>
              <div className="form-group">
                <label htmlFor="linkBarang">Link Barang</label>
                <input type="url" id="linkBarang" name="linkBarang" value={formData.linkBarang} onChange={handleChange} placeholder="Contoh: https://..." required />
              </div>
              <div className="form-group">
                <label htmlFor="jumlahBarang">Jumlah Barang</label>
                <input type="number" id="jumlahBarang" name="jumlahBarang" value={formData.jumlahBarang} onChange={handleChange} placeholder="Contoh: 1" required />
              </div>
              <div className="form-group">
                <label htmlFor="hargaTotal">Harga Total</label>
                <input type="text" id="hargaTotal" name="hargaTotal" value={formatNumber(formData.hargaTotal)} onChange={handleChange} placeholder="Contoh: 1.000.000" required />
              </div>
              <button type="submit" className="send-button" disabled={submissionStatus === 'submitting'}>
                {submissionStatus === 'submitting' ? 'Mengirim...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };
  // --- KODE BARU BERAKHIR DI SINI ---

  const News = () => (
    <div className="news-tutorial-overlay" onClick={() => setShowNews(false)}>
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

  const Udemy = () => (
    <div className="news-tutorial-overlay" onClick={() => setShowUdemy(false)}>
      <div className="news-tutorial-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Udemy</h3>
          <button className="close-button" onClick={() => setShowUdemy(false)}>×</button>
        </div>
        <div className="modal-content">
          <h4>Under Maintenance</h4>
        </div>
      </div>
    </div>
  );

  const applications = [
    { name: 'Drive', url: 'https://drive.bandhayudha.icu', icon: nextcloudLogo, description: 'File Storage & Sharing', isImage: true },
    { name: 'BandhaLab', url: 'https://lab.bandhayudha.com', icon: moodleLogo, description: 'Virtual Laboratory', isImage: true },
    { name: 'Udemy', url: '#', icon: udemylogo, description: 'Online Learning Platform', isImage: true, action: () => setShowUdemy(true) },
    { name: 'WiFi Guide', url: '#', icon: '📶', description: 'Panduan Koneksi WiFi', action: () => setShowWiFiTutorial(true) },
    { name: 'News', url: '#', icon: newslogo, isImage: true, description: 'Berita & Pengumuman', action: () => setShowNews(true) },
    { name: 'N8N', url: 'https://n8n.bandhayudha.com', icon: n8nlogo, description: 'Workflow Automation', isImage: true },
    { name: 'Task Management', url: 'https://task.bandhayudha.com', icon: openprojectlogo, description: 'Project & Task Manager', isImage: true },
    { name: 'Order Tracking', url: '#', icon: cartlogo, description: 'Package Tracking', isImage: true, action: () => setShowTracking(true) }
  ];
  
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
                <span>{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
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

      {showWiFiTutorial && <WiFiTutorial />}
      {showNews && <News />}
      {showUdemy && <Udemy />}
      {showTracking && <Tracking />}

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