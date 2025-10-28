import { UserManager, WebStorageStateStore, Log } from 'oidc-client-ts';

// Realm: SSO-Bandha (issuer HTTPS)
const AUTHORITY = 'https://auth.bandhayudha.icu/realms/SSO-Bandha';
const CLIENT_ID = 'sso'; // SPA = public client (tanpa secret)

const realmBase = AUTHORITY.replace(/\/+$/, '');
const endpoints = `${realmBase}/protocol/openid-connect`;

// Seed metadata (HTTPS)
const metadata = {
  issuer: realmBase,
  authorization_endpoint: `${endpoints}/auth`,
  token_endpoint: `${endpoints}/token`,
  userinfo_endpoint: `${endpoints}/userinfo`,
  end_session_endpoint: `${endpoints}/logout`,
  jwks_uri: `${endpoints}/certs`,
  check_session_iframe: `${endpoints}/login-status-iframe.html`,
};

const settings = {
  authority: realmBase,
  client_id: CLIENT_ID,
  redirect_uri: `${window.location.origin}/auth-callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  silent_redirect_uri: `${window.location.origin}/silent-renew`,
  response_type: 'code',              // Authorization Code + PKCE
  scope: 'openid profile email',
  loadUserInfo: false,
  filterProtocolClaims: true,
  automaticSilentRenew: true,
  monitorSession: false,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  metadata,
};



Log.setLogger(console);
Log.setLevel(Log.INFO);

const userManager = new UserManager(settings);

// logs
userManager.events.addUserLoaded((u) => {
  console.info('[OIDC] user loaded:', u?.profile?.preferred_username || u?.profile?.sub);
});
userManager.events.addSilentRenewError((e) => console.warn('[OIDC] silent renew error:', e));
userManager.events.addAccessTokenExpiring(() => console.info('[OIDC] access token expiring'));
userManager.events.addAccessTokenExpired(() => console.info('[OIDC] access token expired'));
userManager.events.addUserSignedOut(() => console.info('[OIDC] user signed out'));

export default userManager;