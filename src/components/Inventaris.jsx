import React, { useState, useEffect, useCallback, useMemo } from 'react';

const INVENTORY_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxeD2W1AEmt1RJKXMTSeevZgOoo0_h_pqXokVQjSAyM1JdLIxPoUqpHyUvA2s4vaZMk/exec";

const Inventaris = ({ onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    nama: '',
    lokasi: '',
    jumlah: '',
    status: 'ada'
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${INVENTORY_SCRIPT_URL}?action=getItems&t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.status === 'success') {
        setItems(data.items);
      } else {
        throw new Error(data.message || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      return items;
    }
    
    return items.filter(item => {
      const namaMatch = item.nama ? item.nama.toLowerCase().includes(query) : false;
      const lokasiMatch = item.lokasi ? item.lokasi.toLowerCase().includes(query) : false;
      return namaMatch || lokasiMatch;
    });
    }, [items, searchQuery]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const dataToSubmit = new FormData();
    dataToSubmit.append('action', 'addItem');
    dataToSubmit.append('nama', formData.nama);
    dataToSubmit.append('lokasi', formData.lokasi);
    dataToSubmit.append('jumlah', formData.jumlah);
    dataToSubmit.append('status', formData.status);

    try {
      const response = await fetch(INVENTORY_SCRIPT_URL, {
        method: 'POST',
        body: dataToSubmit,
      });
      const data = await response.json();

      if (data.status === 'success') {
        setFormData({ nama: '', lokasi: '', jumlah: '', status: 'ada' });
        fetchItems(); 
      } else {
        throw new Error(data.message || 'Failed to add item');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (rowNumber, currentStatus) => {
    const newStatus = currentStatus === 'ada' ? 'dipinjam' : 'ada';
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.rowNumber === rowNumber ? { ...item, status: newStatus } : item
      )
    );

    const dataToSubmit = new FormData();
    dataToSubmit.append('action', 'updateStatus');
    dataToSubmit.append('rowNumber', rowNumber);
    dataToSubmit.append('newStatus', newStatus);

    try {
      const response = await fetch(INVENTORY_SCRIPT_URL, {
        method: 'POST',
        body: dataToSubmit,
      });
      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
      setItems(prevItems => 
        prevItems.map(item => 
          item.rowNumber === rowNumber ? { ...item, status: currentStatus } : item
        )
      );
    }
  };
  
  const formStyle = { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '10px', 
    marginBottom: '20px' 
  };
  const inputStyle = { 
    flex: '1 1 120px', 
    padding: '8px', 
    borderRadius: '4px', 
    border: '1px solid #ccc' 
  };
  const tableStyle = {minWidth: '700px', width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' };
  const thStyle = { background: '#f4f4f4', padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '10px', border: '1px solid #ddd', textAlign: 'left', whiteSpace: 'nowrap' };
  const buttonStyle = { 
    padding: '5px 10px', 
    cursor: 'pointer', 
    border: 'none', 
    borderRadius: '4px', 
    backgroundColor: '#007bff', 
    color: 'white' 
  };


  return (
    // Kita gunakan className yang sama dengan modal lain agar styling-nya konsisten
    <div className="news-tutorial-overlay" style={{ overflowX: 'auto', overflowY: 'auto' }} onClick={onClose}>
      {/* Buat modal lebih lebar agar tabel muat */}
      <div className="news-tutorial-modal" style={{ maxWidth: '90vw', maxHeight: '80vh', margin: '5vh auto  ', top: '5vh', width: 'auto', overflowX: 'auto', boxSizing: 'border-box' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Inventaris Barang</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          
          {/* --- FORM TAMBAH ITEM --- */}
          <h4>Tambah Item Baru</h4>
          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              type="text"
              name="nama"
              placeholder="Nama Barang (cth: bldc)"
              value={formData.nama}
              onChange={handleFormChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="lokasi"
              placeholder="Lokasi (cth: meja program)"
              value={formData.lokasi}
              onChange={handleFormChange}
              required
              style={inputStyle}
            />
            <input
              type="number"
              name="jumlah"
              placeholder="Jumlah"
              value={formData.jumlah}
              onChange={handleFormChange}
              required
              style={{...inputStyle, flexBasis: '60px'}}
            />
            <select name="status" value={formData.status} onChange={handleFormChange} style={inputStyle}>
              <option value="ada">Ada</option>
              <option value="dipinjam">Dipinjam</option>
              <option value="habis">Habis</option>
            </select>
            <button 
              type="submit" 
              disabled={submitting} 
              style={{...inputStyle, cursor: 'pointer', background: '#007bff', color: 'white', fontWeight: 'bold'}}
            >
              {submitting ? 'Menyimpan...' : 'Tambah'}
            </button>
          </form>

          {/* --- DAFTAR ITEM --- */}
          <h4 style={{marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px'}}>Daftar Item</h4>
          
          {/* --- 3. INPUT SEARCH BARU & REFRESH --- */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
            <button 
              onClick={fetchItems} 
              disabled={loading} 
              style={{...buttonStyle, background: '#6c757d', flexShrink: 0, padding: '8px 12px'}}
            >
              {loading ? 'Memuat...' : 'Refresh'}
            </button>
            <input
              type="text"
              placeholder="Cari nama barang atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{...inputStyle, width: '100%', flex: 1}}
            />
          </div>
          
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          
          <div style={{ width: '100%', maxHeight: '400vx', overflowY: 'auto', overflowX: 'auto', marginTop: '10px' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={thStyle}>No</th>
                  <th style={thStyle}>Nama</th>
                  <th style={thStyle}>Lokasi</th>
                  <th style={thStyle}>Jumlah</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ ...tdStyle, textAlign: 'center' }}>Loading items...</td></tr>
                
                // --- 5. MENGGUNAKAN filteredItems & PESAN ERROR BARU ---
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ ...tdStyle, textAlign: 'center' }}>
                      {searchQuery ? 'Barang tidak ditemukan.' : 'Tidak ada data.'}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => ( // <-- DIGANTI DARI items.map
                    <tr key={item.rowNumber}>
                      <td style={tdStyle}>{item.no}</td>
                      <td style={tdStyle}>{...item.nama ? item.nama : 'N/A'}</td>
                      <td style={tdStyle}>{...item.lokasi ? item.lokasi : 'N/A'}</td>
                      <td style={tdStyle}>{item.jumlah}</td>
                      <td style={tdStyle}>{item.status}</td>
                      <td style={tdStyle}>
                        <button 
                          onClick={() => handleStatusUpdate(item.rowNumber, item.status)}
                          style={buttonStyle}
                        >
                          Ubah ke: {item.status === 'ada' ? 'Dipinjam' : 'Ada'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Inventaris;