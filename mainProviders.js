/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from './jsx.js';
import { useBillingStore } from './store/useBillingStore.js';

const ACC_KEY = 'sma-secure-account-v1';
const dec = text => { try { return decodeURIComponent(escape(atob(text || ''))); } catch { return ''; } };
const loadAcc = () => { try { return JSON.parse(localStorage.getItem(ACC_KEY) || '{}'); } catch { return {}; } };

const AuthContext = React.createContext({
  user: null,
  authLoading: true,
  authBusy: false,
  authError: '',
  authMessage: '',
  passcodeAuthorized: false,
  loginWithPasscode: () => false,
  signInGoogle: async () => {},
  sendEmailLink: async () => {},
  signOut: async () => {}
});
export const useAuth = () => React.useContext(AuthContext);

const FONT_KEY = 'sma-global-font-settings-v1';
const fontFamilies = ['Poppins','Inter','Roboto','Open Sans','Montserrat','Lato','Arial','Times New Roman','Noto Sans Tamil'];
const fontStackFor = family => `'${family}', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Tamil", Arial, sans-serif`;
const readSavedFont = () => {
  try { return JSON.parse(localStorage.getItem(FONT_KEY) || '{}'); } catch { return {}; }
};
const applyFontSettings = settings => {
  const family = fontFamilies.includes(settings.fontFamily) ? settings.fontFamily : 'Inter';
  const sizeMap = { Small: '14px', Medium: '16px', Large: '18px' };
  const weightMap = { Normal: '400', Medium: '500', Bold: '700' };
  const stack = fontStackFor(family);
  document.documentElement.style.setProperty('--app-font-family', stack);
  document.documentElement.style.setProperty('--app-font-size', sizeMap[settings.fontSize] || '16px');
  document.documentElement.style.setProperty('--app-font-weight', weightMap[settings.fontWeight] || '400');
  document.documentElement.style.fontFamily = stack;
  document.body.style.fontFamily = stack;
  document.body.style.fontSize = sizeMap[settings.fontSize] || '16px';
  document.body.style.fontWeight = weightMap[settings.fontWeight] || '400';
};

export function Providers({ children }) {
  const settings = useBillingStore(s => s.settings);
  const updateSettings = useBillingStore(s => s.updateSettings);
  const darkMode = settings.darkMode;
  const [user, setUser] = React.useState(null);
  const [passcodeAuthorized, setPasscodeAuthorized] = React.useState(() => {
    return localStorage.getItem('sma-passcode-authorized') === 'true';
  });
  const [authLoading, setAuthLoading] = React.useState(true);
  const [authBusy, setAuthBusy] = React.useState(false);
  const [authError, setAuthError] = React.useState('');
  const [authMessage, setAuthMessage] = React.useState('');
  const [registeredEmail, setRegisteredEmail] = React.useState(() => loadAcc().email || '');

  // Track Real-Time Auto Sync Option preference from localStorage
  const [autoSyncPref, setAutoSyncPref] = React.useState(() => {
    const val = localStorage.getItem('sma-auto-cloud-sync-enabled');
    return val === null ? true : val === 'true';
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', Boolean(darkMode));
  }, [darkMode]);

  React.useEffect(() => {
    const saved = readSavedFont();
    const merged = { fontFamily: settings.fontFamily, fontSize: settings.fontSize, fontWeight: settings.fontWeight, ...saved };
    applyFontSettings(merged);
    if (saved.fontFamily && (saved.fontFamily !== settings.fontFamily || saved.fontSize !== settings.fontSize || saved.fontWeight !== settings.fontWeight)) {
      updateSettings(saved);
    }
  }, []);

  React.useEffect(() => {
    applyFontSettings({ fontFamily: settings.fontFamily, fontSize: settings.fontSize, fontWeight: settings.fontWeight });
  }, [settings.fontFamily, settings.fontSize, settings.fontWeight]);

  React.useEffect(() => {
    let unsubscribe = () => {};
    const initAuth = async () => {
      try {
        if (!window.genmb?.auth) {
          setAuthMessage('Login service is not available in offline desktop mode. Enter secret passcode to access billing data saved on this PC.');
          setAuthLoading(false);
          return;
        }
        try {
          await window.genmb.auth.ready();
          const currentUser = window.genmb.auth.getUser();
          setUser(currentUser);
          unsubscribe = window.genmb.auth.onAuthStateChange(nextUser => {
            setUser(nextUser);
            if (nextUser) setAuthMessage(`Connected as ${nextUser.email || nextUser.name}.`);
          });
        } catch (authErr) {
          console.warn('Silent Auth Init Error (expected offline/auth expired):', authErr);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth Outer Error:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, []);

  // Sync registered email address & auto-sync preference dynamically
  React.useEffect(() => {
    const handleUpdate = () => {
      setRegisteredEmail(loadAcc().email || '');
      const val = localStorage.getItem('sma-auto-cloud-sync-enabled');
      setAutoSyncPref(val === null ? true : val === 'true');
    };
    window.addEventListener('sma-billing-live-update', handleUpdate);
    return () => window.removeEventListener('sma-billing-live-update', handleUpdate);
  }, []);

  const syncEmail = user?.email || registeredEmail;

  // Cloud Sync Effect - Handles automatic synchronization of all apps
  React.useEffect(() => {
    if (syncEmail && syncEmail.includes('@') && autoSyncPref) {
      const handleLiveUpdate = () => {
        const currentReg = loadAcc();
        const currentEmail = window.genmb?.auth?.getUser()?.email || currentReg.email;
        if (currentEmail && currentEmail.includes('@')) {
          const enabled = localStorage.getItem('sma-auto-cloud-sync-enabled') !== 'false';
          if (enabled) {
            import('./utils/cloudSync.js').then(({ triggerAutoSync }) => {
              triggerAutoSync(currentEmail);
            });
          }
        }
      };

      const handleOnline = () => {
        const currentReg = loadAcc();
        const currentEmail = window.genmb?.auth?.getUser()?.email || currentReg.email;
        if (currentEmail && currentEmail.includes('@')) {
          const enabled = localStorage.getItem('sma-auto-cloud-sync-enabled') !== 'false';
          if (enabled) {
            import('./utils/cloudSync.js').then(({ syncWorkspace }) => {
              syncWorkspace(currentEmail);
            });
          }
        }
      };

      // Initial sync on mount/login
      import('./utils/cloudSync.js').then(({ syncWorkspace }) => {
        console.log('[CloudSync] Syncing workspace on session mount for:', syncEmail);
        syncWorkspace(syncEmail);
      });

      // Background Polling Bidirectional Sync (every 10 seconds) - Issue 3
      // Ensures PC updates and mobile updates are bidirectional without duplicate values or data erase.
      const syncInterval = setInterval(() => {
        if (navigator.onLine) {
          const enabled = localStorage.getItem('sma-auto-cloud-sync-enabled') !== 'false';
          if (enabled) {
            import('./utils/cloudSync.js').then(({ syncWorkspace }) => {
              syncWorkspace(syncEmail).catch(err => console.warn('[CloudSync] Polling error:', err));
            });
          }
        }
      }, 10000);

      window.addEventListener('sma-billing-live-update', handleLiveUpdate);
      window.addEventListener('online', handleOnline);

      return () => {
        clearInterval(syncInterval);
        window.removeEventListener('sma-billing-live-update', handleLiveUpdate);
        window.removeEventListener('online', handleOnline);
      };
    }
  }, [user, passcodeAuthorized, syncEmail, autoSyncPref]);

  const loginWithPasscode = (code) => {
    const trimmed = (code || '').trim();
    if (!trimmed) {
      setAuthError('Please enter a secret passcode.');
      return false;
    }

    const acc = loadAcc();
    const registeredPassword = dec(acc.password);
    const registeredCode = dec(acc.code);

    let isValid = false;

    // Match registered details
    if (registeredPassword && trimmed === registeredPassword) {
      isValid = true;
    } else if (registeredCode && trimmed === registeredCode) {
      isValid = true;
    } else {
      // Fallback/Default passcodes
      const defaults = ['1234', 'SMA-2026', 'sma2026', 'admin'];
      if (defaults.includes(trimmed)) {
        isValid = true;
      }
    }

    if (isValid) {
      localStorage.setItem('sma-passcode-authorized', 'true');
      setPasscodeAuthorized(true);
      setAuthMessage('Passcode access authorized!');
      setAuthError('');
      return true;
    } else {
      setAuthError('Invalid secret passcode. Please try again.');
      return false;
    }
  };

  const signInGoogle = async () => {
    if (!window.genmb?.auth) return;
    if (!navigator.onLine) { setAuthError('Internet connection is required for cloud login. Offline billing still works.'); return; }
    setAuthBusy(true); setAuthError(''); setAuthMessage('');
    try {
      const signedIn = await window.genmb.auth.signIn();
      if (signedIn) { setUser(signedIn); setAuthMessage(`Welcome ${signedIn.name || signedIn.email}!`); }
      else setAuthMessage('Google login was cancelled.');
    } catch (err) {
      console.error('Google Sign In Error:', err);
      setAuthError(`Google login failed: ${err.message || err.code || 'Please try again.'}`);
    } finally { setAuthBusy(false); }
  };

  const sendEmailLink = async email => {
    if (!window.genmb?.auth) return;
    if (!navigator.onLine) { setAuthError('Internet connection is required to send email login links. Offline billing still works.'); return; }
    setAuthBusy(true); setAuthError(''); setAuthMessage('');
    try {
      if (!String(email || '').includes('@')) throw new Error('Enter a valid email address.');
      await window.genmb.auth.sendMagicLink(email);
      setAuthMessage('Check your email. Sign-in link has been sent.');
    } catch (err) {
      setAuthError(`Email login failed: ${err.message || err.code || 'Please try again.'}`);
    } finally { setAuthBusy(false); }
  };

  const signOut = async () => {
    localStorage.removeItem('sma-passcode-authorized');
    setPasscodeAuthorized(false);
    if (!window.genmb?.auth) {
      setUser(null);
      setAuthMessage('Logged out successfully.');
      return;
    }
    if (!navigator.onLine) { setAuthError('Internet connection is required for cloud logout.'); return; }
    setAuthBusy(true); setAuthError('');
    try { await window.genmb.auth.signOut(); setUser(null); setAuthMessage('Logged out successfully.'); }
    catch (err) { setAuthError(`Logout failed: ${err.message || err.code || 'Please try again.'}`); }
    finally { setAuthBusy(false); }
  };

  return html`<${AuthContext.Provider} value=${{ user, authLoading, authBusy, authError, authMessage, passcodeAuthorized, loginWithPasscode, signInGoogle, sendEmailLink, signOut }}>${children}</${AuthContext.Provider}>`;
}
