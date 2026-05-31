/* __imports_rewritten__ */
import ReactDOM from 'https://esm.sh/react-dom@19.2.0/client?deps=react@19.2.0';
import { html } from './jsx.js';
import { Providers } from './mainProviders.js';
import { App } from './App.js';

// ============================================================================
// Electron Web Share API Shim
// ============================================================================
if (window.desktopApp && window.desktopApp.isElectron) {
  if (!navigator.share) {
    navigator.share = async (shareData) => {
      if (shareData && shareData.files && shareData.files.length > 0) {
        const file = shareData.files[0];
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        const base64 = await base64Promise;
        const res = await window.desktopApp.shareFile({
          base64,
          fileName: file.name,
          title: shareData.title,
          text: shareData.text
        });
        if (!res.ok) {
          throw new Error(res.error || 'Failed to share file in Electron.');
        }
      } else {
        throw new Error('No files provided to share in Electron.');
      }
    };
  }
  if (!navigator.canShare) {
    navigator.canShare = (shareData) => {
      return !!(shareData && shareData.files && shareData.files.length > 0);
    };
  }
}

// ============================================================================
// LocalStorage-to-IndexedDB Transparent Sync Proxy (Real Offline persistence)
// ============================================================================
const setupIndexedDBSync = () => {
  const dbName = 'sma-billing-db';
  const storeName = 'localstorage-mirror';

  // Helper to open IndexedDB
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  };

  // Sync IndexedDB keys back to LocalStorage on startup
  const restoreFromIndexedDB = async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      const keysRequest = store.getAllKeys();
      keysRequest.onsuccess = () => {
        const keys = keysRequest.result;
        keys.forEach(key => {
          const getRequest = store.get(key);
          getRequest.onsuccess = () => {
            const val = getRequest.result;
            if (val !== null && val !== undefined && !localStorage.getItem(key)) {
              try {
                localStorage.setItem(key, val);
              } catch (err) {
                console.warn(`[Sync] Failed restoring key ${key} to localStorage:`, err);
              }
            }
          };
        });
      };
    } catch (err) {
      console.warn('[Sync] Failed to restore from IndexedDB:', err);
    }
  };

  // Save a single key-value to IndexedDB
  const saveToIndexedDB = async (key, val) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.put(val, key);
    } catch (err) {
      console.warn(`[Sync] Failed saving key ${key} to IndexedDB:`, err);
    }
  };

  // Remove a key from IndexedDB
  const removeFromIndexedDB = async (key) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.delete(key);
    } catch (err) {
      console.warn(`[Sync] Failed removing key ${key} from IndexedDB:`, err);
    }
  };

  // Run initial restore on startup
  restoreFromIndexedDB().then(() => {
    console.log('[Sync] IndexedDB restore completed.');
  });

  // Override setItem and removeItem to auto-replicate to IndexedDB
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments);
    saveToIndexedDB(key, value);
  };

  const originalRemoveItem = localStorage.removeItem;
  localStorage.removeItem = function (key) {
    originalRemoveItem.apply(this, arguments);
    removeFromIndexedDB(key);
  };
};

try {
  setupIndexedDBSync();
} catch (syncErr) {
  console.error('[Sync] Failed setup:', syncErr);
}
// ============================================================================

// Migrate existing settings.securityMode to 'private' by default
try {
  const STORE_KEY = 'shree-maheshwara-agencies-offline-v1';
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) {
    const data = JSON.parse(raw);
    if (data && data.state && data.state.settings) {
      if (!data.state.settings.securityMode || data.state.settings.securityMode === 'public') {
        data.state.settings.securityMode = 'private';
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
        console.log('[Migration] Migrated securityMode to private');
      }
    }
  }
} catch (e) {
  console.warn('[Migration] Error migrating securityMode:', e);
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${Providers}><${App} /></${Providers}>`);

const removeGenMBRemixPopup = () => {
  const selectors = ['a[href*="genmb"]', 'button[aria-label*="remix"]', 'a.genmb-remix', 'div.genmb-remix'];
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.remove();
    });
  });
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    const text = (child.textContent || '').toLowerCase();
    if (text.includes('remix on genmb')) {
      child.remove();
    }
  });
};

removeGenMBRemixPopup();
let cleanupTimer;
const observer = new MutationObserver((mutations) => {
  const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
  if (hasNewNodes) {
    clearTimeout(cleanupTimer);
    cleanupTimer = setTimeout(removeGenMBRemixPopup, 100);
  }
});
observer.observe(document.body, { childList: true });

const VERSION_KEY = 'sma-installed-app-version';
const fetchLatestVersion = async () => {
  if (!navigator.onLine) return '';
  try {
    const response = await fetch(`./app-version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Version check failed');
    const data = await response.json();
    return String(data.version || '').trim();
  } catch (err) {
    return '';
  }
};

const notifyUpdateAvailable = version => window.dispatchEvent(new CustomEvent('sma-update-available', { detail: { version } }));

const activateWaitingWorker = async registration => {
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else if (navigator.onLine) {
    try { await registration?.update?.(); } catch (e) {}
  }
};

const refreshAppCaches = async () => {
  try {
    const keys = await caches?.keys?.() || [];
    await Promise.all(keys.filter(key => key.includes('sma-')).map(key => caches.delete(key)));
    const regs = await navigator.serviceWorker?.getRegistrations?.() || [];
    await Promise.all(regs.map(r => r.unregister()));
  } catch (e) {}
};

const applyUpdateNow = async () => {
  try {
    window.__smaTriggeredUpdate = true;
    const registrations = await navigator.serviceWorker?.getRegistrations?.() || [];
    await Promise.all(registrations.map(reg => activateWaitingWorker(reg)));
    await refreshAppCaches();
    const pending = localStorage.getItem('sma-pending-app-version');
    if (pending) localStorage.setItem(VERSION_KEY, pending);
    window.location.href = window.location.href.split('?')[0] + '?update=' + Date.now() + window.location.hash;
  } catch (error) {
    window.location.reload();
  }
};

const checkAppVersion = async registration => {
  if (!navigator.onLine) return;
  try {
    const latest = await fetchLatestVersion();
    if (!latest) return;
    const current = localStorage.getItem(VERSION_KEY);
    
    if (current && current !== latest) {
      localStorage.setItem('sma-pending-app-version', latest);
      if (registration) {
        await registration.update().catch(() => {});
      }
      notifyUpdateAvailable(latest);
    } else if (!current) {
      localStorage.setItem(VERSION_KEY, latest);
    }
  } catch (error) {}
};

window.addEventListener('sma-refresh-update-now', async () => {
  await applyUpdateNow();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('update')) {
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }

    let hasLoggedCacheCreated = false;
    const logCacheCreatedOnce = () => {
      if (hasLoggedCacheCreated) return;
      caches.keys().then(keys => {
        if (keys.some(key => key.startsWith('sma-core-'))) {
          console.log('Cache Created');
          hasLoggedCacheCreated = true;
        }
      });
    };

    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then(registration => {
      console.log('SW Registered'); // Exact requested log

      logCacheCreatedOnce();

      // Set up periodic cache check to log "Cache Created" as soon as it's built
      let checkAttempts = 0;
      const checkIntervalId = setInterval(() => {
        logCacheCreatedOnce();
        checkAttempts++;
        if (checkAttempts > 15 || hasLoggedCacheCreated) {
          clearInterval(checkIntervalId);
        }
      }, 400);

      navigator.serviceWorker.ready.then((reg) => {
        logCacheCreatedOnce();
        console.log('Offline Ready'); // Exact requested log
        if (reg.active) {
          reg.active.postMessage({ type: 'START_CRAWL' });
        }
      });

      checkAppVersion(registration);
      const checkInterval = setInterval(() => checkAppVersion(registration), 1 * 60 * 1000);

      window.addEventListener('online', () => {
        checkAppVersion(registration);
      });

      if (registration.waiting) {
        notifyUpdateAvailable(localStorage.getItem('sma-pending-app-version') || 'latest');
      }

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            notifyUpdateAvailable(localStorage.getItem('sma-pending-app-version') || 'latest');
          }
        });
      });
    }).catch((err) => {
      console.error('[SW] Registration failed:', err);
    });

    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data?.type === 'APP_UPDATED' || event.data === 'APP_UPDATED') {
        notifyUpdateAvailable(localStorage.getItem('sma-pending-app-version') || 'latest');
      }
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (window.__smaTriggeredUpdate) {
        window.location.reload();
      }
    });
  });
}
