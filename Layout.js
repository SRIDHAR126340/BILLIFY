/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from '../jsx.js';
import { Link, NavLink, Outlet, useLocation } from 'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0';
import {ReceiptText, Users, Package, Settings, Menu, X, FileText, FileSpreadsheet, ShoppingCart, WalletCards, BarChart3, LogIn, LogOut, Mail, Database, Smartphone, MonitorDown, Download, LayoutDashboard, Wifi, WifiOff, BookOpen, Cloud} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { useAuth } from '../mainProviders.js';

function EmojiIcon({ emoji }) { return html`<span className="text-base leading-none" aria-hidden="true">${emoji}</span>`; }
const CalcNotesIcon = () => html`<${EmojiIcon} emoji="🧮📝" />`;

const navGroups = [
  { title: 'MAIN', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true }, { to: '/tools', label: 'Tools', icon: CalcNotesIcon, end: true }] },
  { title: 'SALES', items: [
    { to: '/invoices', label: 'Invoices', icon: ReceiptText, end: true },
    { to: '/quotations', label: 'Quotations', icon: FileText, end: true },
    { to: '/estimates', label: 'Estimates', icon: FileSpreadsheet, end: true },
    { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, end: true }
  ] },
  { title: 'RECORDS', items: [
    { to: '/customers', label: 'Parties', icon: Users, end: true },
    { to: '/items', label: 'Products', icon: Package, end: true },
    { to: '/ledger', label: 'Ledger', icon: BookOpen, end: true }
  ] },
  { title: 'FINANCE', items: [
    { to: '/expenses', label: 'Expenses', icon: WalletCards, end: true },
    { to: '/reports', label: 'Reports', icon: BarChart3, end: true }
  ] },
  { title: 'DATA & STORAGE', items: [
    { to: '/data', label: 'Data / Backup', icon: Database, end: true }
  ] },
  { title: 'SYSTEM', items: [{ to: '/settings', label: 'Settings', icon: Settings, end: true }] }
];
const flatNav = navGroups.flatMap(g => g.items);

function AccountBox() {
  const { user, authLoading, authBusy, authError, authMessage, signInGoogle, sendEmailLink, signOut } = useAuth();
  const [email, setEmail] = React.useState('');
  if (authLoading) return html`<div className="rounded-lg bg-white/5 p-3 text-xs font-bold text-[hsl(var(--sidebar-muted))]">Loading login...</div>`;
  return html`<div className="rounded-lg bg-white/5 p-3 text-xs text-[hsl(var(--sidebar-muted))]">
    ${user ? html`<div><div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] grid place-items-center text-white font-black">${user.name ? user.name[0] : user.email[0]}</div><div><p className="font-black text-white truncate max-w-[120px]">${user.name || user.email}</p><p className="mt-0.5 truncate text-[10px] text-[hsl(var(--sidebar-muted))]">${user.email}</p></div></div><button disabled=${authBusy} onClick=${signOut} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 font-black text-white disabled:opacity-50 hover:bg-white/20"><${LogOut} size=${14} /> Logout</button></div>` : html`<div><p className="font-black text-white">Cloud Account</p><button disabled=${authBusy || !window.genmb?.auth} onClick=${signInGoogle} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary))] px-3 py-2 font-black text-white disabled:opacity-50 shadow-lg"><${LogIn} size=${14} /> ${authBusy ? 'Connecting...' : 'Google Login'}</button><div className="mt-2 flex gap-1"><input disabled=${authBusy || !window.genmb?.auth} type="email" value=${email} onInput=${e => setEmail(e.target.value)} placeholder="Email address" className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/10 px-2 py-2 text-white placeholder:text-white/40 focus:border-[hsl(var(--primary))] outline-none" /><button disabled=${authBusy || !window.genmb?.auth} onClick=${() => sendEmailLink(email)} className="rounded-md bg-white/10 px-2 text-white disabled:opacity-50 hover:bg-white/20" title="Send magic link"><${Mail} size=${14} /></button></div></div>`}
    ${authError ? html`<p className="mt-2 rounded bg-red-500/15 p-2 text-[10px] text-red-200">${authError}</p>` : ''}
    ${authMessage ? html`<p className="mt-2 rounded bg-emerald-500/15 p-2 text-[10px] text-emerald-100">${authMessage}</p>` : ''}
  </div>`;
}

export function Layout() {
  const location = useLocation();
  const settings = useBillingStore(s => s.settings);
  const { user } = useAuth();
  const [installPrompt, setInstallPrompt] = React.useState(null);
  const [installMessage, setInstallMessage] = React.useState('');
  const [installBusy, setInstallBusy] = React.useState(false);
  const [shortcutFile, setShortcutFile] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [showSyncSuccess, setShowSyncSuccess] = React.useState(false);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  // Sync registered email address from secure account dynamically
  const [registeredEmail, setRegisteredEmail] = React.useState(() => {
    try {
      const acc = JSON.parse(localStorage.getItem('sma-secure-account-v1') || '{}');
      return acc.email || '';
    } catch {
      return '';
    }
  });

  const activeSyncEmail = user?.email || registeredEmail;
  
  const [cloudSyncState, setCloudSyncState] = React.useState(() => {
    return localStorage.getItem('sma-last-sync-status') || 'idle';
  });

  const title = flatNav.find(n => n.to === location.pathname)?.label || (location.pathname.includes('invoices') ? 'Invoices' : 'Invoices');
  const showHeaderNewInvoice = location.pathname === '/invoices/new';
  const showInstallAction = false; // Disabled/removed 'Download App' option from the layout header

  React.useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  React.useEffect(() => () => { if (shortcutFile?.url) URL.revokeObjectURL(shortcutFile.url); }, [shortcutFile?.url]);

  React.useEffect(() => {
    const handleOnline = () => { setIsOnline(true); setShowSyncSuccess(true); setTimeout(() => setShowSyncSuccess(false), 3000); };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const onBeforeInstallPrompt = event => { event.preventDefault(); setInstallPrompt(event); setInstallMessage(''); };
    const onInstalled = () => { setInstallPrompt(null); setShortcutFile(null); setInstallMessage('App installed successfully.'); };
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    
    const handleUpdate = () => setUpdateAvailable(true);
    window.addEventListener('sma-update-available', handleUpdate);

    return () => { 
      window.removeEventListener('online', handleOnline); 
      window.removeEventListener('offline', handleOffline); 
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt); 
      window.removeEventListener('appinstalled', onInstalled); 
      window.removeEventListener('sma-update-available', handleUpdate);
    };
  }, []);

  React.useEffect(() => {
    const handleSyncStatus = (e) => {
      setCloudSyncState(e.detail?.state || 'idle');
    };
    window.addEventListener('sma-cloud-sync-status', handleSyncStatus);
    
    // Also listen to the live update to show "syncing" briefly
    const handleLiveUpdate = () => {
      try {
        const acc = JSON.parse(localStorage.getItem('sma-secure-account-v1') || '{}');
        setRegisteredEmail(acc.email || '');
      } catch {}

      const enabled = localStorage.getItem('sma-auto-cloud-sync-enabled') !== 'false';
      if (navigator.onLine && (user?.email || registeredEmail) && enabled) {
        setCloudSyncState('syncing');
      }
    };
    window.addEventListener('sma-billing-live-update', handleLiveUpdate);

    return () => {
      window.removeEventListener('sma-cloud-sync-status', handleSyncStatus);
      window.removeEventListener('sma-billing-live-update', handleLiveUpdate);
    };
  }, [user, registeredEmail]);

  const clickDownload = (href, fileName) => {
    const a = document.createElement('a'); a.href = href; a.download = fileName; a.target = '_self'; a.rel = 'noopener'; a.style.position = 'fixed'; a.style.left = '-9999px'; a.style.top = '0'; document.body.appendChild(a); a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); setTimeout(() => a.remove(), 1000);
  };

  const downloadShortcut = () => {
    if (shortcutFile?.url) URL.revokeObjectURL(shortcutFile.url);
    const baseUrl = String(window.location.href || '').split('#')[0] || './index.html';
    const appUrl = `${baseUrl}#/invoices`;
    const shortcutHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${appUrl}"><title>SHREE MAHESHWARA AGENCIES Billing</title></head><body><p>Opening SHREE MAHESHWARA AGENCIES Billing...</p><script>location.replace('${appUrl}');<\/script></body></html>`;
    const blob = new Blob([shortcutHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const file = { url, fileName: 'SHREE_MAHESHWARA_AGENCIES_Billing_App.html' };
    setShortcutFile(file);
    clickDownload(url, file.fileName);
    return file;
  };

  const installApp = async () => {
    setInstallBusy(true); setInstallMessage('');
    try {
      if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || window.desktopApp?.isElectron) { setInstallMessage('App already installed / running in app mode.'); return; }
      if (installPrompt) { installPrompt.prompt(); const choice = await installPrompt.userChoice; setInstallPrompt(null); if (choice.outcome === 'accepted') { setInstallMessage('Install started.'); return; } }
      downloadShortcut(); setInstallMessage('Shortcut download started.');
    } catch (error) { try { downloadShortcut(); setInstallMessage('Shortcut download started.'); } catch (err) { setInstallMessage('Download failed. Please try again.'); } } finally { setInstallBusy(false); }
  };

  const sidebarContent = html`<${React.Fragment}>
    <${Link} to="/dashboard" className="flex h-[76px] items-center gap-3 border-b border-white/10 px-4 no-underline">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary))] text-white shadow-[var(--shadow-sm)] overflow-hidden">${settings.logo ? html`<img src=${settings.logo} className="h-full w-full object-contain" />` : html`<${ReceiptText} size=${22} />`}</div>
      <div className="min-w-0"><p className="truncate text-base font-black tracking-tight text-white">${settings.businessName}</p></div>
    </${Link}>
    <nav className="flex-1 overflow-y-auto px-2 py-4">${navGroups.map(group => html`<div key=${group.title} className="mb-5"><p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/32">${group.title}</p><div className="space-y-1">${group.items.map(item => { const Icon = item.icon; return html`<${NavLink} key=${`${group.title}-${item.label}`} to=${item.to} end=${item.end} className=${({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black transition-all duration-200 no-underline ${isActive ? 'bg-[hsl(var(--primary))] text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] active-sidebar-item' : 'text-[hsl(var(--sidebar-muted))] hover:bg-white/10 hover:text-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]'}`}><${Icon} />${item.label}</${NavLink}>`; })}</div></div>`)}</nav>
    <div className="space-y-3 border-t border-white/10 p-4"><${AccountBox} /><div className="text-xs"><p className="truncate font-black text-white">${settings.businessName || 'Company Name'}</p><p className="mt-1 text-[hsl(var(--sidebar-muted))]">GSTIN: ${settings.gstin || 'Not Set'}</p></div></div>
  </${React.Fragment}>`;

  return html`<div className="min-h-screen text-[hsl(var(--foreground))]"><aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-[230px] bg-[hsl(var(--sidebar))] lg:flex lg:flex-col">${sidebarContent}</aside>${mobileOpen ? html`<div className="no-print fixed inset-0 z-40 lg:hidden"><button aria-label="Close menu overlay" onClick=${() => setMobileOpen(false)} className="absolute inset-0 h-full w-full bg-black/45"></button><aside className="relative flex h-full w-[270px] flex-col bg-[hsl(var(--sidebar))] shadow-2xl"><button aria-label="Close menu" onClick=${() => setMobileOpen(false)} className="absolute right-3 top-3 z-10 rounded-md bg-white/10 p-2 text-white"><${X} size=${18} /></button>${sidebarContent}</aside></div>` : ''}<main className="lg:pl-[230px]"><header className="no-print sticky top-0 z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-4 sm:px-6"><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><button aria-label="Open navigation menu" onClick=${() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] lg:hidden"><${Menu} size=${18} /></button><div className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-[var(--radius-md)] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]" aria-label="Business logo">${settings.logo ? html`<img src=${settings.logo} alt=${`${settings.businessName || 'Business'} logo`} className="h-full w-full object-contain" />` : html`<${ReceiptText} size=${21} />`}</div><div className="min-w-0"><div className="flex items-center gap-2"><h1 className="truncate text-lg font-black tracking-tight">${title}</h1>${!isOnline && html`<span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-600 border border-red-200"><${WifiOff} size=${10} /> Offline Mode</span>`}${isOnline && showSyncSuccess && html`<span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-600 border border-emerald-200 animate-pulse"><${Wifi} size=${10} /> Syncing...</span>`}${activeSyncEmail && html`<span className=${`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border transition-all ${cloudSyncState === 'syncing' ? 'bg-amber-100 text-amber-600 border-amber-200 animate-pulse' : cloudSyncState === 'error' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`}><${Cloud} size=${10} className=${cloudSyncState === 'syncing' ? 'animate-bounce' : ''} /> <span>${cloudSyncState === 'syncing' ? 'Cloud Syncing...' : cloudSyncState === 'error' ? 'Sync Failed' : 'Cloud Synced'}</span></span>`}</div><p className="hidden truncate text-[11px] font-bold text-[hsl(var(--muted-foreground))] sm:block">${settings.businessName}</p></div></div><div className="flex items-center gap-2">${showInstallAction ? html`<button disabled=${installBusy} onClick=${installApp} className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-black hover:bg-[hsl(var(--muted))] disabled:opacity-50"><${Download} size=${15} /><${Smartphone} size=${15} /><${MonitorDown} size=${15} /> ${installBusy ? 'Checking...' : 'Download App'}</button>` : ''}${showHeaderNewInvoice ? html`<${Link} to="/invoices/new" className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 text-sm font-black text-white shadow-[var(--shadow-sm)] hover:opacity-90 transition no-underline">+ New Invoice</${Link}>` : ''}</div></div>${showInstallAction && installMessage ? html`<div className="mt-3 rounded-[var(--radius-md)] bg-[hsl(var(--primary)/0.10)] px-3 py-2 text-xs font-bold text-[hsl(var(--primary))]">${installMessage}</div>` : ''}<div className="mt-3 flex gap-2 overflow-x-auto lg:hidden">${flatNav.map(item => html`<${NavLink} key=${item.label} to=${item.to} end=${item.end} className=${({ isActive }) => `whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-black no-underline transition-all duration-200 ${isActive ? 'bg-[hsl(var(--primary))] text-white shadow-[0_3px_10px_rgba(0,0,0,0.20)]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:shadow-[0_1px_5px_rgba(0,0,0,0.08)]'}`}>${item.label}</${NavLink}>`)}</div></header><div className="p-4 sm:p-6">${updateAvailable && html`<div className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-lg)] border-2 border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--primary)/0.08)] p-4 text-sm font-black shadow-md"><div className="flex items-center gap-2"><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--primary))] opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(var(--primary))]"></span></span><span className="text-[hsl(var(--foreground))]">Update Available!</span></div><button onClick=${() => { window.dispatchEvent(new CustomEvent('sma-refresh-update-now')); }} className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 text-xs font-black text-white hover:opacity-90 active:scale-95 transition-all">Reload & Sync Now</button></div>`}<${Outlet} /></div></main></div>`;
}
export { flatNav as nav };