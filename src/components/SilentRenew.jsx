import React, { useEffect } from 'react';
import userManager from '../services/authService';

// This page runs inside a hidden iframe for silent token renewal
const SilentRenew = () => {
  useEffect(() => {
    userManager.signinSilentCallback().catch((e) => {
      console.error('[OIDC] silent renew callback error:', e);
    });
  }, []);

  return <div>OK</div>;
};

export default SilentRenew;
