/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from '../jsx.js';
import {Upload, Image as ImageIcon, X, Mail, ShieldCheck, FileText, Lock, Globe, Cloud, RefreshCw, Loader2, CheckCircle2, AlertCircle, HardDrive} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { useAuth } from '../mainProviders.js';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';
import JSZip from 'https://esm.sh/jszip@3.10.1';
import { saveSecurityAccountToCloud, mergeCustomers, mergeProducts, mergeInvoices, mergeSimple } from '../utils/cloudSync.js';

const ACC_KEY = 'sma-secure-account-v1';
const FONT_KEY = 'sma-global-font-settings-v1';

const enc = text => {
  try {
    return btoa(unescape(encodeURIComponent(text || '')));
  } catch {
    return text || '';
  }
};

const dec = text => {
  try {
    return decodeURIComponent(escape(atob(text || '')));
  } catch (e) {
    return '';
  }
};

const loadAcc = () => { try { return JSON.parse(localStorage.getItem(ACC_KEY) || '{}'); } catch { return {}; } };
const safeJson = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };

export function Settings() {
  const settings = useBillingStore(s => s.settings);
  const updateSettings = useBillingStore(s => s.updateSettings);
  const importData = useBillingStore(s => s.importData);
  const { user, authBusy, authError, authMessage, sendEmailLink } = useAuth();
  
  // Tab-based navigation inside Settings
  const [activeTab, setActiveTab] = React.useState('business'); // 'business' | 'security' | 'data'

  const [loginEmail, setLoginEmail] = React.useState('');
  const [acc, setAcc] = React.useState(loadAcc);
  const [sec, setSec] = React.useState(() => {
    const loaded = loadAcc();
    return {
      email: loaded.email || '',
      password: dec(loaded.password) || '',
      mobile: dec(loaded.mobile) || '',
      code: dec(loaded.code) || '',
      verifyMobile: '',
      newPassword: '',
      newEmail: '',
      newMobile: '',
      verifyCode: ''
    };
  });
  const [secMsg, setSecMsg] = React.useState({ type: '', text: '' });
  const [fontDraft, setFontDraft] = React.useState({ fontFamily: settings.fontFamily || 'Inter', fontSize: settings.fontSize || 'Medium', fontWeight: settings.fontWeight || 'Normal' });
  const [fontMsg, setFontMsg] = React.useState({ type: '', text: '' });
  const [customTemplate, setCustomTemplate] = React.useState(() => localStorage.getItem('sma-custom-invoice-template') || '');
  
  /* Verification OTP flow states */
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState('');
  const [userOtp, setUserOtp] = React.useState('');
  const [pendingAcc, setPendingAcc] = React.useState(null);

  /* Cloud Sync State */
  const [syncLoading, setSyncLoading] = React.useState(false);
  const [syncMsg, setSyncMsg] = React.useState({ type: '', text: '' });
  const [lastSyncAt, setLastSyncAt] = React.useState(() => localStorage.getItem('sma-last-sync-time'));
  const [lastSyncStatus, setLastSyncStatus] = React.useState(() => localStorage.getItem('sma-last-sync-status') || 'idle');
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  /* Auto Sync Preference State */
  const [autoSyncEnabled, setAutoSyncEnabled] = React.useState(() => {
    const val = localStorage.getItem('sma-auto-cloud-sync-enabled');
    return val === null ? true : val === 'true'; // default to true
  });

  /* Smart Importer State */
  const [importLoading, setImportLoading] = React.useState(false);
  const [importSummary, setImportSummary] = React.useState(null);
  const [importError, setImportError] = React.useState('');
  const fileInputRef = React.useRef(null);

  const fields = ['businessName', 'tagline', 'phone', 'email', 'address', 'gstin', 'invoicePrefix', 'currency'];
  const fontFamilies = ['Poppins', 'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Arial', 'Times New Roman', 'Noto Sans Tamil'];
  const fontSizes = ['Small', 'Medium', 'Large'];
  const fontWeights = ['Normal', 'Medium', 'Bold'];

  React.useEffect(() => { setFontDraft({ fontFamily: settings.fontFamily || 'Inter', fontSize: settings.fontSize || 'Medium', fontWeight: settings.fontWeight || 'Normal' }); }, [settings.fontFamily, settings.fontSize, settings.fontWeight]);
  
  React.useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  React.useEffect(() => {
    if (acc && acc.email) {
      setSec(s => ({
        ...s,
        email: acc.email || '',
        password: dec(acc.password) || '',
        mobile: dec(acc.mobile) || '',
        code: dec(acc.code) || ''
      }));
    }
  }, [acc]);

  React.useEffect(() => {
    const handleSyncStatus = (e) => {
      setLastSyncStatus(e.detail?.state || 'idle');
      setLastSyncAt(localStorage.getItem('sma-last-sync-time'));
    };
    window.addEventListener('sma-cloud-sync-status', handleSyncStatus);
    return () => window.removeEventListener('sma-cloud-sync-status', handleSyncStatus);
  }, []);

  // Sync account credentials from live update / cloud sync restore
  React.useEffect(() => {
    const handleUpdate = () => {
      setAcc(loadAcc());
    };
    window.addEventListener('sma-billing-live-update', handleUpdate);
    return () => window.removeEventListener('sma-billing-live-update', handleUpdate);
  }, []);

  const applyFontNow = next => {
    const sizeMap = { Small: '14px', Medium: '16px', Large: '18px' };
    const weightMap = { Normal: '400', Medium: '500', Bold: '700' };
    const stack = `'${next.fontFamily}', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Tamil", Arial, sans-serif`;
    document.documentElement.style.setProperty('--app-font-family', stack);
    document.documentElement.style.setProperty('--app-font-size', sizeMap[next.fontSize] || '16px');
    document.documentElement.style.setProperty('--app-font-weight', weightMap[next.fontWeight] || '400');
    document.documentElement.style.fontFamily = stack;
    document.body.style.fontFamily = stack;
    document.body.style.fontSize = sizeMap[next.fontSize] || '16px';
    document.body.style.fontWeight = weightMap[next.fontWeight] || '400';
  };
  
  const saveFont = () => { try { const next = { fontFamily: fontDraft.fontFamily || 'Inter', fontSize: fontDraft.fontSize || 'Medium', fontWeight: fontDraft.fontWeight || 'Normal' }; localStorage.setItem(FONT_KEY, JSON.stringify(next)); updateSettings(next); applyFontNow(next); setFontMsg({ type: '', text: '' }); } catch (err) { setFontMsg({ type: 'error', text: 'Font save failed. Please try again.' }); } };
  const saveAcc = next => { localStorage.setItem(ACC_KEY, JSON.stringify(next)); setAcc(next); };
  
  // Real verification flow (Issue 2)
  const register = async () => { 
    try { 
      setSecMsg({ type: '', text: '' });
      if (!sec.email || !sec.email.includes('@') || sec.password.length < 6 || sec.mobile.length < 6 || !sec.code.trim()) {
        throw new Error('Email, 6+ character password, 6+ digit mobile number, and secret security code are mandatory.'); 
      }
      if (!navigator.onLine) {
        throw new Error('You are currently offline. Internet connection is required to register and verify account security.');
      }

      // Generate a secure 6-digit OTP code
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const tempAcc = { 
        email: sec.email, 
        password: enc(sec.password), 
        mobile: enc(sec.mobile), 
        code: enc(sec.code), 
        protectionDisabled: false,
        verified: false,
        updated: new Date().toISOString() 
      }; 

      setPendingAcc(tempAcc);
      setOtpSent(otp);

      // Send actual transactional verification email
      if (window.genmb?.email) {
        await window.genmb.email.send({
          to: sec.email,
          subject: 'Verify Your SMA Billing Secure Account',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <h2 style="color: #0d9488; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">SMA Billing Secure Account Verification</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">To activate security and enable recovery options for <strong>SHREE MAHESHWARA AGENCIES</strong> billing software, please enter this verification code in Settings.</p>
              
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; border: 1px solid #2dd4bf;">
                <p style="margin: 0; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Verification Code</p>
                <p style="margin: 8px 0 0 0; font-size: 32px; font-weight: 900; color: #0d9488; font-family: monospace; letter-spacing: 0.15em;">${otp}</p>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;">This code is valid for 10 minutes. If you did not make this request, please disregard this email.</p>
            </div>
          `
        });
        setIsVerifying(true);
        setSecMsg({ type: 'info', text: 'Verification code sent! Please check your email inbox (including spam/promotions) and enter the 6-digit OTP code below to enable recovery.' });
      } else {
        throw new Error('Email service is currently unavailable. Please check your internet connection.');
      }
    } catch (err) { 
      setSecMsg({ type: 'error', text: err.message }); 
    } 
  };

  const handleVerifyOtp = async () => {
    setSecMsg({ type: '', text: '' });
    try {
      if (userOtp.trim() !== otpSent) {
        throw new Error('Invalid verification code. Please check the code sent to your email.');
      }

      const verifiedAcc = {
        ...pendingAcc,
        verified: true,
        recoveryEnabled: true,
        verifiedAt: new Date().toISOString()
      };

      // 1. Always save locally FIRST to guarantee credentials persist on this PC
      saveAcc(verifiedAcc);

      // 2. Attempt to save to cloud database in background
      let cloudSuccess = false;
      try {
        cloudSuccess = await saveSecurityAccountToCloud(verifiedAcc.email, verifiedAcc);
      } catch (cloudErr) {
        console.warn('[CloudSync] Background security sync failed:', cloudErr);
      }

      setIsVerifying(false);
      setOtpSent('');
      setUserOtp('');
      setPendingAcc(null);

      window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
      
      // Mirror workspace immediately
      if (navigator.onLine) {
        try {
          const { syncWorkspace } = await import('../utils/cloudSync.js');
          await syncWorkspace(verifiedAcc.email);
        } catch (e) {}
      }

      if (cloudSuccess) {
        setSecMsg({ type: 'success', text: 'Email verified successfully! Account security registered, recovery enabled, and safely backed up to the cloud database.' });
      } else {
        setSecMsg({ type: 'info', text: 'Account registered and saved locally on this PC! (Cloud recovery backup is pending connection/sync, but your local login is secure).' });
      }
    } catch (err) {
      setSecMsg({ type: 'error', text: err.message });
    }
  };

  const checkMobile = () => dec(acc.mobile) && sec.verifyMobile === dec(acc.mobile);
  const checkCode = () => dec(acc.code) && sec.verifyCode === dec(acc.code);
  
  const updatePassword = async () => { 
    if (!checkMobile()) return setSecMsg({ type: 'error', text: 'Registered mobile number verification failed.' }); 
    if (sec.newPassword.length < 6) return setSecMsg({ type: 'error', text: 'New password must be 6+ characters.' }); 
    const updated = { ...acc, password: enc(sec.newPassword), updated: new Date().toISOString() };
    saveAcc(updated); 
    let cloudSuccess = false;
    try {
      cloudSuccess = await saveSecurityAccountToCloud(acc.email, updated);
    } catch (err) {
      console.warn('[CloudSync] Background security password sync failed:', err);
    }
    window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
    if (cloudSuccess) {
      setSecMsg({ type: 'success', text: 'Password updated and synchronized successfully!' }); 
    } else {
      setSecMsg({ type: 'info', text: 'Password updated locally on this PC! (Cloud sync is pending connectivity).' }); 
    }
    setSec(s => ({ ...s, verifyMobile: '', newPassword: '' }));
  };

  const updateEmail = async () => { 
    if (!checkMobile()) return setSecMsg({ type: 'error', text: 'Registered mobile number verification failed.' }); 
    if (!sec.newEmail.includes('@')) return setSecMsg({ type: 'error', text: 'Enter valid new email.' }); 
    const updated = { ...acc, email: sec.newEmail, updated: new Date().toISOString() };
    saveAcc(updated); 
    let cloudSuccess = false;
    try {
      cloudSuccess = await saveSecurityAccountToCloud(sec.newEmail, updated);
    } catch (err) {
      console.warn('[CloudSync] Background security email sync failed:', err);
    }
    window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
    if (cloudSuccess) {
      setSecMsg({ type: 'success', text: 'Email updated and synchronized successfully!' }); 
    } else {
      setSecMsg({ type: 'info', text: 'Email updated locally on this PC! (Cloud sync is pending connectivity).' }); 
    }
    setSec(s => ({ ...s, verifyMobile: '', newEmail: '' }));
  };

  const updateMobile = async () => { 
    if (!checkCode()) return setSecMsg({ type: 'error', text: 'Secret security code verification failed.' }); 
    if (sec.newMobile.length < 6) return setSecMsg({ type: 'error', text: 'Enter valid new mobile number.' }); 
    const updated = { ...acc, mobile: enc(sec.newMobile), updated: new Date().toISOString() };
    saveAcc(updated); 
    let cloudSuccess = false;
    try {
      cloudSuccess = await saveSecurityAccountToCloud(acc.email, updated);
    } catch (err) {
      console.warn('[CloudSync] Background security mobile sync failed:', err);
    }
    window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
    if (cloudSuccess) {
      setSecMsg({ type: 'success', text: 'Mobile number updated and synchronized successfully!' }); 
    } else {
      setSecMsg({ type: 'info', text: 'Mobile number updated locally on this PC! (Cloud sync is pending connectivity).' }); 
    }
    setSec(s => ({ ...s, verifyCode: '', newMobile: '' }));
  };

  const disableProtection = () => { if (!confirm('Disable Account Login Protection? Use only for emergency recovery.')) return; saveAcc({ ...acc, protectionDisabled: true, emergencyDisabledAt: new Date().toISOString() }); setSecMsg({ type: 'success', text: 'Account Login Protection has been disabled.' }); };
  const handleLogoUpload = e => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => updateSettings({ logo: reader.result }); reader.readAsDataURL(file); } };

  const handleTemplateUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = String(ev.target.result || '');
      localStorage.setItem('sma-custom-invoice-template', text);
      localStorage.setItem('sma-invoice-template-choice', 'custom');
      updateSettings({ invoiceTemplateChoice: 'custom' });
      setCustomTemplate(text);
      alert('Local template imported successfully! It has been set as your default template.');
      e.target.value = '';
    };
    reader.onerror = () => {
      alert('Template file read error. Please upload a valid HTML or TXT template file.');
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleRemoveTemplate = () => {
    if (confirm('Are you sure you want to remove the imported custom template?')) {
      localStorage.removeItem('sma-custom-invoice-template');
      localStorage.setItem('sma-invoice-template-choice', 'sma');
      updateSettings({ invoiceTemplateChoice: 'sma' });
      setCustomTemplate('');
      alert('Custom template removed.');
    }
  };

  const handleCloudSync = async () => {
    setSyncLoading(true);
    setSyncMsg({ type: '', text: '' });
    try {
      const registeredAcc = loadAcc();
      const targetEmail = user?.email || registeredAcc.email || settings.email;
      
      if (!targetEmail || !targetEmail.includes('@')) {
        throw new Error('No registered email address found. Please register your email under "Account Security & Recovery" or configure your business email.');
      }
      
      if (!navigator.onLine) {
        throw new Error('You are currently offline. Internet connection is required for Cloud Sync.');
      }

      // 1. Perform cloud DB workspace sync
      const { syncWorkspace, packLocalWorkspace } = await import('../utils/cloudSync.js');
      const result = await syncWorkspace(targetEmail, { forceUpload: true });
      if (!result.success) {
        throw new Error(result.reason || 'Cloud Database Sync failed.');
      }

      // 2. Send recovery/backup email with latest data
      if (window.genmb?.email) {
        const backupData = packLocalWorkspace();
        const backupJsonString = JSON.stringify(backupData, null, 2);
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-top: 0;">SHREE MAHESHWARA AGENCIES - Cloud Sync Backup</h2>
            <p style="font-size: 14px; line-height: 1.6;">Your LedgerCraft offline billing data has been backed up securely to the cloud. You can restore your workspace anytime using the JSON backup provided below.</p>
            
            <h3 style="color: #0f766e; font-size: 16px; margin: 20px 0 10px 0;">Backup Data Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left;">
                  <th style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Entity</th>
                  <th style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Record Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Parties / Customers</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.store?.customers?.length || 0}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Products / Items</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.store?.items?.length || 0}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Invoices</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.store?.invoices?.length || 0}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Purchase Orders</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.purchaseOrders?.length || 0}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Expenses</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.expenses?.length || 0}</td>
                </tr>
              </tbody>
            </table>

            <div style="background-color: #f0fdfa; padding: 15px; border: 1px dashed #2dd4bf; border-radius: 8px; margin-top: 20px; font-size: 13px; line-height: 1.6; color: #0f766e;">
              <strong style="display: block; margin-bottom: 5px;">💡 How to restore this backup:</strong>
              <ol style="margin: 0; padding-left: 20px;">
                <li>Select and copy the entire raw JSON text code shown below.</li>
                <li>Save it as a text file named <code>sma_backup.json</code> on your PC.</li>
                <li>Open the billing application, go to <strong>Backup & Export</strong> page.</li>
                <li>Click <strong>Import Data</strong> and select your saved JSON file to restore everything!</li>
              </ol>
            </div>

            <h4 style="margin: 25px 0 8px 0; color: #475569;">Raw Backup JSON:</h4>
            <textarea style="width: 100%; height: 180px; font-family: monospace; font-size: 11px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; background-color: #f8fafc; color: #334155; resize: vertical;" readonly>${backupJsonString}</textarea>
            
            <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              <p>Sync timestamp: ${new Date().toLocaleString()}</p>
              <p>© 2026 SHREE MAHESHWARA AGENCIES. All rights reserved.</p>
            </div>
          </div>
        `;

        await window.genmb.email.send({
          to: targetEmail,
          subject: `SMA Billing Cloud Sync Backup - ${new Date().toLocaleDateString()}`,
          html: htmlContent
        });
      }

      const now = Date.now();
      localStorage.setItem('sma-last-sync-time', String(now));
      localStorage.setItem('sma-last-sync-status', 'success');
      setLastSyncAt(String(now));
      setLastSyncStatus('success');

      setSyncMsg({ type: 'success', text: `Cloud Sync Successful! All local data is securely updated on the cloud under ${targetEmail}.` });
    } catch (err) {
      setSyncMsg({ type: 'error', text: err.message || 'Cloud Sync failed.' });
    } finally {
      setSyncLoading(false);
    }
  };

  /* Smart Data Importer Parser & Mapper (Issue 4) */
  const runSmartImport = async (file) => {
    setImportLoading(true);
    setImportError('');
    setImportSummary(null);
    try {
      const fileName = file.name.toLowerCase();
      let parsed = { customers: [], items: [], invoices: [], purchaseOrders: [], expenses: [], settings: {} };

      // Helper: detect type based on headers
      const detectTypeByKeys = (keys) => {
        const k = keys.map(x => String(x).trim().toLowerCase());
        if (k.some(x => ['barcode', 'sku', 'sale price', 'sale_price', 'mrp', 'hsn', 'purchase price', 'purchase_price', 'cost'].includes(x))) return 'items';
        if (k.some(x => ['invoice number', 'invoice_number', 'invoice no', 'invoice_no', 'bill no', 'bill_no', 'payment mode', 'payment_mode'].includes(x))) return 'invoices';
        if (k.some(x => ['po number', 'po_number', 'po no', 'po_no', 'company name', 'company_name', 'contact person'].includes(x))) return 'purchaseOrders';
        if (k.some(x => ['expense', 'vendor', 'category', 'amount'].includes(x)) && k.includes('vendor')) return 'expenses';
        if (k.some(x => ['customer', 'party', 'phone', 'mobile', 'gstin', 'gst', 'address'].includes(x))) return 'customers';
        if (k.some(x => x.includes('product') || x.includes('item') || x.includes('price'))) return 'items';
        return 'customers';
      };

      // Mappers
      const mapCustomerRow = (row) => {
        const getVal = (keys) => { for (const key of Object.keys(row)) { if (keys.some(k => key.trim().toLowerCase() === k || key.trim().toLowerCase().includes(k))) return row[key]; } return ''; };
        return {
          id: getVal(['id', 'customerid', 'partyid']) || `cust_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: String(getVal(['name', 'party', 'customer', 'buyer', 'client']) || '').trim(),
          phone: String(getVal(['phone', 'mobile', 'contact', 'tele']) || '').replace(/[^\d+]/g, '').trim(),
          email: String(getVal(['email', 'mail']) || '').trim(),
          address: String(getVal(['address', 'location', 'street', 'city']) || '').trim(),
          gstin: String(getVal(['gst', 'gstin', 'tax no', 'tax_no', 'tin']) || '').toUpperCase().trim(),
          balance: parseFloat(String(getVal(['balance', 'due', 'outstanding']) || '').replace(/[^\d.]/g, '')) || 0,
          updatedAt: Date.now()
        };
      };

      const mapProductRow = (row) => {
        const getVal = (keys) => { for (const key of Object.keys(row)) { if (keys.some(k => key.trim().toLowerCase() === k || key.trim().toLowerCase().includes(k))) return row[key]; } return ''; };
        return {
          id: getVal(['id', 'itemid', 'productid']) || `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: String(getVal(['product name', 'item name', 'name', 'title', 'product', 'item']) || '').trim(),
          hsn: String(getVal(['hsn', 'sac', 'hsn/sac', 'code']) || '').trim(),
          unit: String(getVal(['unit', 'uom', 'measure']) || 'pcs').trim().toLowerCase(),
          category: String(getVal(['category', 'group', 'type']) || 'Imported').trim(),
          barcode: String(getVal(['barcode', 'sku', 'upc', 'serial']) || '').trim(),
          salePrice: parseFloat(String(getVal(['sale price', 'sale_price', 'price', 'rate', 'mrp']) || '').replace(/[^\d.]/g, '')) || 0,
          purchasePrice: parseFloat(String(getVal(['purchase price', 'purchase_price', 'cost', 'buy price']) || '').replace(/[^\d.]/g, '')) || 0,
          taxRate: parseFloat(String(getVal(['tax rate', 'tax', 'gst', 'tax%', 'gst%']) || '').replace(/[^\d.]/g, '')) || 0,
          stock: parseFloat(String(getVal(['stock', 'qty', 'quantity', 'opening stock']) || '').replace(/[^\d.]/g, '')) || 0,
          lowStock: parseFloat(String(getVal(['low stock', 'min stock', 'alert']) || '').replace(/[^\d.]/g, '')) || 25,
          updatedAt: Date.now()
        };
      };

      const mapInvoiceRow = (row) => {
        const getVal = (keys) => { for (const key of Object.keys(row)) { if (keys.some(k => key.trim().toLowerCase() === k || key.trim().toLowerCase().includes(k))) return row[key]; } return ''; };
        const total = parseFloat(String(getVal(['total', 'amount', 'grand total', 'net amount']) || '').replace(/[^\d.]/g, '')) || 0;
        const paid = parseFloat(String(getVal(['paid', 'amount paid', 'received']) || '').replace(/[^\d.]/g, '')) || 0;
        return {
          id: getVal(['id', 'invoiceid', 'billid']) || `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          number: String(getVal(['number', 'invoice number', 'invoice no', 'invoice_no', 'bill no', 'bill_no']) || '').trim(),
          date: String(getVal(['date', 'invoice date', 'bill date']) || new Date().toISOString().slice(0, 10)).trim(),
          dueDate: String(getVal(['due date', 'due_date', 'due']) || '').trim(),
          customerId: getVal(['customerId', 'customerId', 'customer']) || '',
          customerName: String(getVal(['customer', 'party', 'buyer', 'name']) || 'Walk-in Customer').trim(),
          total,
          paid,
          balance: parseFloat(String(getVal(['balance', 'due', 'outstanding']) || '').replace(/[^\d.]/g, '')) || (total - paid),
          paymentMode: String(getVal(['payment mode', 'payment_mode', 'mode', 'type']) || 'Cash').trim(),
          status: String(getVal(['status', 'state']) || 'Paid').trim(),
          items: [],
          updatedAt: Date.now()
        };
      };

      const mapPurchaseOrderRow = (row) => {
        const getVal = (keys) => { for (const key of Object.keys(row)) { if (keys.some(k => key.trim().toLowerCase() === k || key.trim().toLowerCase().includes(k))) return row[key]; } return ''; };
        return {
          id: getVal(['id', 'poid', 'orderid']) || `po_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          number: String(getVal(['number', 'po number', 'po no', 'order no']) || '').trim(),
          date: String(getVal(['date', 'po date', 'order date']) || '').trim(),
          companyName: String(getVal(['company', 'supplier', 'vendor', 'name']) || '').trim(),
          contactPerson: String(getVal(['contact', 'person', 'attention']) || '').trim(),
          emailPhone: String(getVal(['email', 'phone', 'contact info', 'mobile']) || '').trim(),
          productService: String(getVal(['product', 'item', 'details', 'service']) || '').trim(),
          quantity: String(getVal(['quantity', 'qty']) || '').trim(),
          details: String(getVal(['details', 'notes', 'description']) || '').trim(),
          updatedAt: Date.now()
        };
      };

      const mapExpenseRow = (row) => {
        const getVal = (keys) => { for (const key of Object.keys(row)) { if (keys.some(k => key.trim().toLowerCase() === k || key.trim().toLowerCase().includes(k))) return row[key]; } return ''; };
        return {
          id: getVal(['id', 'expenseid']) || `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          date: String(getVal(['date', 'expense date']) || new Date().toISOString().slice(0, 10)).trim(),
          category: String(getVal(['category', 'type', 'group']) || 'General').trim(),
          vendor: String(getVal(['vendor', 'payee', 'paid to']) || '').trim(),
          amount: parseFloat(String(getVal(['amount', 'total', 'cost']) || '').replace(/[^\d.]/g, '')) || 0,
          notes: String(getVal(['notes', 'description', 'remark']) || '').trim(),
          updatedAt: Date.now()
        };
      };

      const parseCsvText = (text) => {
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return [];
        let sep = ',';
        if (lines[0].includes('\t')) sep = '\t';
        else if (lines[0].includes(';')) sep = ';';

        const split = (row) => {
          let res = [], inside = false, entry = '';
          for (let i = 0; i < row.length; i++) {
            const c = row[i];
            if (c === '"' || c === "'") inside = !inside;
            else if (c === sep && !inside) { res.push(entry.trim()); entry = ''; }
            else entry += c;
          }
          res.push(entry.trim());
          return res;
        };

        const headers = split(lines[0]).map(h => h.toLowerCase().replace(/["']/g, '').trim());
        const resultRows = [];
        for (let i = 1; i < lines.length; i++) {
          const vals = split(lines[i]);
          if (vals.length === 0 || !vals.some(Boolean)) continue;
          const rowObj = {};
          headers.forEach((h, idx) => { rowObj[h] = vals[idx] || ''; });
          resultRows.push(rowObj);
        }
        return { headers, rows: resultRows };
      };

      const parseExcelWorkbook = async (fileBuffer) => {
        const workbook = XLSX.read(fileBuffer, { type: 'array' });
        const res = { customers: [], items: [], invoices: [], purchaseOrders: [], expenses: [], settings: {} };
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          if (rows && rows.length > 0) {
            const headers = Object.keys(rows[0]).map(h => String(h || '').trim().toLowerCase());
            const type = detectTypeByKeys(headers);
            if (type === 'customers') res.customers.push(...rows.map(mapCustomerRow).filter(c => c.name));
            else if (type === 'items') res.items.push(...rows.map(mapProductRow).filter(i => i.name));
            else if (type === 'invoices') res.invoices.push(...rows.map(mapInvoiceRow).filter(inv => inv.number));
            else if (type === 'purchaseOrders') res.purchaseOrders.push(...rows.map(mapPurchaseOrderRow).filter(p => p.number));
            else if (type === 'expenses') res.expenses.push(...rows.map(mapExpenseRow).filter(e => e.amount > 0));
          }
        }
        return res;
      };

      // 1. JSON & backup files
      if (fileName.endsWith('.json')) {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.customers || data.items || data.invoices || data.store) {
          const store = data.store || data;
          parsed = {
            customers: store.customers || data.customers || [],
            items: store.items || data.items || [],
            invoices: store.invoices || data.invoices || [],
            purchaseOrders: data.purchaseOrders || [],
            expenses: data.expenses || [],
            settings: store.settings || data.settings || {}
          };
        } else {
          // Standard JSON array
          const arr = Array.isArray(data) ? data : [data];
          if (arr.length > 0) {
            const type = detectTypeByKeys(Object.keys(arr[0]));
            if (type === 'customers') parsed.customers = arr.map(mapCustomerRow).filter(c => c.name);
            else if (type === 'items') parsed.items = arr.map(mapProductRow).filter(i => i.name);
            else if (type === 'invoices') parsed.invoices = arr.map(mapInvoiceRow).filter(inv => inv.number);
            else if (type === 'purchaseOrders') parsed.purchaseOrders = arr.map(mapPurchaseOrderRow).filter(p => p.number);
            else if (type === 'expenses') parsed.expenses = arr.map(mapExpenseRow).filter(e => e.amount > 0);
          }
        }
      } 
      // 2. CSV / TXT files
      else if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
        const text = await file.text();
        const { headers, rows } = parseCsvText(text);
        if (rows.length > 0) {
          const type = detectTypeByKeys(headers);
          if (type === 'customers') parsed.customers = rows.map(mapCustomerRow).filter(c => c.name);
          else if (type === 'items') parsed.items = rows.map(mapProductRow).filter(i => i.name);
          else if (type === 'invoices') parsed.invoices = rows.map(mapInvoiceRow).filter(inv => inv.number);
          else if (type === 'purchaseOrders') parsed.purchaseOrders = rows.map(mapPurchaseOrderRow).filter(p => p.number);
          else if (type === 'expenses') parsed.expenses = rows.map(mapExpenseRow).filter(e => e.amount > 0);
        }
      } 
      // 3. Excel files
      else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
        const buffer = await file.arrayBuffer();
        parsed = await parseExcelWorkbook(buffer);
      } 
      // 4. ZIP files
      else if (fileName.endsWith('.zip')) {
        const zip = await JSZip.loadAsync(file);
        for (const fName of Object.keys(zip.files)) {
          const entry = zip.files[fName];
          if (!entry.dir) {
            const entryLower = fName.toLowerCase();
            if (entryLower.endsWith('.json')) {
              const text = await entry.async('string');
              const data = JSON.parse(text);
              const store = data.store || data;
              if (store.customers) parsed.customers.push(...(store.customers || []).map(mapCustomerRow).filter(c => c.name));
              if (store.items) parsed.items.push(...(store.items || []).map(mapProductRow).filter(i => i.name));
              if (store.invoices) parsed.invoices.push(...(store.invoices || []).map(mapInvoiceRow).filter(inv => inv.number));
              if (data.purchaseOrders) parsed.purchaseOrders.push(...(data.purchaseOrders || []).map(mapPurchaseOrderRow).filter(p => p.number));
              if (data.expenses) parsed.expenses.push(...(data.expenses || []).map(mapExpenseRow).filter(e => e.amount > 0));
              if (store.settings) parsed.settings = { ...parsed.settings, ...store.settings };
            } else if (entryLower.endsWith('.csv') || entryLower.endsWith('.txt')) {
              const text = await entry.async('string');
              const { headers, rows } = parseCsvText(text);
              const type = detectTypeByKeys(headers);
              if (type === 'customers') parsed.customers.push(...rows.map(mapCustomerRow).filter(c => c.name));
              else if (type === 'items') parsed.items.push(...rows.map(mapProductRow).filter(i => i.name));
              else if (type === 'invoices') parsed.invoices.push(...rows.map(mapInvoiceRow).filter(inv => inv.number));
              else if (type === 'purchaseOrders') parsed.purchaseOrders.push(...rows.map(mapPurchaseOrderRow).filter(p => p.number));
              else if (type === 'expenses') parsed.expenses.push(...rows.map(mapExpenseRow).filter(e => e.amount > 0));
            } else if (entryLower.endsWith('.xlsx') || entryLower.endsWith('.xls')) {
              const buf = await entry.async('arraybuffer');
              const subParsed = await parseExcelWorkbook(buf);
              parsed.customers.push(...subParsed.customers);
              parsed.items.push(...subParsed.items);
              parsed.invoices.push(...subParsed.invoices);
              parsed.purchaseOrders.push(...subParsed.purchaseOrders);
              parsed.expenses.push(...subParsed.expenses);
            }
          }
        }
      } 
      // 5. Document AI PDF files
      else if (fileName.endsWith('.pdf')) {
        if (!window.genmb?.docs?.parse) {
          throw new Error('Document AI service is offline. Please use Excel, CSV, JSON, TXT, or ZIP instead.');
        }
        const res = await window.genmb.docs.parse(file, 'generic');
        if (!res) throw new Error('Document AI returned an empty response.');
        
        if (res.tables && Array.isArray(res.tables)) {
          for (const table of res.tables) {
            const rows = table.rows || [];
            if (rows.length > 1) {
              const tableData = rows.map(r => {
                const cells = Array.isArray(r) ? r : (r.cells || r.values || []);
                return cells.map(c => typeof c === 'string' ? c : (c?.text || c?.value || ''));
              });
              const headers = tableData[0].map(h => String(h || '').trim().toLowerCase());
              const type = detectTypeByKeys(headers);
              const rowObjects = [];
              for (let rIndex = 1; rIndex < tableData.length; rIndex++) {
                const row = tableData[rIndex];
                if (row.length === 0 || !row.some(Boolean)) continue;
                const rawItem = {};
                row.forEach((val, cIndex) => { rawItem[headers[cIndex] || `col_${cIndex}`] = val; });
                rowObjects.push(rawItem);
              }
              if (type === 'customers') parsed.customers.push(...rowObjects.map(mapCustomerRow).filter(c => c.name));
              else if (type === 'items') parsed.items.push(...rowObjects.map(mapProductRow).filter(i => i.name));
              else if (type === 'invoices') parsed.invoices.push(...rowObjects.map(mapInvoiceRow).filter(inv => inv.number));
              else if (type === 'purchaseOrders') parsed.purchaseOrders.push(...rowObjects.map(mapPurchaseOrderRow).filter(p => p.number));
              else if (type === 'expenses') parsed.expenses.push(...rowObjects.map(mapExpenseRow).filter(e => e.amount > 0));
            }
          }
        }
        
        // Text fallback if no tables extracted
        const totalCount = parsed.customers.length + parsed.items.length + parsed.invoices.length + parsed.purchaseOrders.length + parsed.expenses.length;
        if (totalCount === 0 && res.text) {
          const lines = res.text.split('\n').map(l => l.trim()).filter(Boolean);
          const isProd = res.text.toLowerCase().includes('product') || res.text.toLowerCase().includes('item') || res.text.toLowerCase().includes('price');
          if (isProd) {
            parsed.items = lines.map(l => {
              const parts = l.split(/[,\t|]|\s{2,}/).map(p => p.trim()).filter(Boolean);
              if (parts.length >= 2) return { name: parts[0], salePrice: parseFloat(parts[1].replace(/[^\d.]/g, '')) || 0, unit: 'pcs', updatedAt: Date.now() };
              return null;
            }).filter(x => x && x.name);
          } else {
            parsed.customers = lines.map(l => {
              const parts = l.split(/[,\t|]|\s{2,}/).map(p => p.trim()).filter(Boolean);
              if (parts.length >= 2) return { name: parts[0], phone: parts[1].replace(/[^\d+]/g, ''), updatedAt: Date.now() };
              return null;
            }).filter(x => x && x.name);
          }
        }
      } else {
        throw new Error('Unsupported file extension.');
      }

      // Check if anything was parsed
      const totalParsed = parsed.customers.length + parsed.items.length + parsed.invoices.length + parsed.purchaseOrders.length + parsed.expenses.length;
      if (totalParsed === 0) {
        throw new Error('We could not detect or extract any structured billing data from this file. Please check file format.');
      }

      // 6. Merge securely using timestamp logic (avoiding duplicates, latest wins)
      const currentCustomers = useBillingStore.getState().customers || [];
      const mergedCustomers = mergeCustomers(currentCustomers, parsed.customers);

      const currentItems = useBillingStore.getState().items || [];
      const mergedItems = mergeProducts(currentItems, parsed.items);

      const currentInvoices = useBillingStore.getState().invoices || [];
      const mergedInvoices = mergeInvoices(currentInvoices, parsed.invoices);

      const currentPO = safeJson('sma-purchase-orders');
      const mergedPO = mergeSimple(currentPO, parsed.purchaseOrders, 'id');

      const currentExpenses = safeJson('sma-expenses');
      const mergedExpenses = mergeSimple(currentExpenses, parsed.expenses, 'id');

      const currentSettings = useBillingStore.getState().settings || {};
      const mergedSettings = { ...currentSettings, ...(parsed.settings || {}) };

      // 7. Write to store
      importData({
        customers: mergedCustomers,
        items: mergedItems,
        invoices: mergedInvoices,
        settings: mergedSettings
      });

      // 8. Write to standalone localstorage
      localStorage.setItem('sma-purchase-orders', JSON.stringify(mergedPO));
      localStorage.setItem('sma-expenses', JSON.stringify(mergedExpenses));

      setImportSummary({
        customers: parsed.customers.length,
        items: parsed.items.length,
        invoices: parsed.invoices.length,
        purchaseOrders: parsed.purchaseOrders.length,
        expenses: parsed.expenses.length,
        ledger: parsed.invoices.length // Ledger count is tied directly to invoices imported
      });

      // 9. Trigger automatic cloud sync if registered email is active (Requirement)
      const syncEmail = user?.email || loadAcc().email || mergedSettings.email;
      if (syncEmail && syncEmail.includes('@') && navigator.onLine) {
        const { triggerAutoSync } = await import('../utils/cloudSync.js');
        triggerAutoSync(syncEmail);
      }

    } catch (err) {
      setImportError(err.message || 'Smart Import failed.');
    } finally {
      setImportLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const syncEmail = user?.email || acc?.email || settings.email;

  return html`<div className="space-y-6">
    <!-- Settings Section Tab-Bar Selector (Issues 3 & 4) -->
    <div className="flex border-b border-[hsl(var(--border))] gap-2 overflow-x-auto no-print pb-1" aria-label="Settings categories">
      <button 
        onClick=${() => setActiveTab('business')} 
        className=${`px-4 py-2.5 text-sm font-black border-b-2 transition-all whitespace-nowrap ${activeTab === 'business' ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}
      >
        🏢 Business & Branding
      </button>
      <button 
        onClick=${() => setActiveTab('security')} 
        className=${`px-4 py-2.5 text-sm font-black border-b-2 transition-all whitespace-nowrap ${activeTab === 'security' ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}
      >
        🔒 Account Security
      </button>
      <button 
        onClick=${() => setActiveTab('data')} 
        className=${`px-4 py-2.5 text-sm font-black border-b-2 transition-all whitespace-nowrap ${activeTab === 'data' ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}
      >
        📁 Data / Backup
      </button>
    </div>

    <!-- Active Tab Panel Content -->
    ${activeTab === 'business' && html`
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-xl font-black">Business Customization</h3>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="relative grid h-32 w-32 place-items-center overflow-hidden rounded-xl border-2 border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
                ${settings.logo ? html`<${React.Fragment}><img src=${settings.logo} className="h-full w-full object-contain" /><button onClick=${() => updateSettings({ logo: '' })} className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white shadow-sm"><${X} size=${14} /></button></${React.Fragment}>` : html`<${ImageIcon} className="text-[hsl(var(--muted-foreground))]" size=${32} />`}
              </div>
              <label className="cursor-pointer rounded-md bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-black text-white shadow-sm">
                <${Upload} size=${12} className="mr-1 inline" /> ${settings.logo ? 'Change Logo' : 'Upload Logo'}
                <input type="file" accept="image/*" onChange=${handleLogoUpload} className="hidden" />
              </label>
            </div>
            <div className="flex-1 grid gap-4 sm:grid-cols-2">
              ${fields.map(f => html`<label key=${f} className=${f === 'address' || f === 'tagline' ? 'text-sm font-bold sm:col-span-2' : 'text-sm font-bold'}>${f.replace(/([A-Z])/g, ' $1').toUpperCase()}<input value=${settings[f]} onInput=${e => updateSettings({ [f]: e.target.value })} placeholder=${f.replace(/([A-Z])/g, ' $1')} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>`)}
            </div>
          </div>
          
          <div className="mt-5 card p-5">
            <h3 className="font-black">Global Font Settings</h3>
            ${fontMsg.text ? html`<p className=${`mt-3 rounded p-2 text-xs font-bold ${fontMsg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>${fontMsg.text}</p>` : ''}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="text-sm font-bold">Font Style
                <select value=${fontDraft.fontFamily} onChange=${e => setFontDraft({ ...fontDraft, fontFamily: e.target.value })} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  ${fontFamilies.map(f => html`<option key=${f} value=${f}>${f}</option>`)}
                </select>
              </label>
              <label className="text-sm font-bold">Font Size
                <select value=${fontDraft.fontSize} onChange=${e => setFontDraft({ ...fontDraft, fontSize: e.target.value })} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  ${fontSizes.map(f => html`<option key=${f} value=${f}>${f}</option>`)}
                </select>
              </label>
              <label className="text-sm font-bold">Font Weight
                <select value=${fontDraft.fontWeight} onChange=${e => setFontDraft({ ...fontDraft, fontWeight: e.target.value })} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  ${fontWeights.map(f => html`<option key=${f} value=${f}>${f}</option>`)}
                </select>
              </label>
            </div>
            <button onClick=${saveFont} className="mt-4 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white">Set Font</button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-black">GST & Alerts</h3>
            <div className="mt-4 grid gap-3">
              <label className="text-sm font-bold">Default CGST %<input type="number" value=${settings.defaultCgstRate ?? 9} onInput=${e => updateSettings({ defaultCgstRate: Number(e.target.value) })} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>
              <label className="text-sm font-bold">Default SGST %<input type="number" value=${settings.defaultSgstRate ?? 9} onInput=${e => updateSettings({ defaultSgstRate: Number(e.target.value) })} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>
              <label className="text-sm font-bold">Due reminder before days<input type="number" value=${settings.dueReminderDays ?? 3} onInput=${e => updateSettings({ dueReminderDays: Number(e.target.value) })} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" /></label>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="flex items-center gap-2"><${FileText} size=${18} /> Invoice Templates</h3>
            <div className="mt-4 space-y-4">
              <label className="text-sm font-bold block">
                Default Print Template
                <select 
                  value=${settings.invoiceTemplateChoice || localStorage.getItem('sma-invoice-template-choice') || 'sma'} 
                  onChange=${e => {
                    const val = e.target.value;
                    localStorage.setItem('sma-invoice-template-choice', val);
                    updateSettings({ invoiceTemplateChoice: val });
                  }} 
                  className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3"
                >
                  <option value="sma">SMA Print Format</option>
                  <option value="classic">Classic Template</option>
                  <option value="modern">Modern Template</option>
                  <option value="compact">Compact Template</option>
                  <option value="gst">GST Box Template</option>
                  <option value="letterhead">Letterhead Template</option>
                  <option value="professional">Professional Teal Template</option>
                  <option value="elegant">Elegant Coral Template</option>
                  <option value="minimalist">Minimalist Steel Template</option>
                  ${customTemplate ? html`<option value="custom">My Local Template</option>` : ''}
                </select>
              </label>

              <div className="border border-dashed border-[hsl(var(--border))] rounded-lg p-4 bg-[hsl(var(--muted)/0.1)] text-center">
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3">
                  Import a custom HTML template file from your local system (.html, .htm, .txt)
                </p>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-black text-white hover:opacity-90 shadow-sm">
                    <${Upload} size=${14} /> Import Local Template
                    <input 
                      type="file" 
                      accept=".html,.htm,.txt,text/html,text/plain" 
                      onChange=${handleTemplateUpload} 
                      className="hidden" 
                    />
                  </label>
                  
                  ${customTemplate ? html`
                    <button 
                      onClick=${handleRemoveTemplate} 
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-black text-white hover:opacity-90 shadow-sm"
                    >
                      <${X} size=${14} /> Remove Custom Template
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-black">Theme</h3>
            <label className="mt-4 flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.6)] p-4 font-bold">Dark mode<input type="checkbox" checked=${settings.darkMode} onChange=${e => updateSettings({ darkMode: e.target.checked })} /></label>
          </div>
        </div>
      </div>
    `}

    ${activeTab === 'security' && html`
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="flex items-center gap-2 font-black"><${ShieldCheck} size=${18} /> Account Security & Recovery</h3>
          ${secMsg.text ? html`<p className=${`mt-3 rounded p-2 text-xs font-bold ${secMsg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>${secMsg.text}</p>` : ''}
          
          ${isVerifying ? html`
            <div className="mt-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-4">
              <h4 className="font-black text-sm text-blue-700">Enter Verification Code</h4>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">A 6-digit verification code has been sent to <strong>${pendingAcc?.email}</strong>. Enter it here to complete security setup and enable account recovery.</p>
              <div className="flex gap-2">
                <input value=${userOtp} onInput=${e => setUserOtp(e.target.value)} placeholder="6-digit OTP" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3 text-center tracking-widest font-black text-lg max-w-[200px]" />
                <button onClick=${handleVerifyOtp} className="rounded bg-emerald-600 px-6 py-3 font-black text-white hover:opacity-90">Verify & Enable Recovery</button>
              </div>
              <button onClick=${() => { setIsVerifying(false); setOtpSent(''); setUserOtp(''); setPendingAcc(null); setSecMsg({ type: '', text: '' }); }} className="text-xs font-bold text-red-500 hover:underline">Cancel Registration</button>
            </div>
          ` : html`
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value=${sec.email} onInput=${e => setSec({ ...sec, email: e.target.value })} placeholder="Register email" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
              <input type="password" value=${sec.password} onInput=${e => setSec({ ...sec, password: e.target.value })} placeholder="Register password (6+ chars)" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
              <input value=${sec.mobile} onInput=${e => setSec({ ...sec, mobile: e.target.value })} placeholder="Secret mobile number" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
              <input type="password" value=${sec.code} onInput=${e => setSec({ ...sec, code: e.target.value })} placeholder="Secret security code" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
              <button onClick=${register} className="rounded bg-[hsl(var(--primary))] p-3 font-black text-white sm:col-span-2">Register / Save Secure Account</button>
              
              <div className="sm:col-span-2 border-t border-[hsl(var(--border))] my-2 pt-4">
                <p className="text-xs font-black uppercase text-[hsl(var(--muted-foreground))] mb-3">Verification & Updates</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value=${sec.verifyMobile} onInput=${e => setSec({ ...sec, verifyMobile: e.target.value })} placeholder="Verify registered mobile" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                  <input type="password" value=${sec.newPassword} onInput=${e => setSec({ ...sec, newPassword: e.target.value })} placeholder="New password" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                  <button onClick=${updatePassword} className="rounded border border-[hsl(var(--border))] p-3 font-black hover:bg-[hsl(var(--muted)/0.2)]">Forgot / Update Password</button>
                  
                  <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2 border-t border-[hsl(var(--border)/0.5)] pt-3">
                    <input value=${sec.newEmail} onInput=${e => setSec({ ...sec, newEmail: e.target.value })} placeholder="New email" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                    <button onClick=${updateEmail} className="rounded border border-[hsl(var(--border))] p-3 font-black hover:bg-[hsl(var(--muted)/0.2)]">Change Email</button>
                  </div>

                  <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2 border-t border-[hsl(var(--border)/0.5)] pt-3">
                    <input type="password" value=${sec.verifyCode} onInput=${e => setSec({ ...sec, verifyCode: e.target.value })} placeholder="Secret code to change mobile" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                    <input value=${sec.newMobile} onInput=${e => setSec({ ...sec, newMobile: e.target.value })} placeholder="New mobile number" className="focus-ring rounded border border-[hsl(var(--border))] bg-transparent p-3" />
                    <button onClick=${updateMobile} className="rounded border border-[hsl(var(--border))] p-3 font-black hover:bg-[hsl(var(--muted)/0.2)] sm:col-span-2">Update Mobile</button>
                  </div>
                </div>
              </div>
              
              <button onClick=${disableProtection} className="rounded bg-red-600 p-3 font-black text-white sm:col-span-2">Disable Account Login Protection</button>
            </div>
          `}
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-black">Account Login / Forgot Password</h3>
            ${user ? html`<p className="mt-3 rounded bg-emerald-500/10 p-2 text-xs font-bold text-emerald-600">Logged in: ${user.email}</p>` : html`<div className="mt-3 flex gap-2"><input type="email" value=${loginEmail} onInput=${e => setLoginEmail(e.target.value)} placeholder="Email address" disabled=${authBusy} className="min-w-0 flex-1 rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 text-sm" /><button disabled=${authBusy} onClick=${() => sendEmailLink(loginEmail)} className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-3 text-white disabled:opacity-50"><${Mail} size=${17} /></button></div>`}
            ${authError ? html`<p className="mt-2 rounded bg-red-500/10 p-2 text-xs font-bold text-red-600">${authError}</p>` : ''}
            ${authMessage ? html`<p className="mt-2 rounded bg-emerald-500/10 p-2 text-xs font-bold text-emerald-600">${authMessage}</p>` : ''}
          </div>
        </div>
      </div>
    `}

    ${activeTab === 'data' && html`
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <!-- Smart Backup Import UI inside Settings (Issue 4) -->
          <div className="card p-5 space-y-4">
            <h3 className="flex items-center gap-2 font-black text-lg text-[hsl(var(--foreground))]">
              <${HardDrive} size=${20} className="text-[hsl(var(--primary))]" />
              <span>Smart Backup Import & Auto Mapping</span>
            </h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed font-bold">
              Upload any billing backup data file (PDF, Excel, CSV, JSON, TXT, or ZIP). The smart parser automatically reads, parses, analyzes columns, segregates records (Customers, Products, Invoices, Purchase Orders, Expenses), merges duplicates securely (using latest timestamp), and auto-syncs everything to the cloud!
            </p>

            ${importError && html`
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-bold flex items-center gap-2">
                <${AlertCircle} size=${15} />
                <span>${importError}</span>
              </div>
            `}

            ${importSummary && html`
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <h4 className="font-black text-xs text-emerald-700 flex items-center gap-1.5">
                  <${CheckCircle2} size=${15} /> Smart Backup Mapping Completed Successfully!
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-center text-xs">
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${importSummary.customers}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Parties</p>
                  </div>
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${importSummary.items}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Products</p>
                  </div>
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${importSummary.invoices}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Invoices</p>
                  </div>
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${importSummary.purchaseOrders}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">PO</p>
                  </div>
                  <div className="bg-[hsl(var(--card))] p-2 rounded-lg border border-[hsl(var(--border))]">
                    <p className="font-black text-emerald-600 text-lg">${importSummary.ledger}</p>
                    <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Ledger Rows</p>
                  </div>
                </div>
              </div>
            `}

            <div className="flex justify-start">
              <button 
                disabled=${importLoading}
                onClick=${() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-6 py-3 font-black text-xs text-white hover:opacity-90 disabled:opacity-50 shadow-sm"
              >
                ${importLoading ? html`<${Loader2} className="animate-spin" size={14} />` : html`<${Upload} size=${14} />`}
                <span>${importLoading ? 'Analyzing & Segregating...' : 'Upload & Import Backup File'}</span>
              </button>
              <input 
                ref=${fileInputRef} 
                type="file" 
                accept=".pdf,.xls,.xlsx,.csv,.json,.txt,.zip,application/json,application/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/plain" 
                onChange=${e => { const file = e.target.files?.[0]; if (file) runSmartImport(file); }} 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <!-- Cloud Sync Card inside Settings UI (Issue 3 / Data / Backup Option) -->
          <div className="card p-5 border-2 border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.03)] space-y-4">
            <h3 className="font-black flex items-center gap-2 text-base text-[hsl(var(--foreground))]">
              <span className="text-[hsl(var(--primary))]">☁</span> Cloud Sync
            </h3>
            <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))] font-bold mt-1">
              Keep PC and Mobile versions fully synchronized. Local changes are uploaded instantly when online.
            </p>

            ${syncMsg.text && html`
              <div className=${`p-2.5 rounded-lg flex items-center gap-2.5 font-bold text-[11px] ${syncMsg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-700'}`}>
                ${syncMsg.type === 'error' ? html`<${AlertCircle} size=${14} />` : html`<${CheckCircle2} size=${14} />`}
                <span>${syncMsg.text}</span>
              </div>
            `}

            <div className="space-y-3 bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))] text-xs">
              <div className="flex items-center justify-between border-b pb-1.5 border-[hsl(var(--border)/0.5)]">
                <span className="font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-[9px]">Sync Status:</span>
                <span className="font-black">
                  ${!isOnline ? html`<span className="text-red-600 flex items-center gap-1"><span className="text-red-600">●</span> Offline</span>` : 
                    (lastSyncStatus === 'syncing' || syncLoading) ? html`<span className="text-amber-500 flex items-center gap-1 animate-pulse"><span className="text-amber-500">●</span> Syncing...</span>` :
                    html`<span className="text-emerald-500 flex items-center gap-1"><span className="text-emerald-500">●</span> Synced</span>`
                  }
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-1.5 border-[hsl(var(--border)/0.5)]">
                <span className="font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-[9px]">Last Sync Time:</span>
                <span className="font-black text-[hsl(var(--foreground))]">
                  ${lastSyncAt ? new Date(Number(lastSyncAt)).toLocaleString() : 'Never synced'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-[9px]">Cloud Identity:</span>
                <span className="font-black text-[hsl(var(--foreground))] truncate max-w-[120px]" title=${syncEmail || 'None'}>
                  ${syncEmail || html`<span className="text-red-500 italic">No Sync Email</span>`}
                </span>
              </div>
            </div>

            <!-- Real-Time Auto Sync Option -->
            <div className="p-3 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] space-y-2">
              <label className="text-xs font-black text-[hsl(var(--foreground))] flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked=${autoSyncEnabled} 
                  onChange=${(e) => {
                    const checked = e.target.checked;
                    setAutoSyncEnabled(checked);
                    localStorage.setItem('sma-auto-cloud-sync-enabled', String(checked));
                    // Dispatch live-update event so background providers react immediately
                    window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
                  }} 
                  className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]" 
                />
                <span>Enable Real-Time Cloud Auto-Sync</span>
              </label>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-bold pl-6 leading-normal">
                Automatically upload local offline modifications and auto-update/download cloud data whenever your device is online.
              </p>
            </div>

            <button 
              disabled=${syncLoading || !syncEmail} 
              onClick=${handleCloudSync} 
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-black text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              ${syncLoading ? html`<${Loader2} className="animate-spin" size=${14} />` : html`<${RefreshCw} size=${14} />`}
              <span>${syncLoading ? 'Syncing...' : 'Sync to Cloud Now'}</span>
            </button>
          </div>
        </div>
      </div>
    `}
  </div>`;
}
