import { UserManager, WebStorageStateStore, Log } from 'oidc-client-ts';

// Realm: SSO-Bandha (issuer HTTPS)
const AUTHORITY = 'https://auth.bandhayudha.icu/realms/SSO-Bandha';
const CLIENT_ID = 'sso'; // SPA = public client (tanpa secret)

const realmBase = AUTHORITY.replace(/\/+$/, '');
const endpoints = `${realmBase}/protocol/openid-connect`;

// Seed metadata (HTTPS) - hapus userinfo_endpoint untuk menghindari error
const metadata = {
  issuer: realmBase,
  authorization_endpoint: `${endpoints}/auth`,
  token_endpoint: `${endpoints}/token`,
  end_session_endpoint: `${endpoints}/logout`,
  jwks_uri: `${endpoints}/certs`,
  check_session_iframe: `${endpoints}/login-status-iframe.html`,
  // userinfo_endpoint dihapus untuk menghindari Content-Type error
};

const settings = {
  authority: realmBase,
  client_id: CLIENT_ID,
  redirect_uri: `${window.location.origin}/auth-callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  silent_redirect_uri: `${window.location.origin}/silent-renew`,
  response_type: 'code',
  scope: 'openid profile email',
  loadUserInfo: false,               // Tetap false
  filterProtocolClaims: false,       
  automaticSilentRenew: false,       
  monitorSession: false,             
  checkSessionInterval: 2000,        
  includeIdTokenInSilentRenew: false, // Ubah ke false untuk menghindari userinfo call
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  metadata,
  // Tambahan untuk menghindari userinfo calls
  fetchRequestCredentials: 'omit',
  silentRequestTimeout: 10000,
};

Log.setLogger(console);
Log.setLevel(Log.INFO);

const userManager = new UserManager(settings);

// Event handlers dengan error handling yang lebih baik
userManager.events.addUserLoaded((u) => {
  console.info('[OIDC] user loaded:', u?.profile?.preferred_username || u?.profile?.sub);
});

userManager.events.addSilentRenewError((e) => {
  console.warn('[OIDC] silent renew error:', e);
  // Jangan redirect otomatis, biarkan aplikasi handle
});

userManager.events.addUserSignedOut(() => {
  console.info('[OIDC] user signed out');
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
});

userManager.events.addUserUnloaded(() => {
  console.info('[OIDC] user unloaded');
  // Jangan redirect otomatis dari sini
});

userManager.events.addUserLoadFailed((error) => {
  console.error('[OIDC] user load failed:', error);
  // Jangan redirect otomatis, biarkan aplikasi handle
});

// Tambahan event untuk menangani berbagai error
userManager.events.addAccessTokenExpiring(() => {
  console.info('[OIDC] access token expiring');
});

userManager.events.addAccessTokenExpired(() => {
  console.info('[OIDC] access token expired');
});

export default userManager;
