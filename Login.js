/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from '../jsx.js';
import { useAuth } from '../mainProviders.js';
import { useBillingStore } from '../store/useBillingStore.js';
import { useNavigate, useLocation } from 'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0';
import {Lock, KeyRound, ShieldAlert, CheckCircle2, ArrowRight, Mail, LogIn, Globe, Loader2} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { fetchSecurityAccountFromCloud } from '../utils/cloudSync.js';

const ACC_KEY = 'sma-secure-account-v1';
const loadAcc = () => { try { return JSON.parse(localStorage.getItem(ACC_KEY) || '{}'); } catch { return {}; } };
const dec = text => { try { return decodeURIComponent(escape(atob(text || ''))); } catch { return ''; } };
const enc = text => { try { return btoa(unescape(encodeURIComponent(text || ''))); } catch { return text || ''; } };

export function Login() {
  const { user, authLoading, authBusy, authError, authMessage, passcodeAuthorized, loginWithPasscode, signInGoogle, sendEmailLink } = useAuth();
  const settings = useBillingStore(s => s.settings);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [passcode, setPasscode] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('passcode'); // 'passcode' or 'cloud'

  // Recovery States
  const [recoveryMode, setRecoveryMode] = React.useState('none'); // 'none' | 'select' | 'email' | 'code' | 'cloud'
  const [recEmail, setRecEmail] = React.useState('');
  const [recMobile, setRecMobile] = React.useState('');
  const [recCode, setRecCode] = React.useState('');
  const [recNewPassword, setRecNewPassword] = React.useState('');
  const [recoveryBusy, setRecoveryBusy] = React.useState(false);
  const [recoveryError, setRecoveryError] = React.useState('');
  const [recoverySuccess, setRecoverySuccess] = React.useState('');
  const [recoveredPasscode, setRecoveredPasscode] = React.useState('');

  // If already authorized, redirect to dashboard or original page
  React.useEffect(() => {
    if (!authLoading && (user || passcodeAuthorized)) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, passcodeAuthorized, authLoading, navigate, location]);

  const handleGoogleLogin = async () => {
    try {
      await signInGoogle();
    } catch (err) {
      console.error('Google sign in error:', err);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    try {
      await sendEmailLink(email);
    } catch (err) {
      console.error('Email sign in error:', err);
    }
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (!passcode) return;
    loginWithPasscode(passcode);
  };

  // Real Email Recovery Flow utilizing cloud database (Issue 2)
  const handleEmailRecovery = async (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');
    
    if (!recEmail || !recEmail.includes('@')) {
      setRecoveryError('Enter a valid email address.');
      return;
    }

    if (!navigator.onLine) {
      setRecoveryError('You are offline. Email recovery requires an active internet connection.');
      return;
    }

    setRecoveryBusy(true);
    try {
      // 1. Fetch credentials from cloud database
      let loaded = await fetchSecurityAccountFromCloud(recEmail);
      
      // Fallback to local storage if cloud download is empty but local details exist
      if (!loaded) {
        const local = loadAcc();
        if (local && local.email && local.email.trim().toLowerCase() === recEmail.trim().toLowerCase()) {
          loaded = local;
        }
      }

      if (!loaded) {
        throw new Error('No registered account security was found for this email address.');
      }

      // 2. Persist to local storage to enable password gate access (Restore Account)
      localStorage.setItem(ACC_KEY, JSON.stringify(loaded));
      window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));

      // 3. Send passcode via email using Transactional Email Capability
      if (window.genmb?.email) {
        const decryptedPassword = dec(loaded.password) || '1234';
        await window.genmb.email.send({
          to: loaded.email,
          subject: 'SMA Billing Software - Passcode Recovery',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <h2 style="color: #0d9488; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">SMA Billing Passcode Recovery</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">You requested passcode recovery for your <strong>SHREE MAHESHWARA AGENCIES</strong> billing software account.</p>
              
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Your Secure Login Passcode</p>
                <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 900; color: #0f766e; font-family: monospace; letter-spacing: 0.1em;">${decryptedPassword}</p>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;">If you did not make this request, please log in and change your passcode immediately under Settings -> Account Security & Recovery.</p>
            </div>
          `
        });
        
        setRecoverySuccess('Identity Verified! Your recovery passcode has been sent to your email address. Please check your inbox and spam folders.');
      } else {
        throw new Error('Email service is not available at this moment.');
      }
    } catch (err) {
      setRecoveryError(err.message || 'Failed to recover account.');
    } finally {
      setRecoveryBusy(false);
    }
  };

  const handleCodeRecovery = (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');
    
    const loaded = loadAcc();
    const registeredMobile = dec(loaded.mobile);
    const registeredCode = dec(loaded.code);

    if (!registeredMobile || !registeredCode) {
      setRecoveryError('No offline security credentials found on this PC. Please use default passcode (1234 or SMA-2026) to enter.');
      return;
    }

    if (recMobile.trim() === registeredMobile.trim() && recCode.trim() === registeredCode.trim()) {
      const decryptedPassword = dec(loaded.password);
      setRecoveredPasscode(decryptedPassword);
      setRecoverySuccess(`Verification Successful! Your current passcode is: "${decryptedPassword}". You can now set a new passcode below or log in directly.`);
    } else {
      setRecoveryError('Invalid mobile number or secret security code. Verification failed.');
    }
  };

  const handleCloudRestore = async (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');
    if (!recEmail || !recEmail.includes('@')) {
      setRecoveryError('Enter a valid email address.');
      return;
    }

    if (!navigator.onLine) {
      setRecoveryError('You are offline. Cloud Sync restoration requires an active internet connection.');
      return;
    }

    setRecoveryBusy(true);
    try {
      // Restore Security Credentials First
      let loaded = await fetchSecurityAccountFromCloud(recEmail);
      if (loaded) {
        localStorage.setItem(ACC_KEY, JSON.stringify(loaded));
      }

      // Download and Unpack Workspace
      const { downloadFromCloud, unpackAndRestoreWorkspace } = await import('../utils/cloudSync.js');
      const cloudData = await downloadFromCloud(recEmail);
      if (cloudData) {
        const ok = unpackAndRestoreWorkspace(cloudData);
        if (ok) {
          setRecoverySuccess('Workspace successfully restored from Cloud Sync! All Invoices, Products, Parties, Settings, and Passcode have been restored. You can now use your passcode to open the app.');
        } else {
          throw new Error('Unpacking cloud backup failed.');
        }
      } else {
        throw new Error('No cloud sync backup data was found for this email address.');
      }
    } catch (err) {
      setRecoveryError('Restore failed: ' + (err.message || 'Please check your email and try again.'));
    } finally {
      setRecoveryBusy(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');
    if (recNewPassword.length < 6) {
      setRecoveryError('New passcode must be at least 6 characters.');
      return;
    }

    const loaded = loadAcc();
    const updatedAcc = {
      ...loaded,
      password: enc(recNewPassword),
      updated: new Date().toISOString()
    };
    localStorage.setItem(ACC_KEY, JSON.stringify(updatedAcc));
    window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
    
    setRecoverySuccess('Passcode reset successfully! You can now use your new passcode to log in.');
    setRecoveryMode('none');
    setPasscode(recNewPassword);
    setRecNewPassword('');
    setRecoveredPasscode('');
  };

  if (authLoading) {
    return html`
      <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent"></div>
          <p className="text-sm font-black animate-pulse">Verifying secure session...</p>
        </div>
      </div>
    `;
  }

  const passcodeTabClass = `flex items-center justify-center gap-1.5 py-2.5 text-xs font-black rounded-lg transition-all ${
    activeTab === 'passcode'
      ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border border-[hsl(var(--border))]'
      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
  }`;

  const cloudTabClass = `flex items-center justify-center gap-1.5 py-2.5 text-xs font-black rounded-lg transition-all ${
    activeTab === 'cloud'
      ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border border-[hsl(var(--border))]'
      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
  }`;

  return html`
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-4 py-12 relative overflow-hidden">
      <!-- Decorative background lights -->
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[hsl(var(--primary)/0.15)] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[hsl(var(--primary)/0.15)] rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        <!-- Logo and Brand -->
        <div className="flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--primary))] text-white shadow-xl overflow-hidden mb-4">
            ${settings.logo ? html`<img src=${settings.logo} className="h-full w-full object-contain" />` : html`<${Lock} size=${32} />`}
          </div>
          <h2 className="text-2xl font-black tracking-tight">${settings.businessName}</h2>
          <p className="mt-2 text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest">Billing Portal Access</p>
        </div>

        <!-- Main Card -->
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-black border border-red-500/20">
              <${Lock} size=${14} /> Restricted Area
            </div>
            <p className="text-sm font-bold text-[hsl(var(--muted-foreground))]">
              Access protection active. Please verify your credentials to continue.
            </p>
          </div>

          <!-- Alert / Info Box -->
          ${authError ? html`
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-bold flex items-start gap-2.5">
              <span className="mt-0.5"><${Lock} size=${15} /></span>
              <span>${authError}</span>
            </div>
          ` : ''}

          ${authMessage ? html`
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-start gap-2.5">
              <span className="mt-0.5"><${CheckCircle2} size=${15} /></span>
              <span>${authMessage}</span>
            </div>
          ` : ''}

          <!-- Recovery Modes UI -->
          ${recoveryMode !== 'none' ? html`
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 mb-2">
                <h3 className="font-black text-sm text-[hsl(var(--foreground))] uppercase tracking-wider">Account Recovery</h3>
                <button onClick=${() => { setRecoveryMode('none'); setRecoveryError(''); setRecoverySuccess(''); }} className="text-xs font-black text-red-500 hover:underline">Cancel</button>
              </div>

              ${recoveryError ? html`
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-bold flex items-start gap-2">
                  <span className="mt-0.5"><${Lock} size=${14} /></span>
                  <span>${recoveryError}</span>
                </div>
              ` : ''}

              ${recoverySuccess ? html`
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 font-bold flex items-start gap-2">
                  <span className="mt-0.5"><${CheckCircle2} size=${14} /></span>
                  <span>${recoverySuccess}</span>
                </div>
              ` : ''}

              ${recoveryMode === 'select' ? html`
                <div className="space-y-3">
                  <p className="text-xs text-[hsl(var(--muted-foreground))] font-bold text-center mb-2">
                    Choose a secure recovery option to regain access to your billing system:
                  </p>
                  
                  <button onClick=${() => { setRecoveryMode('email'); setRecoveryError(''); setRecoverySuccess(''); }} className="w-full text-left p-3.5 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--primary)/0.03)] transition duration-200">
                    <p className="text-xs font-black flex items-center gap-1.5 text-[hsl(var(--foreground))]">
                      <span className="text-[hsl(var(--primary))] font-bold">✉️</span>
                      <span>Recover via Registered Email</span>
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 font-bold">
                      Verify identity on cloud database and get passcode in secure recovery email.
                    </p>
                  </button>

                  <button onClick=${() => { setRecoveryMode('code'); setRecoveryError(''); setRecoverySuccess(''); }} className="w-full text-left p-3.5 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--primary)/0.03)] transition duration-200">
                    <p className="text-xs font-black flex items-center gap-1.5 text-[hsl(var(--foreground))]">
                      <span className="text-[hsl(var(--primary))] font-bold">🔑</span>
                      <span>Recover via Security Code (Offline)</span>
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 font-bold">
                      Verify using your secret security code and registered mobile number offline.
                    </p>
                  </button>

                  <button onClick=${() => { setRecoveryMode('cloud'); setRecoveryError(''); setRecoverySuccess(''); }} className="w-full text-left p-3.5 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--primary)/0.03)] transition duration-200">
                    <p className="text-xs font-black flex items-center gap-1.5 text-[hsl(var(--foreground))]">
                      <span className="text-[hsl(var(--primary))] font-bold">☁️</span>
                      <span>Restore Backup from Cloud Sync</span>
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 font-bold">
                      Download and unpack your entire database and security settings directly from cloud sync.
                    </p>
                  </button>
                </div>
              ` : ''}

              ${recoveryMode === 'email' ? html`
                <form onSubmit=${handleEmailRecovery} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Registered Email Address</label>
                    <input required type="email" placeholder="Enter your registered recovery email" value=${recEmail} onInput=${e => setRecEmail(e.target.value)} disabled=${recoveryBusy} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                  </div>
                  <button type="submit" disabled=${recoveryBusy || !recEmail} className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition">
                    ${recoveryBusy ? html`<${Loader2} className="animate-spin" size=${16} />` : ''}
                    <span>Verify & Recover Passcode</span>
                  </button>
                  <button type="button" onClick=${() => { setRecoveryMode('select'); setRecoveryError(''); setRecoverySuccess(''); }} className="w-full text-center text-xs font-bold text-[hsl(var(--muted-foreground))] hover:underline mt-2">Back to recovery options</button>
                </form>
              ` : ''}

              ${recoveryMode === 'code' ? html`
                ${recoveredPasscode ? html`
                  <form onSubmit=${handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Set New Secure Passcode</label>
                      <input required type="password" placeholder="Enter new passcode (6+ chars)" value=${recNewPassword} onInput=${e => setRecNewPassword(e.target.value)} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl hover:opacity-90 transition">
                      <span>Reset Passcode & Close</span>
                    </button>
                  </form>
                ` : html`
                  <form onSubmit=${handleCodeRecovery} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Registered Mobile Number</label>
                      <input required type="text" placeholder="Enter registered mobile" value=${recMobile} onInput=${e => setRecMobile(e.target.value)} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Secret Security Code</label>
                      <input required type="password" placeholder="Enter secret security code" value=${recCode} onInput=${e => setRecCode(e.target.value)} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl hover:opacity-90 transition">
                      <span>Verify offline credentials</span>
                    </button>
                    <button type="button" onClick=${() => { setRecoveryMode('select'); setRecoveryError(''); setRecoverySuccess(''); }} className="w-full text-center text-xs font-bold text-[hsl(var(--muted-foreground))] hover:underline mt-2">Back to recovery options</button>
                  </form>
                `}
              ` : ''}

              ${recoveryMode === 'cloud' ? html`
                <form onSubmit=${handleCloudRestore} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Sync Email Identity</label>
                    <input required type="email" placeholder="Enter your Cloud Sync email" value=${recEmail} onInput=${e => setRecEmail(e.target.value)} disabled=${recoveryBusy} className="w-full block px-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition" />
                  </div>
                  <button type="submit" disabled=${recoveryBusy || !recEmail} className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition">
                    ${recoveryBusy ? html`<${Loader2} className="animate-spin" size=${16} />` : ''}
                    <span>Restore and Download Data</span>
                  </button>
                  <button type="button" onClick=${() => { setRecoveryMode('select'); setRecoveryError(''); setRecoverySuccess(''); }} className="w-full text-center text-xs font-bold text-[hsl(var(--muted-foreground))] hover:underline mt-2">Back to recovery options</button>
                </form>
              ` : ''}
            </div>
          ` : html`
            <!-- Regular Forms -->
            <!-- Tabs Switcher -->
            <div className="grid grid-cols-2 p-1 bg-[hsl(var(--muted))] rounded-xl border border-[hsl(var(--border))]">
              <button
                type="button"
                onClick=${() => setActiveTab('passcode')}
                className=${passcodeTabClass}
              >
                <${KeyRound} size=${14} />
                <span>Secret Passcode</span>
              </button>
              <button
                type="button"
                onClick=${() => setActiveTab('cloud')}
                className=${cloudTabClass}
              >
                <${Globe} size=${14} />
                <span>Cloud Account</span>
              </button>
            </div>

            <!-- Passcode Tab Content -->
            ${activeTab === 'passcode' ? html`
              <form onSubmit=${handlePasscodeSubmit} className="space-y-4">
                <div>
                  <label htmlFor="passcode" className="block text-xs font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">
                    Enter Passcode or Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[hsl(var(--muted-foreground))] pointer-events-none">
                      <${Lock} size=${16} />
                    </span>
                    <input
                      id="passcode"
                      type="password"
                      required
                      placeholder="Enter secret passcode"
                      value=${passcode}
                      onInput=${e => setPasscode(e.target.value)}
                      className="w-full block pl-10 pr-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition font-mono tracking-widest text-center"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled=${!passcode}
                  className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition active:scale-[0.98]"
                >
                  <span>Verify & Open App</span>
                  <${ArrowRight} size=${16} />
                </button>

                <div className="flex justify-center pt-1.5">
                  <button
                    type="button"
                    onClick=${() => { setRecoveryMode('select'); setRecoveryError(''); setRecoverySuccess(''); }}
                    className="text-xs font-black text-[hsl(var(--primary))] hover:underline"
                  >
                    Forgot Passcode? Recover Account
                  </button>
                </div>

                <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-xl border border-[hsl(var(--border))] text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))] font-medium text-center">
                  💡 <span className="font-bold">First time?</span> Use default passcode: <code className="font-mono bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded border text-[hsl(var(--primary))] font-black">1234</code> or <code className="font-mono bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded border text-[hsl(var(--primary))] font-black">SMA-2026</code>. 
                  <p className="mt-1">You can customize this secure password anytime in the Settings page under Security.</p>
                </div>
              </form>
            ` : html`
              <!-- Cloud Account Tab Content -->
              <div className="space-y-6">
                <!-- Google Sign-In -->
                <div>
                  <button
                    type="button"
                    disabled=${authBusy}
                    onClick=${handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-[hsl(var(--primary))] text-white font-black text-sm px-4 py-3 rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition active:scale-[0.98]"
                  >
                    <${LogIn} size=${18} />
                    <span>${authBusy ? 'Connecting...' : 'Sign in with Google'}</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[hsl(var(--border))]"></div>
                  </div>
                  <span className="relative px-3 bg-[hsl(var(--card))] text-[10px] font-black uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    or use magic link
                  </span>
                </div>

                <!-- Email Magic Link Form -->
                <form onSubmit=${handleEmailLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[hsl(var(--muted-foreground))] pointer-events-none">
                        <${Mail} size=${16} />
                      </span>
                      <input
                        id="email"
                        type="email"
                        required
                        disabled=${authBusy}
                        placeholder="name@company.com"
                        value=${email}
                        onInput=${e => setEmail(e.target.value)}
                        className="w-full block pl-10 pr-4 py-3 text-sm bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl outline-none focus:border-[hsl(var(--primary))] transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled=${authBusy || !email.includes('@')}
                    className="w-full flex items-center justify-center gap-2 bg-white/10 dark:bg-white/5 hover:bg-white/15 dark:hover:bg-white/10 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] font-black text-sm px-4 py-3 rounded-xl transition disabled:opacity-50 active:scale-[0.98]"
                  >
                    <span>Send Secure Magic Link</span>
                    <${ArrowRight} size=${16} />
                  </button>
                </form>
              </div>
            `}
          `}
        </div>

        <!-- Footer / Notes -->
        <div className="text-center text-[10px] font-bold text-[hsl(var(--muted-foreground))] space-y-1">
          <p>© 2026 ${settings.businessName}. All rights reserved.</p>
          <p>This software operates offline-first. Your transaction logs and ledger database are cached securely in this browser's IndexedDB sandbox.</p>
        </div>
      </div>
    </div>
  `;
}
