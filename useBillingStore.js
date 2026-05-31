/* __imports_rewritten__ */
import { create } from 'https://esm.sh/zustand@5.0.0?deps=react@19.2.0';
import { persist } from 'https://esm.sh/zustand@5.0.0/middleware?deps=react@19.2.0';
import { invoiceTotals } from '../utils/format.js';

const uid = prefix => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const STORE_KEY = 'shree-maheshwara-agencies-offline-v1';
const LIVE_KEY = 'sma-billing-live-update-v1';
const notifyLiveUpdate = () => {
  if (typeof window === 'undefined') return;
  const detail = { at: Date.now() };
  queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail }));
    try { localStorage.setItem(LIVE_KEY, JSON.stringify(detail)); } catch (err) {}
    try {
      if (window.__smaBillingBroadcast) {
        window.__smaBillingBroadcast.postMessage(detail);
      }
    } catch (err) {}
  });
};
const liveSet = (set, patch) => {
  set(patch);
  notifyLiveUpdate();
};

function calcInvoiceTotal(inv) {
  return invoiceTotals(inv).total;
}

const normalizeProduct = item => ({ ...item, files: item.files || [], salePrice: Number(item.salePrice || 0), purchasePrice: Number(item.purchasePrice || 0), taxRate: Number(item.taxRate || 0), stock: Number(item.stock || 0), lowStock: Number(item.lowStock || 25) });
const sameProduct = (a, b) => (String(a.barcode || '').trim() && String(a.barcode || '').trim() === String(b.barcode || '').trim()) || String(a.name || '').trim().toLowerCase() === String(b.name || '').trim().toLowerCase();

export const useBillingStore = create(persist((set, get) => ({
  customers: [],
  items: [],
  invoices: [],
  settings: {
    businessName: 'SHREE MAHESHWARA AGENCIES',
    tagline: '',
    logo: '',
    phone: '',
    email: '',
    address: '',
    gstin: '',
    invoicePrefix: 'SMA-2026',
    currency: '₹',
    darkMode: false,
    accent: 'teal',
    defaultCgstRate: 9,
    defaultSgstRate: 9,
    dueReminderDays: 3,
    fontFamily: 'Inter',
    fontSize: 'Medium',
    fontWeight: 'Normal',
    securityMode: 'private'
  },
  nextInvoiceNumber: () => {
    const prefix = get().settings.invoicePrefix || 'INV';
    const count = get().invoices.length + 1;
    return `${prefix}-${String(count).padStart(4, '0')}`;
  },
  invoiceTotal: calcInvoiceTotal,
  addCustomer: customer => { const id = uid('cust'); liveSet(set, { customers: [{ ...customer, id, balance: 0, updatedAt: Date.now() }, ...get().customers] }); return id; },
  updateCustomer: (id, patch) => liveSet(set, { customers: get().customers.map(c => c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c) }),
  deleteCustomer: id => liveSet(set, { customers: get().customers.filter(c => c.id !== id), items: get().items.filter(i => i.partyId !== id) }),
  addItem: item => {
    const prepared = normalizeProduct(item);
    prepared.updatedAt = Date.now();
    const existing = get().items.find(i => sameProduct(i, prepared));
    if (existing) {
      const mergedFiles = [...(existing.files || []), ...(prepared.files || [])].filter((file, index, list) => list.findIndex(f => f.name === file.name && f.size === file.size) === index);
      liveSet(set, { items: get().items.map(i => i.id === existing.id ? { ...i, ...prepared, id: existing.id, files: mergedFiles, updatedAt: Date.now() } : i) });
      return existing.id;
    }
    const id = uid('item');
    liveSet(set, { items: [{ ...prepared, id, updatedAt: Date.now() }, ...get().items] });
    return id;
  },
  updateItem: (id, patch) => liveSet(set, { items: get().items.map(i => i.id === id ? { ...i, ...patch, files: patch.files === undefined ? (i.files || []) : patch.files, salePrice: patch.salePrice === undefined ? i.salePrice : Number(patch.salePrice), purchasePrice: patch.purchasePrice === undefined ? i.purchasePrice : Number(patch.purchasePrice), taxRate: patch.taxRate === undefined ? i.taxRate : Number(patch.taxRate), stock: patch.stock === undefined ? i.stock : Number(patch.stock), lowStock: patch.lowStock === undefined ? i.lowStock : Number(patch.lowStock), updatedAt: Date.now() } : i) }),
  deleteItem: id => liveSet(set, { items: get().items.filter(i => i.id !== id) }),
  addInvoice: invoice => liveSet(set, { invoices: [{ ...invoice, id: uid('inv'), updatedAt: Date.now() }, ...get().invoices] }),
  updateInvoice: (id, patch) => liveSet(set, { invoices: get().invoices.map(inv => inv.id === id ? { ...inv, ...patch, updatedAt: Date.now() } : inv) }),
  deleteInvoice: id => liveSet(set, { invoices: get().invoices.filter(inv => inv.id !== id) }),
  updateSettings: patch => {
    const nextSettings = { ...get().settings, ...patch };
    nextSettings.securityMode = 'private'; // enforce private mode always
    liveSet(set, { settings: nextSettings });
  },
  importData: data => {
    const nextSettings = { ...get().settings, ...(data.settings || {}) };
    nextSettings.securityMode = 'private'; // enforce private mode always
    liveSet(set, { customers: data.customers || [], items: (data.items || []).map(i => normalizeProduct(i)), invoices: data.invoices || [], settings: nextSettings });
  }
}), { name: STORE_KEY }));

if (typeof window !== 'undefined') {
  const rehydrateLive = () => {
    useBillingStore.persist.rehydrate();
    window.dispatchEvent(new CustomEvent('sma-billing-live-refresh', { detail: { at: Date.now() } }));
  };
  try {
    window.__smaBillingBroadcast = new BroadcastChannel('sma-billing-live');
    window.__smaBillingBroadcast.onmessage = rehydrateLive;
  } catch (err) {}
  window.addEventListener('storage', event => {
    if (event.key === STORE_KEY || event.key === LIVE_KEY) rehydrateLive();
  });
  window.addEventListener('focus', rehydrateLive);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) rehydrateLive(); });
}
