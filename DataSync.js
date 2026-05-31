/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import jsPDF from 'https://esm.sh/jspdf';
import autoTable from 'https://esm.sh/jspdf-autotable';
import { html } from '../jsx.js';
import {Database, Download, Upload, HardDrive, ShieldCheck, AlertCircle, Loader2, FolderDown, FileSpreadsheet, FileText, Cloud, RefreshCw, Mail, CheckCircle2} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { useAuth } from '../mainProviders.js';
import { invoiceTotals, money } from '../utils/format.js';
import { syncWorkspace, mergeCustomers, mergeProducts, mergeInvoices, mergeSimple, triggerAutoSync } from '../utils/cloudSync.js';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';
import JSZip from 'https://esm.sh/jszip@3.10.1';

const ACC_KEY = 'sma-secure-account-v1';
const loadAcc = () => { try { return JSON.parse(localStorage.getItem(ACC_KEY) || '{}'); } catch { return {}; } };

export function DataSync() {
  const { customers, items, invoices, settings, importData } = useBillingStore();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState({ type: '', text: '' });
  const [fallbackFile, setFallbackFile] = React.useState(null);
  
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
  const [importSummary, setImportSummary] = React.useState(null);
  const [smartError, setSmartError] = React.useState('');

  const canChooseLocation = Boolean(window.desktopApp?.saveTextFile || window.showSaveFilePicker);
  React.useEffect(() => () => { if (fallbackFile?.url) URL.revokeObjectURL(fallbackFile.url); }, [fallbackFile?.url]);

  React.useEffect(() => {
    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      // Instantly run auto-sync when going online if enabled!
      if (online) {
        const enabled = localStorage.getItem('sma-auto-cloud-sync-enabled') !== 'false';
        const registeredAcc = loadAcc();
        const targetEmail = user?.email || registeredAcc.email || settings.email;
        
        if (enabled && targetEmail && targetEmail.includes('@')) {
          setSyncLoading(true);
          setSyncMsg({ type: 'info', text: 'Device connected online! Automatically syncing & backing up your workspace...' });
          import('../utils/cloudSync.js').then(({ syncWorkspace }) => {
            syncWorkspace(targetEmail).then((res) => {
              setSyncLoading(false);
              if (res.success) {
                setSyncMsg({ type: 'success', text: 'Online Auto-Sync completed! All data backed up to the cloud.' });
              } else {
                setSyncMsg({ type: 'error', text: 'Online Auto-Sync failed: ' + (res.reason || 'Cloud sync error') });
              }
            }).catch(err => {
              setSyncLoading(false);
              setSyncMsg({ type: 'error', text: 'Online Auto-Sync error: ' + err.message });
            });
          });
        }
      }
    };
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [user, settings.email]);

  React.useEffect(() => {
    const handleSyncStatus = (e) => {
      setLastSyncStatus(e.detail?.state || 'idle');
      setLastSyncAt(localStorage.getItem('sma-last-sync-time'));
    };
    window.addEventListener('sma-cloud-sync-status', handleSyncStatus);
    return () => window.removeEventListener('sma-cloud-sync-status', handleSyncStatus);
  }, []);

  const safeJson = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const log = text => { console.log('[LedgerCraftPC Backup]', text); };
  const showSuccess = text => {}; // CRITICAL: NO description message once the functionality works
  const showError = text => setMsg({ type: 'error', text });
  const buildExport = () => { const data = { customers, items, invoices, settings, expenses: safeJson('sma-expenses'), quickNotes: safeJson('sma-quick-notes'), purchaseOrders: safeJson('sma-purchase-orders'), exportDate: new Date().toISOString(), version: '1.0-offline' }; log(`Backup data loaded: ${data.invoices.length} invoices, ${data.customers.length} parties, ${data.items.length} products, ${data.expenses.length} expenses, ${data.purchaseOrders.length} purchase orders`); return data; };
  const esc = value => String(value ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const customerName = id => customers.find(c => c.id === id)?.name || 'Walk-in Customer';
  const verifyBlob = (blob, name) => { if (!(blob instanceof Blob) || blob.size <= 0) throw new Error(`${name} file content was not generated.`); log(`File generated in app memory: ${name}, size ${blob.size} bytes`); return blob; };
  const blobToDataUrl = blob => new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result || '')); r.onerror = () => reject(new Error('Unable to store generated file in app storage.')); r.readAsDataURL(blob); });
  const dataUrlToBlob = dataUrl => { const [meta, raw] = String(dataUrl || '').split(','); if (!raw) throw new Error('Stored backup data is empty.'); const mime = (meta.match(/data:([^;]+)/) || [])[1] || 'application/octet-stream'; const bin = atob(raw); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i); return new Blob([bytes], { type: mime }); };
  const storeTemp = async (fileName, blob) => { const base64 = await blobToDataUrl(blob); const record = { fileName, type: blob.type, size: blob.size, base64, createdAt: new Date().toISOString(), temporaryPath: `localStorage://ledgercraftpc-last-backup-file/${fileName}` }; localStorage.setItem('ledgercraftpc-last-backup-file', JSON.stringify(record)); log(`Temporary path: ${record.temporaryPath}`); return record; };
  const verifyDesktopResult = (result, fileName) => { if (result?.canceled) throw new Error('Save cancelled.'); if (result?.error) throw new Error(result.error); if (!result?.filePath) throw new Error('Exported file path was not created.'); log(`Exported path: ${result.filePath}`); log(`File size: ${Number(result.size || 0)} bytes`); if (!result.exists || Number(result.size || 0) <= 0) throw new Error('Saved file could not be verified or file size is zero.'); log(`Export status: ${result.status || 'exported'}`); showSuccess(`Exported to device storage: ${result.filePath}`); };
  const createBrowserDownload = async (blob, fileName, label) => { verifyBlob(blob, label); const temp = await storeTemp(fileName, blob); const url = URL.createObjectURL(blob); if (!String(url).startsWith('blob:')) throw new Error(`${label} object URL creation failed.`); if (fallbackFile?.url) URL.revokeObjectURL(fallbackFile.url); setFallbackFile({ url, fileName, type: blob.type }); const a = document.createElement('a'); a.href = url; a.download = fileName; a.target = '_self'; a.style.position = 'fixed'; a.style.left = '-9999px'; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 500); log(`Exported path: browser Downloads/${fileName}`); log(`File size: ${blob.size} bytes`); log('Export status: browser download requested; browser controls final filesystem verification'); showSuccess(`Export requested to device Downloads: ${fileName}.`); return temp; };
  const saveWithPicker = async (blob, fileName, description, accept) => { verifyBlob(blob, fileName); await storeTemp(fileName, blob); const handle = await window.showSaveFilePicker({ suggestedName: fileName, types: [{ description, accept }] }); const writable = await handle.createWritable(); await writable.write(blob); await writable.close(); const savedFile = await handle.getFile(); log(`Exported path: ${handle.name || fileName}`); log(`File size: ${savedFile.size} bytes`); if (!savedFile.size) throw new Error('Saved file could not be verified or file size is zero.'); log('Export status: exported with native browser Save As'); showSuccess(`Exported to device storage: ${handle.name || fileName}`); };
  const exportFallbackFile = async () => { try { const saved = JSON.parse(localStorage.getItem('ledgercraftpc-last-backup-file') || '{}'); if (!saved.base64 || !saved.size) throw new Error('No generated backup file found in app storage.'); const blob = dataUrlToBlob(saved.base64); verifyBlob(blob, 'Stored backup'); await createBrowserDownload(blob, saved.fileName, 'Stored backup'); } catch (err) { log(`Errors: ${err.message || err}`); showError('Export Backup File failed: ' + (err.message || 'Please generate backup again.')); } };

  const buildExcelHtml = () => { const data = buildExport(); const invoiceRows = data.invoices.map(inv => { const t = invoiceTotals(inv); const itemSummary = (inv.items || []).map(i => `${i.name} x ${i.qty} @ ${i.price}`).join(', '); return `<tr><td>${esc(inv.number)}</td><td>${esc(inv.date)}</td><td>${esc(inv.dueDate)}</td><td>${esc(customerName(inv.customerId))}</td><td>${esc(inv.paymentMode || 'Cash')}</td><td>${esc(inv.status)}</td><td>${t.subtotal}</td><td>${t.tax}</td><td>${t.discount}</td><td>${t.total}</td><td>${t.paid}</td><td>${t.balance}</td><td>${esc(itemSummary)}</td></tr>`; }).join(''); const customerRows = data.customers.map(c => `<tr><td>${esc(c.name)}</td><td>${esc(c.phone)}</td><td>${esc(c.email)}</td><td>${esc(c.gstin)}</td><td>${esc(c.address)}</td></tr>`).join(''); const itemRows = data.items.map(i => `<tr><td>${esc(i.name)}</td><td>${esc(i.category)}</td><td>${esc(i.hsn)}</td><td>${esc(i.unit)}</td><td>${i.purchasePrice || 0}</td><td>${i.salePrice || 0}</td><td>${i.taxRate || 0}</td><td>${i.stock || 0}</td><td>${i.lowStock || 0}</td></tr>`).join(''); const expenseRows = data.expenses.map(e => `<tr><td>${esc(e.date)}</td><td>${esc(e.category)}</td><td>${esc(e.vendor)}</td><td>${e.amount || 0}</td><td>${esc(e.notes)}</td></tr>`).join(''); const poRows = data.purchaseOrders.map(p => `<tr><td>${esc(p.number)}</td><td>${esc(p.date)}</td><td>${esc(p.companyName)}</td><td>${esc(p.contactPerson)}</td><td>${esc(p.emailPhone)}</td><td>${esc(p.productService)}</td><td>${esc(p.quantity)}</td><td>${esc(p.details)}</td></tr>`).join(''); return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial}table{border-collapse:collapse;margin:18px 0;width:100%}th,td{border:1px solid #999;padding:6px}th{background:#eee}.title{font-size:22px;font-weight:bold}</style></head><body><div class="title">${esc(settings.businessName)} - Complete Offline Export</div><p>Export Date: ${esc(new Date().toLocaleString())}</p><h2>Business Details</h2><table><tr><th>Name</th><th>Phone</th><th>Email</th><th>GSTIN</th><th>Address</th><th>Invoice Prefix</th></tr><tr><td>${esc(settings.businessName)}</td><td>${esc(settings.phone)}</td><td>${esc(settings.email)}</td><td>${esc(settings.gstin)}</td><td>${esc(settings.address)}</td><td>${esc(settings.invoicePrefix)}</td></tr></table><h2>Invoices</h2><table><tr><th>Invoice No</th><th>Date</th><th>Due Date</th><th>Customer</th><th>Payment</th><th>Status</th><th>Subtotal</th><th>Tax</th><th>Discount</th><th>Total</th><th>Paid</th><th>Balance</th><th>Items</th></tr>${invoiceRows || '<tr><td colspan="13">No invoices</td></tr>'}</table><h2>Parties</h2><table><tr><th>Name</th><th>Phone</th><th>Email</th><th>GSTIN</th><th>Address</th></tr>${customerRows || '<tr><td colspan="5">No parties</td></tr>'}</table><h2>Products</h2><table><tr><th>Name</th><th>Category</th><th>HSN</th><th>Unit</th><th>Purchase</th><th>Sale</th><th>GST %</th><th>Stock</th><th>Low Limit</th></tr>${itemRows || '<tr><td colspan="9">No products</td></tr>'}</table><h2>Expenses</h2><table><tr><th>Date</th><th>Category</th><th>Vendor</th><th>Amount</th><th>Notes</th></tr>${expenseRows || '<tr><td colspan="5">No expenses</td></tr>'}</table><h2>Purchase Orders</h2><table><tr><th>PO No</th><th>Date</th><th>Company</th><th>Contact</th><th>Email / Phone</th><th>Product</th><th>Qty</th><th>Details</th></tr>${poRows || '<tr><td colspan="8">No purchase orders</td></tr>'}</table></body></html>`; };
  
  const buildPdf = () => {
    const data = buildExport();
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const businessName = settings.businessName || 'SHREE MAHESHWARA AGENCIES';
    const timestamp = new Date().toLocaleString();
    const logo = settings.logo;

    const addHeaderAndFooter = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        
        let headerY = 45;
        if (logo) {
          try {
            doc.addImage(logo, 'PNG', 40, 25, 40, 40, undefined, 'FAST');
            doc.text(businessName, 90, 45);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`${settings.address || ''} | ${settings.phone || ''}`, 90, 58);
          } catch (e) {
            doc.text(businessName, 40, 45);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`${settings.address || ''} | ${settings.phone || ''}`, 40, 58);
          }
        } else {
          doc.text(businessName, 40, 45);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
          doc.text(`${settings.address || ''} | ${settings.phone || ''}`, 40, 58);
        }

        // Footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated on: ${timestamp} | LedgerCraft PC Billing`, 40, 810);
        doc.text(`Page ${i} of ${pageCount}`, 510, 810);
        doc.setDrawColor(230, 230, 230);
        doc.line(40, 800, 555, 800);
      }
    };

    let currentY = 85;

    const tableConfig = {
      theme: 'grid',
      headStyles: { fillColor: [75, 85, 99], textColor: 255, fontSize: 9, fontStyle: 'bold', halign: 'center' },
      bodyStyles: { fontSize: 8, textColor: 50 },
      margin: { top: 85, bottom: 65, left: 40, right: 40 },
      styles: { overflow: 'linebreak', cellPadding: 5 },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    };

    const addSectionHeader = (title, y) => {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(title, 40, y);
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(1);
      doc.line(40, y + 4, 120, y + 4);
      return y + 20;
    };

    // 1. Invoices
    currentY = addSectionHeader('INVOICES SUMMARY', currentY);
    const invRows = data.invoices.map(inv => {
      const t = invoiceTotals(inv);
      return [inv.number, inv.date, customerName(inv.customerId), inv.paymentMode || 'Cash', inv.status, money(t.total, settings.currency), money(t.balance, settings.currency)];
    });

    autoTable(doc, {
      ...tableConfig,
      startY: currentY,
      head: [['Number', 'Date', 'Customer', 'Mode', 'Status', 'Amount', 'Balance']],
      body: invRows.length ? invRows : [['No data', '-', '-', '-', '-', '-', '-']]
    });

    currentY = doc.lastAutoTable.finalY + 40;

    // 2. Parties
    if (currentY > 750) { doc.addPage(); currentY = 85; }
    currentY = addSectionHeader('PARTIES / CUSTOMERS', currentY);
    const custRows = data.customers.map(c => [c.name, c.phone || '-', c.email || '-', c.gstin || '-', c.address || '-']);
    autoTable(doc, {
      ...tableConfig,
      startY: currentY,
      head: [['Party Name', 'Phone', 'Email', 'GSTIN', 'Address']],
      body: custRows.length ? custRows : [['No data', '-', '-', '-', '-']]
    });

    currentY = doc.lastAutoTable.finalY + 40;

    // 3. Products
    if (currentY > 750) { doc.addPage(); currentY = 85; }
    currentY = addSectionHeader('PRODUCT CATALOG', currentY);
    const itemRows = data.items.map(i => [i.name, i.hsn || '-', i.unit || 'pcs', money(i.salePrice, settings.currency), i.stock || 0, i.lowStock || 0]);
    autoTable(doc, {
      ...tableConfig,
      startY: currentY,
      head: [['Product Name', 'HSN', 'Unit', 'Price', 'Stock', 'Limit']],
      body: itemRows.length ? itemRows : [['No data', '-', '-', '-', '-', '-']]
    });

    currentY = doc.lastAutoTable.finalY + 40;

    // 4. Expenses
    if (currentY > 750) { doc.addPage(); currentY = 85; }
    currentY = addSectionHeader('EXPENSES TRACKER', currentY);
    const expenseRows = data.expenses.map(e => [e.date || '-', e.category || '-', e.vendor || '-', money(e.amount, settings.currency), e.notes || '-']);
    autoTable(doc, {
      ...tableConfig,
      startY: currentY,
      head: [['Date', 'Category', 'Vendor', 'Amount', 'Notes']],
      body: expenseRows.length ? expenseRows : [['No data', '-', '-', '-', '-']]
    });

    currentY = doc.lastAutoTable.finalY + 40;

    // 5. Purchase Orders
    if (currentY > 750) { doc.addPage(); currentY = 85; }
    currentY = addSectionHeader('PURCHASE ORDERS', currentY);
    const poRows = data.purchaseOrders.map(p => [p.number || '-', p.date || '-', p.companyName || '-', p.productService || '-', p.quantity || '-', p.details || '-']);
    autoTable(doc, {
      ...tableConfig,
      startY: currentY,
      head: [['PO No', 'Date', 'Supplier', 'Product', 'Qty', 'Details']],
      body: poRows.length ? poRows : [['No data', '-', '-', '-', '-', '-']]
    });

    addHeaderAndFooter(doc);
    return doc;
  };

  const saveGeneratedFile = async ({ fileName, label, blob, content, base64, desktopBinary, pickerAccept, pickerDescription }) => { verifyBlob(blob, label); await storeTemp(fileName, blob); if (window.desktopApp?.[desktopBinary ? 'saveBinaryFile' : 'saveTextFile']) { log(`Opening native Save As dialog for ${fileName}`); const result = await window.desktopApp[desktopBinary ? 'saveBinaryFile' : 'saveTextFile']({ fileName, base64, content, dialog: { title: `Choose ${label} save location`, filters: [{ name: label, extensions: [fileName.split('.').pop()] }] } }); verifyDesktopResult(result, fileName); return; } if (window.showSaveFilePicker) { await saveWithPicker(blob, fileName, pickerDescription, pickerAccept); return; } await createBrowserDownload(blob, fileName, label); };
  const runExport = async fn => { setLoading(true); setMsg({ type: '', text: '' }); setFallbackFile(null); try { await fn(); } catch (err) { console.error('[LedgerCraftPC Backup] Export failure', err); log(`Errors: ${err.message || err}`); showError(err.message || 'Export failed.'); } finally { setLoading(false); } };
  const exportExcel = () => runExport(async () => { const fileName = `SHREE_MAHESHWARA_AGENCIES_All_Details_${new Date().toISOString().slice(0, 10)}.xls`; const content = buildExcelHtml(); await saveGeneratedFile({ fileName, label: 'Excel', blob: new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' }), content, pickerDescription: 'Excel File', pickerAccept: { 'application/vnd.ms-excel': ['.xls'] } }); });
  const exportPdf = () => runExport(async () => { const fileName = `SHREE_MAHESHWARA_AGENCIES_All_Details_${new Date().toISOString().slice(0, 10)}.pdf`; const doc = buildPdf(); const blob = doc.output('blob'); const base64 = doc.output('datauristring').split(',')[1]; if (!base64) throw new Error('PDF binary generation failed.'); await saveGeneratedFile({ fileName, label: 'PDF', blob, base64, desktopBinary: true, pickerDescription: 'PDF File', pickerAccept: { 'application/pdf': ['.pdf'] } }); });
  const exportJson = () => runExport(async () => { const fileName = `SHREE_MAHESHWARA_AGENCIES_Backup_${new Date().toISOString().slice(0, 10)}.json`; const content = JSON.stringify(buildExport(), null, 2); await saveGeneratedFile({ fileName, label: 'JSON Backup', blob: new Blob([content], { type: 'application/json;charset=utf-8' }), content, pickerDescription: 'JSON Backup', pickerAccept: { 'application/json': ['.json'] } }); });

  /* Smart Data Importer Parser & Mapper */
  const runSmartImport = async (file) => {
    setLoading(true);
    setSmartError('');
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

      // 1. JSON
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
          // JSON list array
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
      // 2. CSV / TXT
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
      // 3. Excel
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
      // 5. Document AI PDF
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
        
        // Text fallback
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

      // Merge securely
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

      // Write to Zustand store
      importData({
        customers: mergedCustomers,
        items: mergedItems,
        invoices: mergedInvoices,
        settings: mergedSettings
      });

      // Write to standalone localstorage
      localStorage.setItem('sma-purchase-orders', JSON.stringify(mergedPO));
      localStorage.setItem('sma-expenses', JSON.stringify(mergedExpenses));

      setImportSummary({
        customers: parsed.customers.length,
        items: parsed.items.length,
        invoices: parsed.invoices.length,
        purchaseOrders: parsed.purchaseOrders.length,
        expenses: parsed.expenses.length,
        ledger: parsed.invoices.length
      });

      // Automatic cloud sync
      const syncEmail = user?.email || loadAcc().email || mergedSettings.email;
      if (syncEmail && syncEmail.includes('@') && navigator.onLine) {
        triggerAutoSync(syncEmail);
      }

    } catch (err) {
      setSmartError(err.message || 'Smart Import failed.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCloudSync = async () => {
    setSyncLoading(true);
    setSyncMsg({ type: '', text: '' });
    try {
      const registeredAcc = loadAcc();
      const targetEmail = user?.email || registeredAcc.email || settings.email;
      
      if (!targetEmail || !targetEmail.includes('@')) {
        throw new Error('No registered email address found. Please register your email in Settings under "Account Security & Recovery" or configure your business email.');
      }
      
      if (!navigator.onLine) {
        throw new Error('You are currently offline. Internet connection is required for Cloud Sync.');
      }

      // 1. Perform cloud DB workspace sync
      const result = await syncWorkspace(targetEmail, { forceUpload: true });
      if (!result.success) {
        throw new Error(result.reason || 'Cloud Database Sync failed.');
      }

      // 2. Perform Transactional Email Sync
      if (window.genmb?.email) {
        const backupData = buildExport();
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
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.customers.length}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Products / Items</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.items.length}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Invoices</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.invoices.length}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Purchase Orders</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.purchaseOrders.length}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">Expenses</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0d9488;">${backupData.expenses.length}</td>
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
          subject: `SMA Billing Cloud Sync - ${new Date().toLocaleDateString()}`,
          html: htmlContent
        });
      }

      // Update states
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

  const registeredAcc = loadAcc();
  const syncEmail = user?.email || registeredAcc.email || settings.email;
  const fileInputRef = React.useRef(null);

  return html`<div className="space-y-6"><div className="card p-6 bg-[hsl(var(--primary)/0.03)] border-[hsl(var(--primary)/0.2)]"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-2xl font-black"><${Database} className="text-[hsl(var(--primary))]" /> Backup & Export</h2></div>${user ? html`<div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-black text-emerald-600 border border-emerald-500/20"><${ShieldCheck} size=${14} /> Connected: ${user.email}</div>` : html`<div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-black text-amber-600 border border-amber-500/20"><${AlertCircle} size=${14} /> Offline Mode: Local only</div>`}</div></div>

  <!-- Cloud Sync Option -->
  <div className="card p-6 bg-[hsl(var(--primary)/0.04)] border-2 border-[hsl(var(--primary)/0.25)] space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary)/0.1)] grid place-items-center text-[hsl(var(--primary))] font-bold">
          <${Cloud} size=${22} />
        </div>
        <div>
          <h3 className="font-black text-lg text-[hsl(var(--foreground))]">Cloud Database Sync</h3>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] font-bold">
            Keep your devices (PC & Mobile) perfectly in sync. Changes upload immediately and sync automatically on login.
          </p>
        </div>
      </div>
      ${syncEmail ? html`<span className="text-xs bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20 font-black">Active & Secure</span>` : html`<span className="text-xs bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full border border-amber-500/20 font-black">Not Registered</span>`}
    </div>

    ${syncMsg.text && html`
      <div className=${`p-3.5 rounded-lg flex items-center gap-2.5 font-bold text-xs ${syncMsg.type === 'error' ? 'bg-red-500/10 text-red-600' : syncMsg.type === 'info' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
        ${syncMsg.type === 'error' ? html`<${AlertCircle} size=${15} />` : html`<${ShieldCheck} size=${15} />`}
        <span>${syncMsg.text}</span>
      </div>
    `}

    <div className="grid gap-4 md:grid-cols-2 bg-[hsl(var(--card))] p-4 rounded-xl border border-[hsl(var(--border))]">
      <div className="space-y-1">
        <p className="text-xs font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Sync Email ID</p>
        <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate max-w-full">
          ${syncEmail || html`<span className="text-red-500 italic">No registered email address found. (Go to Settings to register secure account email)</span>`}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Sync Status</p>
        <div className="text-sm font-bold text-[hsl(var(--foreground))] flex items-center gap-1.5 mt-0.5">
          ${!isOnline ? html`<span className="flex items-center gap-1 text-xs font-black text-red-600"><span className="text-red-600 text-[14px]">●</span> Offline</span>` : 
            lastSyncStatus === 'syncing' || syncLoading ? html`<span className="flex items-center gap-1 text-xs font-black text-amber-600 animate-pulse"><span className="text-amber-500 text-[14px]">●</span> Syncing</span>` :
            html`<span className="flex items-center gap-1 text-xs font-black text-emerald-600"><span className="text-emerald-500 text-[14px]">●</span> Synced</span>`
          }
          ${lastSyncAt && html`<span className="text-xs text-[hsl(var(--muted-foreground))] font-normal">(${new Date(Number(lastSyncAt)).toLocaleString()})</span>`}
        </div>
      </div>
    </div>

    <!-- Additional Option of Cloud Sync Toggle (User Requested) -->
    <div className="p-4 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-black text-[hsl(var(--foreground))] flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked=${autoSyncEnabled} 
              onChange=${(e) => {
                const checked = e.target.checked;
                setAutoSyncEnabled(checked);
                localStorage.setItem('sma-auto-cloud-sync-enabled', String(checked));
                // Dispatch live-update event so background providers react immediately
                window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
                if (checked && isOnline && syncEmail) {
                  setSyncLoading(true);
                  setSyncMsg({ type: 'info', text: 'Auto-Sync enabled! Starting synchronization...' });
                  import('../utils/cloudSync.js').then(({ syncWorkspace }) => {
                    syncWorkspace(syncEmail).then(res => {
                      setSyncLoading(false);
                      if (res.success) {
                        setSyncMsg({ type: 'success', text: 'Cloud Auto-Sync is now active and data has been fully synchronized.' });
                      } else {
                        setSyncMsg({ type: 'error', text: 'Cloud Sync failed: ' + (res.reason || 'Network error') });
                      }
                    }).catch(err => {
                      setSyncLoading(false);
                      setSyncMsg({ type: 'error', text: 'Cloud Sync error: ' + err.message });
                    });
                  });
                } else {
                  setSyncMsg({ type: 'info', text: checked ? 'Auto-sync enabled. It will trigger automatically when you go online.' : 'Auto-sync disabled. Backup uploads will only occur manually.' });
                }
              }} 
              className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]" 
            />
            <span>Enable Real-Time Cloud Auto-Sync</span>
          </label>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] font-bold pl-6">
            Automatically upload local offline modifications and auto-update/download cloud data whenever your device is online.
          </p>
        </div>
        <span className=${`text-xs px-2.5 py-1 rounded-full font-black ${autoSyncEnabled ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>
          ${autoSyncEnabled ? 'AUTO-SYNC ACTIVE' : 'MANUAL ONLY'}
        </span>
      </div>
    </div>

    <div className="flex justify-end gap-3 pt-2">
      <button 
        disabled=${syncLoading || !syncEmail} 
        onClick=${handleCloudSync} 
        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-6 py-3 font-black text-white disabled:opacity-50 disabled:cursor-not-allowed transition hover:opacity-90 shadow-sm"
      >
        ${syncLoading ? html`<${Loader2} className="animate-spin" size=${18} />` : html`<${RefreshCw} size=${18} />`}
        <span>${syncLoading ? 'Syncing...' : 'Sync to Cloud Now'}</span>
      </button>
    </div>
  </div>

  ${msg.text && html`<div className=${`p-4 rounded-[var(--radius-md)] flex items-center gap-3 font-bold text-sm ${msg.type === 'error' ? 'bg-red-500/15 text-red-600' : 'bg-emerald-500/15 text-emerald-600'}`}>${msg.type === 'error' ? html`<${AlertCircle} size=${18} />` : html`<${ShieldCheck} size=${18} />`}${msg.text}</div>`}${fallbackFile ? html`<div className="rounded-[var(--radius-md)] border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-800"><button onClick=${exportFallbackFile} className="rounded bg-amber-600 px-3 py-2 text-white">Export Backup File</button> <a href=${fallbackFile.url} download=${fallbackFile.fileName} className="ml-2 underline">Direct file link</a></div>` : ''}<div className="card border-[hsl(var(--primary)/0.25)] p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h3 className="font-black">Professional Offline Backup Files</h3></div><div className="grid gap-3 sm:grid-cols-2"><button disabled=${loading} onClick=${exportPdf} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white disabled:opacity-50">${loading ? html`<${Loader2} className="animate-spin" size=${18} />` : html`<${FileText} size=${18} />`} ${canChooseLocation ? 'PDF - Save As' : 'Export PDF to Downloads'}</button><button disabled=${loading} onClick=${exportExcel} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-[hsl(var(--primary))] bg-[hsl(var(--card))] px-5 py-3 font-black text-[hsl(var(--primary))] disabled:opacity-50">${loading ? html`<${Loader2} className="animate-spin" size=${18} />` : html`<${FileSpreadsheet} size=${18} />`} ${canChooseLocation ? 'Excel - Save As' : 'Export Excel to Downloads'}</button></div></div></div>

  <!-- Smart Backup Import Summary Card -->
  ${importSummary && html`
    <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
      <h4 className="font-black text-sm text-emerald-700 flex items-center gap-1.5">
        <${CheckCircle2} size=${18} /> Smart Backup Mapping & Import Completed Successfully!
      </h4>
      <p className="text-xs text-emerald-800 font-bold">
        We have automatically analyzed, categorized and segregated your records safely. No duplicate records were created. Matching IDs or invoice numbers have been successfully updated.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-center text-xs">
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${importSummary.customers}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Parties / Customers</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${importSummary.items}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Products / Items</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${importSummary.invoices}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Invoices</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${importSummary.purchaseOrders}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Purchase Orders</p>
        </div>
        <div className="bg-[hsl(var(--card))] p-3 rounded-lg border border-[hsl(var(--border))]">
          <p className="font-black text-emerald-600 text-xl">${importSummary.ledger}</p>
          <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Ledger Rows</p>
        </div>
      </div>
    </div>
  `}

  ${smartError && html`
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-black flex items-center gap-2.5">
      <${AlertCircle} size=${18} />
      <span>${smartError}</span>
    </div>
  `}

  <div className="card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-slate-100 grid place-items-center text-slate-600"><${HardDrive} /></div>
      <div>
        <h3 className="font-black">Smart Backup Import & Mapping</h3>
        <p className="text-xs text-[hsl(var(--muted-foreground))] font-bold mt-0.5">
          Accepts ZIP, PDF, Excel (.xls/.xlsx), CSV, JSON, TXT. Segregates Customers, Products, Invoices, POs automatically.
        </p>
      </div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      <button disabled=${loading} onClick=${exportJson} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white disabled:opacity-50">
        ${canChooseLocation ? html`<${FolderDown} size=${18} />` : html`<${Download} size=${18} />`} 
        ${canChooseLocation ? 'JSON Backup - Save As' : 'Export JSON to Downloads'}
      </button>
      
      <label className=${`inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 font-black ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[hsl(var(--muted))]'}`}>
        <${Upload} size=${18} />
        <span>${loading ? 'Analyzing Backup...' : 'Import Data / Backup File'}</span>
        <input 
          disabled=${loading} 
          type="file" 
          ref=${fileInputRef}
          accept=".pdf,.xls,.xlsx,.csv,.json,.txt,.zip,application/json,application/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,text/plain" 
          onChange=${e => { const file = e.target.files?.[0]; if (file) runSmartImport(file); }} 
          className="hidden" 
        />
      </label>
    </div>
  </div>

  <div className="card p-6 bg-slate-50 border-dashed">
    <h3 className="font-black text-sm uppercase tracking-wider text-slate-500">Summary</h3>
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
        <p className="text-2xl font-black">${customers.length}</p>
        <p className="text-xs font-bold text-slate-400">Parties</p>
      </div>
      <div>
        <p className="text-2xl font-black">${invoices.length}</p>
        <p className="text-xs font-bold text-slate-400">Invoices</p>
      </div>
      <div>
        <p className="text-2xl font-black">${items.length}</p>
        <p className="text-xs font-bold text-slate-400">Products</p>
      </div>
      <div>
        <p className="text-2xl font-black">${safeJson('sma-purchase-orders').length}</p>
        <p className="text-xs font-bold text-slate-400">Purchase Orders</p>
      </div>
    </div>
  </div>
</div>`;
}
