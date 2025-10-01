import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/bandhayudha-logo.png';
import './OrderTracking.css';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRIirohhM2VxjAu5p3jVfjIfSrI2Gz5HsIqMlJddlX40jHDGkgFRCvOF4EXsERwwd1nw/exec";

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
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // State untuk data orders dari spreadsheet
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Fungsi untuk format angka dengan separator ribuan
  const formatNumber = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Fungsi untuk mengambil data orders dari spreadsheet
  const fetchOrders = async () => {
    setLoadingOrders(true);
    setFetchError('');
    
    try {
      console.log('Fetching orders from:', `${SCRIPT_URL}?action=getOrders`);
      
      const response = await fetch(`${SCRIPT_URL}?action=getOrders&t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.result === 'success') {
        console.log('Orders received:', data.orders);
        // Filter hanya data yang memiliki nama (menghindari baris kosong)
        const validOrders = data.orders.filter(order => order.nama && order.nama.trim() !== '');
        setOrders(validOrders);
      } else {
        console.error('Error from script:', data.message || data.error);
        setFetchError(data.message || data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setFetchError(`Network error: ${error.message}`);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load orders saat komponen pertama kali dimuat
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'process': return '#007bff'; // Biru
      case 'ordered': return '#28a745'; // Hijau
      case 'delivery': return '#fd7e14'; // Orange
      case 'arrived': return '#28a745'; // Hijau
      default: return '#6c757d'; // Abu-abu
    }
  };

  // Fungsi untuk format harga
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    // Jika sudah ada titik, hapus dulu baru format ulang
    const cleanPrice = price.toString().replace(/\./g, '');
    return formatNumber(cleanPrice);
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateStr; // Return original jika gagal format
    }
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
    e.preventDefault();
    setSubmissionStatus('submitting');

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      dataToSubmit.append(key, formData[key]);
    });

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: dataToSubmit,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Submit response:', data);
      if (data.result === 'success') {
        setSubmissionStatus('success');
        // Kosongkan form setelah berhasil
        setFormData({
          nama: '', divisi: '', namaBarang: '', linkBarang: '',
          jumlahBarang: '', hargaTotal: ''
        });
        // Refresh orders list dengan delay
        setTimeout(() => {
          fetchOrders();
        }, 2000);
      } else {
        throw new Error(data.error?.message || 'Unknown error from script');
      }
    })
    .catch((error) => {
      console.error('Error submitting form:', error);
      setSubmissionStatus('error');
    });
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header-new">
        <div className="header-container">
          <div className="header-left">
            <img src={logo} alt="Bandhayudha Logo" className="header-logo-new" />
            <div className="header-brand">
              <h1>Bandhayudha</h1>
              <span>Order Tracking System</span>
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

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Order Tracking</h2>
            <p>Tambahkan Request Barang</p>
          </div>

          <div className="order-tracking-layout">
            {/* Track Order */}
            <div className="track-order-container">
              <div className="track-order-form">
                <h3>Track Order</h3>
                <button 
                  className="refresh-button"
                  onClick={fetchOrders}
                  disabled={loadingOrders}
                >
                  {loadingOrders ? 'Loading...' : 'Refresh'}
                </button>
                
                {fetchError && (
                  <div className="error-message" style={{ marginBottom: '20px' }}>
                    ❌ Error: {fetchError}
                  </div>
                )}
                
                <div className="orders-list">
                  {loadingOrders ? (
                    <div className="loading-state">Loading orders...</div>
                  ) : fetchError ? (
                    <div className="empty-state">
                      Failed to load orders. Please check console for details.
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="empty-state">No orders found</div>
                  ) : (
                    orders.map((order, index) => (
                      <div key={index} className="order-item">
                        <div className="order-header">
                          <div className="order-info">
                            <strong>Nama:</strong> {order.nama || 'N/A'}<br/>
                            <strong>Divisi:</strong> {order.divisi || 'N/A'}
                          </div>
                          <div 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(order.Status || order.status || 'Process') }}
                          >
                            {order.Status || order.status || 'Process'}
                          </div>
                        </div>
                        
                        <div className="order-details">
                          <div className="detail-row">
                            <strong>Barang:</strong> {order.namaBarang || 'N/A'}
                          </div>
                          <div className="detail-row">
                            <strong>Jumlah:</strong> {order.jumlahBarang || 'N/A'}
                          </div>
                          <div className="detail-row">
                            <strong>Harga:</strong> Rp {formatPrice(order.hargaTotal)}
                          </div>
                          {order.linkBarang && order.linkBarang !== '' && (
                            <div className="detail-row">
                              <strong>Link:</strong> 
                              <a 
                                href={order.linkBarang} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="order-link"
                              >
                                View Product
                              </a>
                            </div>
                          )}
                          <div className="detail-row">
                            <strong>Tanggal:</strong> {formatDate(order.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Debug info */}
                <div style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
                  Debug: Orders count: {orders.length} | Loading: {loadingOrders.toString()} | Error: {fetchError || 'None'}
                </div>
              </div>
            </div>

            {/* Form Request Barang */}
            <div className="tracking-form-container">
              <div className="tracking-form">
                <h3>Request Barang Baru</h3>
                <p>Silakan isi detail di bawah ini.</p>
                
                {submissionStatus === 'success' && (
                  <div className="success-message">
                    ✅ Data berhasil terkirim! Status: Process
                  </div>
                )}
                {submissionStatus === 'error' && (
                  <div className="error-message">
                    ❌ Terjadi kesalahan. Gagal mengirim data.
                  </div>
                )}
                
                <form className="track-request-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="nama">Nama</label>
                    <input 
                      type="text" 
                      id="nama" 
                      name="nama" 
                      value={formData.nama} 
                      onChange={handleChange} 
                      placeholder="Masukkan nama Anda" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="divisi">Divisi</label>
                    <input 
                      type="text" 
                      id="divisi" 
                      name="divisi" 
                      value={formData.divisi} 
                      onChange={handleChange} 
                      placeholder="Contoh: Electric, Program, Mekanik" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="namaBarang">Nama Barang</label>
                    <input 
                      type="text" 
                      id="namaBarang" 
                      name="namaBarang" 
                      value={formData.namaBarang} 
                      onChange={handleChange} 
                      placeholder="Contoh: PCB, LiDAR, Roti Bakar" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="linkBarang">Link Barang</label>
                    <input 
                      type="url" 
                      id="linkBarang" 
                      name="linkBarang" 
                      value={formData.linkBarang} 
                      onChange={handleChange} 
                      placeholder="Contoh: https://..." 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="jumlahBarang">Jumlah Barang</label>
                    <input 
                      type="number" 
                      id="jumlahBarang" 
                      name="jumlahBarang" 
                      value={formData.jumlahBarang} 
                      onChange={handleChange} 
                      placeholder="Contoh: 1" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="hargaTotal">Harga Total</label>
                    <input 
                      type="text" 
                      id="hargaTotal" 
                      name="hargaTotal" 
                      value={formatNumber(formData.hargaTotal)} 
                      onChange={handleChange} 
                      placeholder="Contoh: 1.000.000" 
                      required 
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="send-button" 
                    disabled={submissionStatus === 'submitting'}
                  >
                    {submissionStatus === 'submitting' ? 'Mengirim...' : 'Send Request'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;