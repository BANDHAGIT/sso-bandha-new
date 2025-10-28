import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/bandhayudha-logo.png';
import './OrderTracking.css';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcdbm3q7sJJLoTBi6VmZSmZhsqBHKiKta6MCookx5nnuPJJIMhUert8bJvcWI9VEZk/exec";

  const [userRoles, setUserRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  // ------------------

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
        console.error("Error fetching roles:", error);
      }
      setLoadingRoles(false);
    };
    fetchUserRoles();
  }, []);

  const userRole = useMemo(() => {
    if (!user?.profile?.preferred_username) return null;
    return userRoles.find(u => u.username === user.profile.preferred_username);
  }, [user, userRoles]);

  const isAdmin = useMemo(() => userRole?.isAdmin || false, [userRole]);
  const isProgram = useMemo(() => userRole?.isProgram || false, [userRole]);
  const isElectric = useMemo(() => userRole?.isElectric || false, [userRole]);
  const isMechanic = useMemo(() => userRole?.isMechanic || false, [userRole]);
  const isOfficial = useMemo (() => userRole?.isOfficial || false, [userRole]);

  const getDivisionFromRoles = () => {
    if (isProgram) return 'Program';
    if (isElectric) return 'Electric';
    if (isMechanic) return 'Mechanic';
    if (isOfficial) return 'Official';
    return '';
  };

  const userDivision = useMemo(getDivisionFromRoles, [isProgram, isElectric, isMechanic, isOfficial]);

  const initialFormData = ({
    nama: user?.profile?.name || '',
    divisi: userDivision,
    namaBarang: '',
    linkBarang: '',
    jumlahBarang: '',
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      divisi: userDivision
    }));
  }, [userDivision]); 

  const [formData, setFormData] = useState(initialFormData);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const formatNumber = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const fetchOrders = async (fetchType) => { 
    setLoadingOrders(true);
    setFetchError('');
    
    let fetchUrl;

    if (fetchType === 'ADMIN') {
      fetchUrl = `${SCRIPT_URL}?action=getAllOrders&t=${Date.now()}`;
      console.log('Fetching ALL orders (Admin Mode) from:', fetchUrl);
    } else if (fetchType) {
      fetchUrl = `${SCRIPT_URL}?action=getOrders&divisi=${encodeURIComponent(fetchType)}&t=${Date.now()}`;
      console.log('Fetching orders from:', fetchUrl);
    } else {
      setLoadingOrders(false);
      setFetchError('User division not found or not assigned.');
      setOrders([]);
      return;
    }
    
    try {
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.result === 'success') {
        console.log('Orders received:', data.orders.length);
        // Pastikan data adalah array sebelum filter
        const ordersArray = Array.isArray(data.orders) ? data.orders : [];
        const validOrders = ordersArray.filter(order => order.nama && order.nama.trim() !== '');
        setOrders(validOrders);
      } else {
        console.error('Error from script:', data.message || data.error);
        setFetchError(data.message || data.error || 'Unknown error');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setFetchError(`Network error: ${error.message}`);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!loadingRoles) {
      if (isAdmin) {
        console.log("Admin mode detected. Fetching all orders.");
        fetchOrders('ADMIN');
      } else if (userDivision) {
        console.log(`User division ${userDivision} detected. Fetching orders.`);
        fetchOrders(userDivision);
      } else {
        setLoadingOrders(false);
        setOrders([]);
        setFetchError('Anda tidak masuk dalam divisi (Program, Electric, Mechanic).');
      }
    }
  }, [userDivision, loadingRoles, isAdmin]);

  const getStatusColor = (status) => {
    // ... (fungsi ini tidak berubah)
    switch (status?.toLowerCase()) {
      case 'process': return '#007bff';
      case 'ordered': return '#28a745';
      case 'delivery': return '#fd7e14';
      case 'arrived': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatPrice = (price) => {
    // ... (fungsi ini tidak berubah)
    if (!price) return 'N/A';
    const cleanPrice = price.toString().replace(/\./g, '');
    return formatNumber(cleanPrice);
  };

  const formatDate = (dateStr) => {
    // ... (fungsi ini tidak berubah)
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateStr; 
    }
  };

  const handleChange = (e) => {
    // ... (fungsi ini tidak berubah)
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value.trim() === '' ? initialFormData[name] : value
    }));
  };

  const handleSubmit = (e) => {
    // ... (fungsi ini tidak berubah)
    e.preventDefault();
    setSubmissionStatus('submitting');
    const dataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      dataToSubmit.append(key, formData[key]);
    });
    
    // Tidak perlu 'action' di sini, backend akan handle sebagai default
    console.log("Submitting data:");
    for (var pair of dataToSubmit.entries()) {
        console.log(pair[0]+ ': ' + pair[1]); 
    }

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: dataToSubmit,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Submit response:', data);
      if (data.result === 'success') {
        setSubmissionStatus('success');
        setFormData({
          ...initialFormData,
          nama: user?.profile?.name || '',
          divisi: userDivision
        });
        setTimeout(() => {
          fetchOrders(isAdmin ? 'ADMIN' : userDivision); 
        }, 2000);
      } else {
        throw new Error(data.error?.message || data.error || 'Unknown error from script');
      }
    })
    .catch((error) => {
      console.error('Error submitting form:', error);
      setSubmissionStatus('error');
    });
  };


  // --- FUNGSI BARU UNTUK APPROVE ORDER ---
  const handleApproveOrder = async (order) => {
    // Kita ubah status "Process" menjadi "Ordered" (sesuai alur status Anda)
    const newStatus = 'ordered'; 
    
    // Gunakan rowNumber + sheetName sebagai ID unik untuk loading
    const uniqueOrderId = `${order.sheetName}-${order.rowNumber}`;
    setUpdatingOrderId(uniqueOrderId);

    const dataToSubmit = new FormData();
    dataToSubmit.append('action', 'updateStatus');
    dataToSubmit.append('sheetName', order.sheetName);
    dataToSubmit.append('rowNumber', order.rowNumber);
    dataToSubmit.append('newStatus', newStatus);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: dataToSubmit,
      });
      const data = await response.json();
      
      if (data.result === 'success') {
        // Update state lokal secara langsung agar UI responsif
        setOrders(prevOrders =>
          prevOrders.map(o =>
            (o.rowNumber === order.rowNumber && o.sheetName === order.sheetName)
              ? { ...o, Status: newStatus } // Update status order yang sesuai
              : o
          )
        );
      } else {
        throw new Error(data.error || 'Gagal update status dari script');
      }
    } catch (error) {
      console.error('Error approving order:', error);
      alert(`Gagal meng-approve order: ${error.message}`);
    } finally {
      setUpdatingOrderId(null); // Selesai loading
    }
  };
  // --- AKHIR FUNGSI BARU ---


  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header-new">
        {/* ... (Tidak ada perubahan di header) ... */}
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
                <span>{user?.profile?.name?.charAt(0) || 'U'}</span>
              </div>
              <span className="user-name">{user?.profile?.name || 'User'}</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
      </header>

      {showProfile && (
      <div className="profile-dropdown-overlay" onClick={() => setShowProfile(false)}>
        {/* ... (Tidak ada perubahan di dropdown profile) ... */}
        <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="profile-info">
            <div className="profile-avatar">
              <span>{user?.profile?.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="profile-details">
              <h4>{user?.profile?.name || 'N/A'}</h4>
              <p>{user?.profile?.email || 'N/A'}</p>
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
            <p>
              {isAdmin 
                ? 'Menampilkan semua order (Admin Mode)' 
                : `Tambahkan Request Barang ${userDivision ? `(Divisi: ${userDivision})` : ''}`
              }
            </p>
          </div>

          <div className="order-tracking-layout">
            {/* Track Order */}
            <div className="track-order-container">
              <div className="track-order-form">
                <h3>
                {isAdmin ? 'All Division Orders' : 'Track Order'}
              </h3>
                <button 
                  className="refresh-button"
                  onClick={() => fetchOrders(isAdmin ? 'ADMIN' : userDivision)}
                  disabled={loadingOrders || loadingRoles}
                >
                  {loadingOrders ? 'Loading...' : 'Refresh'}
                </button>
                
                {fetchError && (
                  <div className="error-message" style={{ marginBottom: '20px' }}>
                    ❌ Error: {fetchError}
                  </div>
                )}
                
                <div className="orders-list">
                  {loadingOrders || loadingRoles ? (
                    <div className="loading-state">Loading orders...</div>
                ) : fetchError ? (
                    <div className="empty-state">
                      {fetchError.includes('Network error') ? 'Gagal terhubung ke server.' : 'Gagal memuat data.'}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="empty-state">No orders found</div>
                  ) : (
                      orders.map((order, index) => {
    const uniqueOrderId = `${order.sheetName}-${order.rowNumber}`;
    return (
    <div key={order.sheetName ? uniqueOrderId : index} className="order-item">
      {/* Header Kembali Normal */}
      <div className="order-header">
        <div className="order-info">
          <strong>Nama:</strong> {order.nama || 'N/A'}<br/>
          <strong>Divisi:</strong> {order.divisi || 'N/A'}
        </div>
        {/* Status Badge saja di sini */}
        <div
          className="status-badge"
          style={{ backgroundColor: getStatusColor(order.Status || order.status || 'Process') }}
        >
          {order.Status || order.status || 'Process'}
        </div>
      </div>
      
      <div className="order-details">
        <div className="detail-row">
          <strong>Tanggal:</strong> {formatDate(order.timestamp)}
        </div>
        <div className="detail-row">
          <strong>Barang:</strong> {order.namaBarang || 'N/A'}
        </div>
        <div className="detail-row">
          <strong>Jumlah:</strong> {order.jumlahBarang || 'N/A'}
        </div>
        <div className="detail-row">
          <strong>Harga Total:</strong> Rp {formatPrice(order['Harga Total'] || order.hargaTotal)}
        </div>
        {order.linkBarang && order.linkBarang !== '' && (
          <div className="detail-row">
            <strong>Link:</strong> 
            <a href={order.linkBarang} target="_blank" rel="noopener noreferrer" className="order-link">
              View Product
            </a>
          </div>
        )}
        {/* === TOMBOL APPROVE KEMBALI KE SINI === */}
        {isAdmin && (order.Status || order.status || 'Process').toLowerCase() === 'process' && (
            <button 
              onClick={() => handleApproveOrder(order)} 
              className="status-badge" // 1. Ubah className menjadi 'status-badge'
              style={{ // 2. Tambahkan inline style
                backgroundColor: updatingOrderId === uniqueOrderId ? '#6c757d' : '#28a745', // 3. Atur warna (hijau saat aktif, abu-abu saat loading)
                border: 'none', // 4. Hilangkan border default button
                cursor: updatingOrderId === uniqueOrderId ? 'not-allowed' : 'pointer' // 5. Atur kursor
              }}
              disabled={updatingOrderId === uniqueOrderId}
            >
              {updatingOrderId === uniqueOrderId ? 'Accepting...' : 'Accept'}
            </button>
          )}
      </div>                        
    </div>
    )
  })
                 )}
                </div>
                
                <div style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
                  Debug: Div: {isAdmin ? 'ADMIN' : (userDivision || 'N/A')} | Roles: {loadingRoles.toString()} | Orders: {orders.length} | Loading: {loadingOrders.toString()} | Error: {fetchError || 'None'}
                </div>
              </div>
             </div>

            {/* Form Request Barang */}
            {/* Form ini akan otomatis 'disabled' untuk Admin karena userDivision-nya kosong */}
            <div className="tracking-form-container">
              <div className="tracking-form">
                {/* ... (Tidak ada perubahan di form request barang) ... */}
                <h3>Request Barang Baru</h3>
                <p>Silakan isi detail di bawah ini.</p>
                
                {submissionStatus === 'success' && (
                  <div className="success-message">
                  ✅ Request berhasil dikirim!
                  </div>
                )}
                {submissionStatus === 'error' && (
                  <div className="error-message">
                  ❌ Gagal mengirim request. Coba lagi.
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
                      placeholder={initialFormData.nama} 
                      readOnly
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
                      placeholder="Pilih divisi..."
                      readOnly
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
                  S />
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
                  
                  <button 
                    type="submit" 
                    className="send-button" 
                    disabled={submissionStatus === 'submitting' || !userDivision}
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