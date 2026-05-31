import { useBillingStore } from '../store/useBillingStore.js';

// Base API URL prefix for kvdb.io
const KVDB_BASE_URL = 'https://kvdb.io';

// Helper: SHA-256 hashing for secure unique user key
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Helpers: Safe Base64 encoding/decoding
export function enc(text) {
  return btoa(unescape(encodeURIComponent(text || '')));
}

export function dec(text) {
  try {
    return decodeURIComponent(escape(atob(text || '')));
  } catch (e) {
    return '';
  }
}

// Local helper to read JSON safe
const safeJson = key => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

// Memory cache for user buckets to prevent redundant requests
let userBucketsCache = {};

// Secure, CORS-compliant automatic bucket ID discovery and creation (Multi-device coordination)
export async function getUserBucketId(email) {
  if (!email || !email.includes('@')) return 'sma_billing_fallback_v1';
  const cleanEmail = email.trim().toLowerCase();
  if (userBucketsCache[cleanEmail]) return userBucketsCache[cleanEmail];

  const emailHash = await sha256(cleanEmail);
  const localStorageKey = `sma_cloud_sync_bucket_${emailHash}`;
  
  // Try local storage cache first for zero-latency offline-friendly loads
  const cachedLocal = localStorage.getItem(localStorageKey);
  if (cachedLocal && cachedLocal.length >= 10 && cachedLocal.length <= 25) {
    userBucketsCache[cleanEmail] = cachedLocal;
    return cachedLocal;
  }

  const discoveryUrl = `https://api.keyvalue.xyz/smabillingv1_${emailHash}/bucket_id`;

  try {
    // 1. Check if a bucket ID has already been registered on the discovery registry for this user
    const res = await fetch(discoveryUrl);
    if (res.ok) {
      const text = await res.text();
      const cleaned = text.trim();
      if (cleaned && cleaned.length >= 10 && cleaned.length <= 25) {
        localStorage.setItem(localStorageKey, cleaned);
        userBucketsCache[cleanEmail] = cleaned;
        return cleaned;
      }
    }
  } catch (err) {
    console.warn('[CloudSync] Discovery registry fetch failed, trying creation...', err);
  }

  try {
    // 2. No bucket found or service query failed; create a brand-new bucket dynamically on kvdb.io
    const res = await fetch(`${KVDB_BASE_URL}/`, { method: 'POST' });
    if (res.ok) {
      const bucketId = (await res.text()).trim();
      if (bucketId && bucketId.length >= 10) {
        // 3. Register the new bucket ID to the discovery registry so other devices of the same user can discover it
        await fetch(`https://api.keyvalue.xyz/smabillingv1_${emailHash}/bucket_id`, {
          method: 'POST',
          body: bucketId
        });
        localStorage.setItem(localStorageKey, bucketId);
        userBucketsCache[cleanEmail] = bucketId;
        return bucketId;
      }
    }
  } catch (err) {
    console.error('[CloudSync] Failed to register or create a new kvdb.io bucket:', err);
  }

  // Robust default fallback bucket ID
  return 'sma_billing_fallback_v1';
}

// Pack all workspace data
export function packLocalWorkspace() {
  const storeState = useBillingStore.getState();
  const data = {
    store: {
      customers: storeState.customers,
      items: storeState.items,
      invoices: storeState.invoices,
      settings: storeState.settings
    },
    estimates: safeJson('sma-estimates-v1'),
    expenses: safeJson('sma-expenses'),
    purchaseOrders: safeJson('sma-purchase-orders'),
    quickNotes: safeJson('sma-quick-notes'),
    fontSettings: safeJson('sma-global-font-settings-v1'),
    customTemplate: localStorage.getItem('sma-custom-invoice-template') || '',
    templateChoice: localStorage.getItem('sma-invoice-template-choice') || '',
    secureAccount: localStorage.getItem('sma-secure-account-v1') || '',
    lastUpdated: Number(localStorage.getItem('sma-last-updated-at') || Date.now())
  };
  return data;
}

// Unpack and overwrite local workspace safely
export function unpackAndRestoreWorkspace(cloudData) {
  if (!cloudData || !cloudData.store) return false;

  // 1. Overwrite Zustand store
  const storeState = useBillingStore.getState();
  storeState.importData(cloudData.store);

  // 2. Overwrite standalone keys
  if (Array.isArray(cloudData.estimates)) {
    localStorage.setItem('sma-estimates-v1', JSON.stringify(cloudData.estimates));
  }
  if (Array.isArray(cloudData.expenses)) {
    localStorage.setItem('sma-expenses', JSON.stringify(cloudData.expenses));
  }
  if (Array.isArray(cloudData.purchaseOrders)) {
    localStorage.setItem('sma-purchase-orders', JSON.stringify(cloudData.purchaseOrders));
  }
  if (Array.isArray(cloudData.quickNotes)) {
    localStorage.setItem('sma-quick-notes', JSON.stringify(cloudData.quickNotes));
  }
  if (cloudData.fontSettings && typeof cloudData.fontSettings === 'object' && !Array.isArray(cloudData.fontSettings)) {
    localStorage.setItem('sma-global-font-settings-v1', JSON.stringify(cloudData.fontSettings));
  }
  if (cloudData.customTemplate !== undefined) {
    if (cloudData.customTemplate) {
      localStorage.setItem('sma-custom-invoice-template', cloudData.customTemplate);
    } else {
      localStorage.removeItem('sma-custom-invoice-template');
    }
  }
  if (cloudData.templateChoice) {
    localStorage.setItem('sma-invoice-template-choice', cloudData.templateChoice);
  }
  if (cloudData.secureAccount) {
    localStorage.setItem('sma-secure-account-v1', typeof cloudData.secureAccount === 'object' ? JSON.stringify(cloudData.secureAccount) : String(cloudData.secureAccount));
  }

  // 3. Save timestamps and rehydrate
  localStorage.setItem('sma-last-updated-at', String(cloudData.lastUpdated || Date.now()));
  localStorage.setItem('sma-last-sync-time', String(Date.now()));
  localStorage.setItem('sma-last-sync-status', 'success');

  // Trigger live updates to refresh UI across active tabs/components
  useBillingStore.persist.rehydrate();
  window.dispatchEvent(new CustomEvent('sma-billing-live-refresh', { detail: { at: Date.now() } }));
  window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));

  return true;
}

// Perform Upload to Cloud using multi-layered persistence (Native DB -> GCS -> kvdb Fallback)
export async function uploadToCloud(email) {
  if (!email || !email.includes('@')) return false;
  if (!navigator.onLine) return false;

  try {
    const key = await sha256(email);
    const data = packLocalWorkspace();
    const now = Date.now();
    data.lastUpdated = now;
    localStorage.setItem('sma-last-updated-at', String(now));

    let uploadSuccess = false;

    // 1. Try GenMB DB (Native Cloud DB - CORS & sandbox proof)
    if (window.genmb?.db?.set) {
      try {
        await window.genmb.db.set(`sma_workspace_${key}`, JSON.stringify(data));
        uploadSuccess = true;
      } catch (e) {
        console.warn('[CloudSync] GenMB DB upload failed:', e);
      }
    }

    // 2. Try GCS upload (host JSON backup file securely)
    let gcsUrl = null;
    try {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const formData = new FormData();
      formData.append('file', blob, 'sma_backup.json');
      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        gcsUrl = json.url;
        if (gcsUrl && window.genmb?.db?.set) {
          await window.genmb.db.set(`sma_backup_url_${key}`, gcsUrl);
          uploadSuccess = true;
        }
      }
    } catch (e) {
      console.warn('[CloudSync] GCS upload failed:', e);
    }

    // 3. Fallback to kvdb.io (third-party CORS-dependent)
    try {
      const bucketId = await getUserBucketId(email);
      const payload = enc(JSON.stringify(data));
      const res = await fetch(`${KVDB_BASE_URL}/${bucketId}/${key}`, {
        method: 'POST',
        body: payload
      });
      if (res.ok) uploadSuccess = true;
    } catch (err) {
      console.warn('[CloudSync] kvdb upload fallback failed:', err);
    }

    if (uploadSuccess || gcsUrl) {
      localStorage.setItem('sma-last-sync-time', String(now));
      localStorage.setItem('sma-last-sync-status', 'success');
      window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: 'success' } }));
      return true;
    } else {
      throw new Error('All cloud storage layers failed to sync.');
    }
  } catch (err) {
    console.warn('[CloudSync] Upload failed:', err);
    localStorage.setItem('sma-last-sync-status', 'error');
    window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: 'error' } }));
    return false;
  }
}

// Perform Download from Cloud (Native DB -> GCS URL -> kvdb Fallback)
export async function downloadFromCloud(email) {
  if (!email || !email.includes('@')) return null;
  if (!navigator.onLine) return null;

  const key = await sha256(email);

  // 1. Try GenMB DB (Native Cloud DB)
  if (window.genmb?.db?.get) {
    try {
      const raw = await window.genmb.db.get(`sma_workspace_${key}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[CloudSync] GenMB DB download failed:', e);
    }
  }

  // 2. Try GCS URL fetch from GenMB DB
  if (window.genmb?.db?.get) {
    try {
      const gcsUrl = await window.genmb.db.get(`sma_backup_url_${key}`);
      if (gcsUrl) {
        const res = await fetch(gcsUrl);
        if (res.ok) {
          return await res.json();
        }
      }
    } catch (e) {
      console.warn('[CloudSync] GCS URL fetch failed:', e);
    }
  }

  // 3. Fallback to kvdb.io
  try {
    const bucketId = await getUserBucketId(email);
    const res = await fetch(`${KVDB_BASE_URL}/${bucketId}/${key}`);
    if (res.status === 200) {
      const payload = await res.text();
      if (payload) {
        const decrypted = dec(payload);
        if (decrypted) return JSON.parse(decrypted);
      }
    }
  } catch (err) {
    console.warn('[CloudSync] kvdb download fallback failed:', err);
  }

  return null;
}

// Real database-backed Security Account Sync (GenMB DB -> kvdb Fallback)
export async function saveSecurityAccountToCloud(email, accData) {
  if (!email || !email.includes('@')) return false;
  const hash = await sha256(email);
  
  let success = false;
  
  // 1. Try GenMB DB (Native Cloud DB)
  if (window.genmb?.db?.set) {
    try {
      await window.genmb.db.set(`sma_sec_${hash}`, JSON.stringify(accData));
      success = true;
    } catch (e) {
      console.warn('[CloudSync] GenMB DB save security account failed:', e);
    }
  }
  
  // 2. Fallback to kvdb.io
  if (navigator.onLine) {
    try {
      const bucketId = await getUserBucketId(email);
      const payload = enc(JSON.stringify(accData));
      const res = await fetch(`${KVDB_BASE_URL}/${bucketId}/sec_${hash}`, {
        method: 'POST',
        body: payload
      });
      if (res.ok) success = true;
    } catch (err) {
      console.warn('[CloudSync] kvdb save security account failed:', err);
    }
  }
  
  return success;
}

export async function fetchSecurityAccountFromCloud(email) {
  if (!email || !email.includes('@')) return null;
  const hash = await sha256(email);
  
  // 1. Try GenMB DB (Native Cloud DB)
  if (window.genmb?.db?.get) {
    try {
      const raw = await window.genmb.db.get(`sma_sec_${hash}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[CloudSync] GenMB DB fetch security account failed:', e);
    }
  }
  
  // 2. Fallback to kvdb.io
  if (navigator.onLine) {
    try {
      const bucketId = await getUserBucketId(email);
      const res = await fetch(`${KVDB_BASE_URL}/${bucketId}/sec_${hash}`);
      if (res.status === 200) {
        const payload = await res.text();
        if (payload) {
          const decrypted = dec(payload);
          if (decrypted) return JSON.parse(decrypted);
        }
      }
    } catch (err) {
      console.warn('[CloudSync] kvdb fetch security account failed:', err);
    }
  }
  return null;
}

// Merge functions for Bidirectional Sync
export function mergeCustomers(local = [], cloud = []) {
  const mergedMap = new Map();
  const getCustKey = c => String(c.id || c.name || '').trim().toLowerCase();
  
  cloud.forEach(c => {
    if (c) mergedMap.set(getCustKey(c), c);
  });
  
  local.forEach(c => {
    if (c) {
      const key = getCustKey(c);
      const existing = mergedMap.get(key);
      if (existing) {
        const localTime = Number(c.updatedAt || 0);
        const cloudTime = Number(existing.updatedAt || 0);
        if (localTime >= cloudTime) {
          mergedMap.set(key, { ...existing, ...c });
        }
      } else {
        mergedMap.set(key, c);
      }
    }
  });
  return Array.from(mergedMap.values());
}

export function mergeProducts(local = [], cloud = []) {
  const mergedMap = new Map();
  const getProdKey = p => {
    if (p.barcode && String(p.barcode).trim()) return `bc_${String(p.barcode).trim().toLowerCase()}`;
    return `nm_${String(p.name || p.id || '').trim().toLowerCase()}`;
  };

  cloud.forEach(p => {
    if (p) mergedMap.set(getProdKey(p), p);
  });

  local.forEach(p => {
    if (p) {
      const key = getProdKey(p);
      const existing = mergedMap.get(key);
      if (existing) {
        const localTime = Number(p.updatedAt || 0);
        const cloudTime = Number(existing.updatedAt || 0);
        if (localTime >= cloudTime) {
          mergedMap.set(key, { ...existing, ...p });
        }
      } else {
        mergedMap.set(key, p);
      }
    }
  });
  return Array.from(mergedMap.values());
}

export function mergeInvoices(local = [], cloud = []) {
  const mergedMap = new Map();
  const getInvKey = inv => String(inv.number || inv.id || '').trim().toLowerCase();

  cloud.forEach(inv => {
    if (inv) mergedMap.set(getInvKey(inv), inv);
  });

  local.forEach(inv => {
    if (inv) {
      const key = getInvKey(inv);
      const existing = mergedMap.get(key);
      if (existing) {
        const localTime = Number(inv.updatedAt || 0);
        const cloudTime = Number(existing.updatedAt || 0);
        if (localTime >= cloudTime) {
          mergedMap.set(key, { ...existing, ...inv });
        }
      } else {
        mergedMap.set(key, inv);
      }
    }
  });
  return Array.from(mergedMap.values());
}

export function mergeSimple(local = [], cloud = [], idKey = 'id') {
  const mergedMap = new Map();
  const getKey = item => String(item[idKey] || item.number || item.id || '').trim().toLowerCase();

  cloud.forEach(item => {
    if (item) mergedMap.set(getKey(item), item);
  });

  local.forEach(item => {
    if (item) {
      const key = getKey(item);
      const existing = mergedMap.get(key);
      if (existing) {
        const localTime = Number(item.updatedAt || 0);
        const cloudTime = Number(existing.updatedAt || 0);
        if (localTime >= cloudTime) {
          mergedMap.set(key, { ...existing, ...item });
        }
      } else {
        mergedMap.set(key, item);
      }
    }
  });
  return Array.from(mergedMap.values());
}

// Full Bidirectional Sync with Timestamp Conflict Resolution
export async function syncWorkspace(email, options = {}) {
  if (!email || !email.includes('@')) return { success: false, reason: 'Invalid email' };
  if (!navigator.onLine) {
    window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: 'offline' } }));
    return { success: false, reason: 'Offline' };
  }

  // Check if auto-sync is explicitly disabled in options or in global settings
  const enabled = localStorage.getItem('sma-auto-cloud-sync-enabled') !== 'false';
  if (!enabled && !options.forceUpload && !options.forceDownload) {
    return { success: false, reason: 'Auto-sync is disabled' };
  }

  window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: 'syncing' } }));
  const { forceUpload = false, forceDownload = false } = options;

  try {
    // 1. If force upload, skip download
    if (forceUpload) {
      const ok = await uploadToCloud(email);
      window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: ok ? 'success' : 'error' } }));
      return { success: ok, action: 'upload' };
    }

    // 2. Fetch cloud state
    const cloudData = await downloadFromCloud(email);

    // 3. If force download, restore immediately
    if (forceDownload && cloudData) {
      const ok = unpackAndRestoreWorkspace(cloudData);
      window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: ok ? 'success' : 'error' } }));
      return { success: ok, action: 'download' };
    }

    if (!cloudData) {
      // Cloud is empty, upload local data
      const ok = await uploadToCloud(email);
      window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: ok ? 'success' : 'error' } }));
      return { success: ok, action: 'upload' };
    }

    // 4. Resolve Conflict with Bidirectional Merge
    const localData = packLocalWorkspace();

    const mergedStore = {
      customers: mergeCustomers(localData.store?.customers || [], cloudData.store?.customers || []),
      items: mergeProducts(localData.store?.items || [], cloudData.store?.items || []),
      invoices: mergeInvoices(localData.store?.invoices || [], cloudData.store?.invoices || []),
      settings: { 
        ...(cloudData.store?.settings || {}), 
        ...(localData.store?.settings || {}) 
      }
    };

    const mergedEstimates = mergeSimple(localData.estimates || [], cloudData.estimates || [], 'id');
    const mergedExpenses = mergeSimple(localData.expenses || [], cloudData.expenses || [], 'id');
    const mergedPurchaseOrders = mergeSimple(localData.purchaseOrders || [], cloudData.purchaseOrders || [], 'id');
    const mergedQuickNotes = mergeSimple(localData.quickNotes || [], cloudData.quickNotes || [], 'id');

    const localUpdated = Number(localStorage.getItem('sma-last-updated-at') || '0');
    const cloudUpdated = Number(cloudData.lastUpdated || '0');

    // Optimization: If they are strictly in sync, avoid duplicate writes & network calls
    if (localUpdated === cloudUpdated && localUpdated > 0) {
      localStorage.setItem('sma-last-sync-status', 'success');
      window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: 'success' } }));
      return { success: true, action: 'none' };
    }

    const mergedFontSettings = (localUpdated >= cloudUpdated) 
      ? (localData.fontSettings || cloudData.fontSettings) 
      : (cloudData.fontSettings || localData.fontSettings);

    const mergedCustomTemplate = (localUpdated >= cloudUpdated)
      ? (localData.customTemplate || cloudData.customTemplate)
      : (cloudData.customTemplate || localData.customTemplate);

    const mergedTemplateChoice = (localUpdated >= cloudUpdated)
      ? (localData.templateChoice || cloudData.templateChoice)
      : (cloudData.templateChoice || localData.templateChoice);

    const mergedSecureAccount = (localUpdated >= cloudUpdated)
      ? (localData.secureAccount || cloudData.secureAccount)
      : (cloudData.secureAccount || localData.secureAccount);

    const mergedLastUpdated = Math.max(localUpdated, cloudUpdated, Date.now());

    const mergedData = {
      store: mergedStore,
      estimates: mergedEstimates,
      expenses: mergedExpenses,
      purchaseOrders: mergedPurchaseOrders,
      quickNotes: mergedQuickNotes,
      fontSettings: mergedFontSettings,
      customTemplate: mergedCustomTemplate,
      templateChoice: mergedTemplateChoice,
      secureAccount: mergedSecureAccount,
      lastUpdated: mergedLastUpdated
    };

    // 5. Unpack merged data locally
    const restoreOk = unpackAndRestoreWorkspace(mergedData);

    // 6. If local was newer, save merged set to cloud
    if (localUpdated > cloudUpdated) {
      const uploadOk = await uploadToCloud(email);
      window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: (uploadOk && restoreOk) ? 'success' : 'error' } }));
      return { success: uploadOk && restoreOk, action: 'merge-upload' };
    } else {
      window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: restoreOk ? 'success' : 'error' } }));
      return { success: restoreOk, action: 'merge-download' };
    }
  } catch (err) {
    console.warn('[CloudSync] Sync cycle error:', err);
    localStorage.setItem('sma-last-sync-status', 'error');
    window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: 'error' } }));
    return { success: false, reason: err.message };
  }
}

// Global debounced auto-sync scheduler
let autoSyncTimeout = null;
export function triggerAutoSync(email) {
  // Set local last-updated timestamp immediately on any local modification (even when offline)
  localStorage.setItem('sma-last-updated-at', String(Date.now()));

  const enabled = localStorage.getItem('sma-auto-cloud-sync-enabled') !== 'false';
  if (!enabled) return;

  if (!email || !email.includes('@')) return;
  if (!navigator.onLine) return;

  if (autoSyncTimeout) clearTimeout(autoSyncTimeout);

  autoSyncTimeout = setTimeout(async () => {
    console.log('[CloudSync] Auto-Syncing changes to cloud...');
    window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: 'syncing' } }));
    
    const result = await syncWorkspace(email);
    
    window.dispatchEvent(new CustomEvent('sma-cloud-sync-status', { detail: { state: result.success ? 'success' : 'error' } }));
  }, 2500); // 2.5s debounce to collect continuous modifications
}
