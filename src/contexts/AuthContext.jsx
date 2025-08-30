// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useMemo } from 'react';
import { AuthProvider as OidcProvider, useAuth as useOidc } from 'oidc-react';
import userManager from '../services/authService';

const Ctx = createContext(null);

function Adapter({ children }) {
  const oidc = useOidc();
  
  const value = useMemo(() => {
    const user = oidc.userData || null;
    const isAuthenticated = !!user && !user.expired;

    // --- PERUBAHAN DI SINI ---
    // Buat fungsi logout kustom
    const handleLogout = async () => {
      try {
        // Langkah 1: Hapus data user dari penyimpanan browser (penting!)
        // Ini akan membersihkan sessionStorage/localStorage
        await oidc.userManager.removeUser();

        // Langkah 2: Arahkan secara manual ke halaman logout Keycloak
        // Pengguna akan tetap di halaman ini dan tidak kembali otomatis.
        window.location.href = 'https://auth.bandhayudha.icu/realms/SSO-Bandha/protocol/openid-connect/logout';

      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    return {
      user,
      isAuthenticated,
      isLoading: oidc.isLoading,
      error: oidc.error || null,
      login: () => oidc.signIn(),
      // Gunakan fungsi logout kustom Anda
      logout: handleLogout,
      updateUser: () => {},
    };
  }, [oidc]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ... sisa file Anda tidak perlu diubah ...
export function useAuth() {
  return useContext(Ctx);
}

export function AppAuthProvider({ children }) { 
  const onSigninCallback = () => {
    sessionStorage.setItem('oidc_cb_done', '1');
    if (window.location.pathname.startsWith('/auth-callback')) {
      window.history.replaceState({}, document.title, '/dashboard');
    }
  };

  return (
    <OidcProvider
      userManager={userManager}
      onSigninCallback={onSigninCallback}
      autoSignIn={false}
    >
      <Adapter>{children}</Adapter>
    </OidcProvider>
  );
}