import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import './styles/index.css';
import { AuthProvider } from './contexts/AuthContext';

// AuthProvider diletakkan PALING LUAR agar provider tidak re-mount
// saat berpindah route (mis. dari /auth-callback ke /dashboard)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
