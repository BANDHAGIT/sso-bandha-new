import React, { createContext, useContext, useState, useEffect } from 'react';
import userManager from '../services/authService';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load user on mount
    const loadUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentUser = await userManager.getUser();
        console.info('[AuthContext] Current user:', currentUser);
        
        if (currentUser && !currentUser.expired) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('[AuthContext] Error loading user:', err);
        // Jangan set error jika hanya userinfo yang bermasalah
        if (!err?.message?.includes('userinfo') && !err?.message?.includes('Content-Type')) {
          setError(err.message);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Event listeners untuk user changes
    const handleUserLoaded = (loadedUser) => {
      console.info('[AuthContext] User loaded event:', loadedUser);
      setUser(loadedUser);
      setError(null);
    };

    const handleUserUnloaded = () => {
      console.info('[AuthContext] User unloaded event');
      setUser(null);
    };

    const handleUserSignedOut = () => {
      console.info('[AuthContext] User signed out event');
      setUser(null);
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    };

    const handleSilentRenewError = (err) => {
      console.warn('[AuthContext] Silent renew error:', err);
      // Tidak set error atau redirect untuk silent renew error
    };

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addUserSignedOut(handleUserSignedOut);
    userManager.events.addSilentRenewError(handleSilentRenewError);

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeUserSignedOut(handleUserSignedOut);
      userManager.events.removeSilentRenewError(handleSilentRenewError);
    };
  }, []);

  const login = async () => {
    try {
      setError(null);
      await userManager.signinRedirect();
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      setError(err.message);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await userManager.signoutRedirect();
    } catch (err) {
      console.error('[AuthContext] Logout error:', err);
      // Fallback logout
      await userManager.removeUser();
      window.location.href = '/';
    }
  };

  const value = {
    user,
    isAuthenticated: !!user && !user.expired,
    isLoading,
    error,
    login,
    logout,
    updateUser: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
