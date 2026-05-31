/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from '../jsx.js';
import {Plus, Trash2, Pencil, Save, BookOpen, Upload, Loader2, CheckCircle2, AlertCircle, X} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { money, invoiceTotals } from '../utils/format.js';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const empty = { name: '', hsn: '', unit: 'pcs', category: '', barcode: '', salePrice: '', purchasePrice: '', taxRate: '', stock: '', lowStock: '' , files: [] };
const numberFields = ['purchasePrice','salePrice','taxRate','stock','lowStock'];
const productFields = ['name','category','barcode','hsn','unit','purchasePrice','salePrice','taxRate','stock','lowStock'];
const unitOptions = ['pcs','box','kg','g','ltr','ml','medium','feet','roll','bundle','bag','packet','carton','dozen','set','pair','job','service'];
const placeholders = {
  name: 'Product name (Example: LED Bulb 12W)',
  category: 'Category (Electrical / Grocery / Service)',
  barcode: 'Barcode / SKU code',
  hsn: 'HSN / SAC code',
  unit: 'Select unit',
  purchasePrice: 'Purchase price',
  salePrice: 'Sale price',
  taxRate: 'GST / Tax %',
  stock: 'Opening stock quantity',
  lowStock: 'Low stock alert limit'
};

const mapParsedItem = (raw) => {
  const getVal = (keys) => {
    for (const key of Object.keys(raw)) {
      const normalizedKey = key.trim().toLowerCase();
      if (keys.some(k => normalizedKey === k || normalizedKey.includes(k))) {
        return raw[key];
      }
    }
    return '';
  };

  const name = getVal(['product name', 'item name', 'name', 'title', 'product', 'item']) || '';
  const hsn = getVal(['hsn', 'sac', 'hsn/sac', 'code']) || '';
  const unit = getVal(['unit', 'uom', 'measure']) || 'pcs';
  const category = getVal(['category', 'group', 'type']) || '';
  const barcode = getVal(['barcode', 'sku', 'upc', 'serial']) || '';
  const salePrice = parseFloat(String(getVal(['sale price', 'sale_price', 'price', 'rate', 'mrp']) || '').replace(/[^\d.]/g, '')) || '';
  const purchasePrice = parseFloat(String(getVal(['purchase price', 'purchase_price', 'cost', 'buy price']) || '').replace(/[^\d.]/g, '')) || '';
  const taxRate = parseFloat(String(getVal(['tax rate', 'tax', 'gst', 'tax%', 'gst%']) || '').replace(/[^\d.]/g, '')) || '';
  const stock = parseFloat(String(getVal(['stock', 'qty', 'quantity', 'opening stock']) || '').replace(/[^\d.]/g, '')) || '';
  const lowStock = parseFloat(String(getVal(['low stock', 'min stock', 'alert']) || '').replace(/[^\d.]/g, '')) || 25;

  return {
    name: String(name).trim(),
    hsn: String(hsn).trim(),
    unit: String(unit).trim().toLowerCase() || 'pcs',
    category: String(category).trim(),
    barcode: String(barcode).trim(),
    salePrice: isNaN(salePrice) ? '' : salePrice,
    purchasePrice: isNaN(purchasePrice) ? '' : purchasePrice,
    taxRate: isNaN(taxRate) ? '' : taxRate,
    stock: isNaN(stock) ? '' : stock,
    lowStock: isNaN(lowStock) ? 25 : lowStock
  };
};

const parseCsvOrText = (text) => {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  
  const firstLine = lines[0];
  let separator = ',';
  if (firstLine.includes('\t')) separator = '\t';
  else if (firstLine.includes(';')) separator = ';';
  
  const splitRow = (rowText) => {
    const result = [];
    let insideQuote = false;
    let entry = '';
    for (let i = 0; i < rowText.length; i++) {
      const char = rowText[i];
      if (char === '"' || char === "'") {
        insideQuote = !insideQuote;
      } else if (char === separator && !insideQuote) {
        result.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    result.push(entry.trim());
    return result;
  };

  const headers = splitRow(lines[0]).map(h => h.toLowerCase().replace(/["']/g, '').trim());
  const draftItems = [];
  
  for (let i = 1; i < lines.length; i++) {
    const rowValues = splitRow(lines[i]);
    if (rowValues.length === 0 || !rowValues.some(Boolean)) continue;
    
    const raw = {};
    headers.forEach((header, index) => {
      raw[header] = rowValues[index] || '';
    });
    
    const mapped = mapParsedItem(raw);
    if (mapped.name) {
      draftItems.push(mapped);
    }
  }
  
  return draftItems;
};

// Robust Excel Parser using SheetJS client-side
const parseExcel = async (file) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // 1. Try default object conversion (first row contains headers)
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    if (rows && rows.length > 0 && typeof rows[0] === 'object' && !Array.isArray(rows[0])) {
      const mapped = rows.map(row => mapParsedItem(row)).filter(item => item.name && item.name.trim().length > 0);
      if (mapped.length > 0) {
        return mapped;
      }
    }
    
    // 2. Fallback: convert worksheet to raw array of arrays
    const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    if (rawRows && rawRows.length > 1) {
      const headers = rawRows[0].map(h => String(h || '').trim().toLowerCase());
      const mapped = [];
      for (let i = 1; i < rawRows.length; i++) {
        const row = rawRows[i];
        if (!row || row.length === 0 || !row.some(Boolean)) continue;
        
        const rawObj = {};
        row.forEach((val, colIndex) => {
          const header = headers[colIndex] || `col_${colIndex}`;
          rawObj[header] = val;
        });
        
        const parsed = mapParsedItem(rawObj);
        if (parsed.name) {
          mapped.push(parsed);
        }
      }
      if (mapped.length > 0) {
        return mapped;
      }
    }
    
    throw new Error('No products found in Excel sheet. Ensure columns like "Product Name" or "Name" exist.');
  } catch (err) {
    throw new Error('Excel parsing failed: ' + err.message);
  }
};

const parseProductsFromFile = async (file) => {
  const fileName = file.name.toLowerCase();
  
  // Handle CSV/text
  if (fileName.endsWith('.csv') || fileName.endsWith('.txt') || file.type === 'text/csv' || file.type === 'text/plain') {
    const text = await file.text();
    return parseCsvOrText(text);
  }
  
  // Handle JSON
  if (fileName.endsWith('.json') || file.type === 'application/json') {
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      const list = Array.isArray(data) ? data : (data.items || data.products || []);
      return list.map(item => mapParsedItem(item));
    } catch (err) {
      throw new Error('Invalid JSON format: ' + err.message);
    }
  }

  // Handle Excel Files client-side
  if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
    return await parseExcel(file);
  }

  // Use Document AI for PDF
  if (fileName.endsWith('.pdf')) {
    if (!window.genmb?.docs?.parse) {
      throw new Error('Document AI is currently offline or loading. Please use CSV, Excel, or JSON format instead.');
    }
    
    let res;
    try {
      res = await window.genmb.docs.parse(file, 'generic');
    } catch (err) {
      throw new Error('Document AI failed to parse PDF: ' + err.message);
    }
    
    if (!res) {
      throw new Error('Document AI returned an empty response. Try CSV, Excel, or JSON format instead.');
    }
    
    let draftItems = [];
    
    // Parse tables from Document AI response
    if (res.tables && Array.isArray(res.tables) && res.tables.length > 0) {
      for (const table of res.tables) {
        const rows = table.rows || [];
        if (rows.length === 0) continue;
        
        const tableData = rows.map(r => {
          const cells = Array.isArray(r) ? r : (r.cells || r.values || []);
          return cells.map(c => {
            if (typeof c === 'string') return c;
            if (c && typeof c === 'object') return c.text || c.value || '';
            return '';
          });
        });
        
        if (tableData.length > 0) {
          const headers = tableData[0].map(h => String(h || '').trim().toLowerCase());
          for (let rIndex = 1; rIndex < tableData.length; rIndex++) {
            const row = tableData[rIndex];
            if (row.length === 0 || !row.some(Boolean)) continue;
            
            const rawItem = {};
            row.forEach((val, cIndex) => {
              const header = headers[cIndex] || `col_${cIndex}`;
              rawItem[header] = val;
            });
            
            const item = mapParsedItem(rawItem);
            if (item.name) {
              draftItems.push(item);
            }
          }
        }
      }
    }
    
    // Fallback: Parse lines from res.text if no tables were parsed
    if (draftItems.length === 0 && res.text) {
      const lines = res.text.split('\n').map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        // Split by commas, tabs, pipes, OR multiple spaces (2 or more)
        const parts = line.split(/[,\t|]|\s{2,}/).map(p => p.trim()).filter(Boolean);
        
        // Skip header lines
        const lineLower = line.toLowerCase();
        if (lineLower.includes('product name') || lineLower.includes('item name') || lineLower.includes('price list') || lineLower.includes('rate list')) {
          continue;
        }
        
        if (parts.length >= 2 && parts[0].length > 1) {
          const name = parts[0];
          let hsn = '';
          let unit = 'pcs';
          let salePrice = '';
          let purchasePrice = '';
          let taxRate = '';
          let stock = '';
          let category = 'Imported';
          
          const otherParts = parts.slice(1);
          const numbers = [];
          
          otherParts.forEach(part => {
            const partLower = part.toLowerCase();
            if (unitOptions.includes(partLower)) {
              unit = partLower;
            } else if (part.includes('%')) {
              const parsedTax = parseFloat(part.replace(/[^\d.]/g, ''));
              if (!isNaN(parsedTax)) taxRate = parsedTax;
            } else {
              const cleanVal = part.replace(/[^\d.]/g, '');
              const num = parseFloat(cleanVal);
              if (!isNaN(num)) {
                numbers.push({ raw: part, num: num });
              } else if (part.length > 2 && !hsn && !part.includes(' ')) {
                category = part;
              }
            }
          });
          
          if (numbers.length > 0) {
            numbers.forEach((item, idx) => {
              const val = item.num;
              const rawStr = item.raw;
              
              if (idx === 0 && rawStr.length >= 4 && rawStr.length <= 8 && !rawStr.includes('.') && /^\d+$/.test(rawStr)) {
                hsn = rawStr;
              } else if (!purchasePrice && !salePrice) {
                salePrice = val;
              } else if (salePrice && !purchasePrice) {
                if (val < salePrice) {
                  purchasePrice = val;
                } else {
                  purchasePrice = salePrice;
                  salePrice = val;
                }
              } else if (!stock) {
                stock = val;
              }
            });
          }
          
          draftItems.push({
            name: name,
            hsn: hsn,
            unit: unit,
            category: category,
            barcode: '',
            salePrice: salePrice || '',
            purchasePrice: purchasePrice || '',
            taxRate: taxRate || '',
            stock: stock || '',
            lowStock: 25
          });
        }
      }
    }
    
    draftItems = draftItems.filter(item => item.name && item.name.trim().length > 0);
    if (draftItems.length > 0) {
      return draftItems;
    }
    
    throw new Error('No products could be extracted from the PDF. Check that the PDF contains a list of products.');
  }
  
  throw new Error('Please upload a CSV, JSON, PDF, or Excel file. (Note: Document AI is used for PDF and Excel parsing).');
};

export function Items() {
  const items = useBillingStore(s => s.items);
  const invoices = useBillingStore(s => s.invoices);
  const customers = useBillingStore(s => s.customers);
  const settings = useBillingStore(s => s.settings);
  const addItem = useBillingStore(s => s.addItem);
  const updateItem = useBillingStore(s => s.updateItem);
  const deleteItem = useBillingStore(s => s.deleteItem);
  
  const [form, setForm] = React.useState(empty);
  const [editId, setEditId] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [ledgerItemId, setLedgerItemId] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Bulk import states
  const [draftItems, setDraftItems] = React.useState([]);
  const [importing, setImporting] = React.useState(false);
  const [importSuccess, setImportSuccess] = React.useState('');
  const [importError, setImportError] = React.useState('');
  const fileInputRef = React.useRef(null);

  // Dynamic unique categories extracted from items
  const existingCategories = React.useMemo(() => {
    const cats = new Set();
    items.forEach(i => {
      if (i.category && i.category.trim()) {
        cats.add(i.category.trim());
      }
    });
    return Array.from(cats);
  }, [items]);

  // Real-time search with prioritizing match to front (starts-with matches sorted higher)
  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(i => {
      return String(i.name || '').toLowerCase().includes(q) || 
             String(i.category || '').toLowerCase().includes(q) || 
             String(i.barcode || '').toLowerCase().includes(q) || 
             String(i.hsn || '').toLowerCase().includes(q);
    }).sort((a, b) => {
      const aStarts = String(a.name || '').toLowerCase().startsWith(q) || String(a.category || '').toLowerCase().startsWith(q);
      const bStarts = String(b.name || '').toLowerCase().startsWith(q) || String(b.category || '').toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
  }, [items, searchQuery]);

  const ledgerRows = React.useMemo(() => {
    if (!ledgerItemId) return [];
    const item = items.find(i => i.id === ledgerItemId);
    if (!item) return [];
    return invoices.flatMap(inv => (inv.items || []).filter(line => (line.itemId && line.itemId === item.id) || (!line.itemId && String(line.name || '').trim().toLowerCase() === String(item.name || '').trim().toLowerCase())).map(line => {
      const qty = Number(line.qty || 0);
      const rate = Number(line.price || 0);
      const amount = qty * rate;
      const customer = customers.find(c => c.id === inv.customerId);
      const totals = invoiceTotals(inv);
      return { id: `${inv.id}_${line.itemId || line.name}`, date: inv.date, number: inv.number, party: customer?.name || 'Walk-in / Cash', qty, unit: line.unit || item.unit || 'pcs', rate, amount, invoiceTotal: totals.total, status: inv.status || '-' };
    }));
  }, [ledgerItemId, items, invoices, customers]);

  const ledgerItem = items.find(i => i.id === ledgerItemId);
  const ledgerQty = ledgerRows.reduce((sum, r) => sum + r.qty, 0);
  const ledgerAmount = ledgerRows.reduce((sum, r) => sum + r.amount, 0);

  const save = () => {
    if (!form.name.trim()) { setError('Product name enter pannunga.'); setMessage(''); return; }
    const savedId = editId ? (updateItem(editId, form), editId) : addItem({ ...form, lowStock: form.lowStock === '' ? 25 : form.lowStock });
    setLedgerItemId(savedId);
    setForm(empty);
    setEditId('');
    setError('');
    setMessage('');
  };

  const edit = item => { setEditId(item.id); setForm({ ...empty, ...item, files: item.files || [] }); setLedgerItemId(item.id); setMessage(''); setError(''); };
  const remove = item => { deleteItem(item.id); if (ledgerItemId === item.id) setLedgerItemId(''); };
  const handleKeyDown = e => { if (e.key === 'Enter') { e.preventDefault(); save(); } };

  // Bulk import handlers
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    setImportSuccess('');
    setImporting(true);
    try {
      const parsed = await parseProductsFromFile(file);
      if (parsed.length === 0) {
        throw new Error('No valid products found in the file.');
      }
      setDraftItems(parsed);
      setImportSuccess(`Parsed ${parsed.length} products successfully. Review below and import!`);
    } catch (err) {
      setImportError(err.message || 'File parse panna mudiyala. Confirm formats.');
    } finally {
      setImporting(false);
      e.target.value = ''; // Reset input
    }
  };

  const updateDraftItem = (index, field, value) => {
    setDraftItems(prev => prev.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
  };

  const removeDraftItem = (index) => {
    setDraftItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const importAllDraftItems = () => {
    setImporting(true);
    setImportError('');
    setImportSuccess('');
    try {
      let count = 0;
      for (const draft of draftItems) {
        if (!draft.name || !draft.name.trim()) continue;
        addItem(draft);
        count++;
      }
      setImportSuccess(`${count} products successfully added to your list!`);
      setDraftItems([]);
    } catch (err) {
      setImportError('Import failed: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  return html`<div className="grid gap-5 lg:grid-cols-3">
    <div className="flex flex-col gap-5">
      <!-- MAIN PRODUCT FORM -->
      <div className="card p-5">
        <h3 className="text-lg font-black">${editId ? 'Edit Product' : 'Add New Product'}</h3>
        ${message ? html`<p className="mt-3 rounded bg-emerald-500/10 p-2 text-xs font-bold text-emerald-600">${message}</p>` : ''}
        ${error ? html`<p className="mt-3 rounded bg-red-500/10 p-2 text-xs font-bold text-red-600">${error}</p>` : ''}
        <div className="mt-4 grid gap-3" onKeyDown=${handleKeyDown}>
          <input value=${form.name} onInput=${e => setForm({ ...form, name: e.target.value })} placeholder=${placeholders.name} aria-label="Product name" className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <div className="grid grid-cols-2 gap-2">
            ${productFields.filter(field => field !== 'name').map(field => {
              if (field === 'unit') {
                return html`<select key=${field} value=${form.unit || 'pcs'} onChange=${e => setForm({ ...form, unit: e.target.value })} aria-label="Product unit" className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  <option value="">${placeholders.unit}</option>
                  ${unitOptions.map(unit => html`<option key=${unit} value=${unit}>${unit}</option>`)}
                </select>`;
              } else if (field === 'category') {
                const currentCat = form.category || '';
                const isPreset = ['ELECTRICAL', 'HARDWARE', 'PLUMBING', ''].includes(currentCat.toUpperCase());
                
                return html`<div key=${field} className="relative flex flex-col col-span-2 gap-2">
                  <select 
                    value=${isPreset ? currentCat.toUpperCase() : 'CUSTOM'} 
                    onChange=${e => {
                      const val = e.target.value;
                      if (val === 'CUSTOM') {
                        setForm({ ...form, category: 'NEW CATEGORY' });
                      } else {
                        setForm({ ...form, category: val });
                      }
                    }} 
                    aria-label="Product category" 
                    className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3"
                  >
                    <option value="">Select Category</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="HARDWARE">HARDWARE</option>
                    <option value="PLUMBING">PLUMBING</option>
                    <option value="CUSTOM">Other / Custom Category...</option>
                  </select>
                  ${!isPreset && html`<input 
                    value=${currentCat} 
                    onInput=${e => setForm({ ...form, category: e.target.value })} 
                    placeholder="Enter custom category" 
                    className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" 
                  />`}
                </div>`;
              } else {
                return html`<input key=${field} type=${numberFields.includes(field) ? 'number' : 'text'} value=${form[field]} onInput=${e => setForm({ ...form, [field]: numberFields.includes(field) ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value })} placeholder=${placeholders[field]} aria-label=${placeholders[field]} className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />`;
              }
            })}
          </div>
          <button onClick=${save} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white">
            <${editId ? Save : Plus} size=${18} /> ${editId ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>

      <!-- BULK PRODUCT IMPORT CARD -->
      <div className="card p-5">
        <h3 className="text-lg font-black">Bulk Import Products</h3>
        
        ${importSuccess ? html`<div className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-500/10 p-3 text-xs font-bold text-emerald-700">
          <${CheckCircle2} size=${16} className="shrink-0" />
          <span>${importSuccess}</span>
        </div>` : ''}
        
        ${importError ? html`<div className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] bg-red-500/10 p-3 text-xs font-bold text-red-600">
          <${AlertCircle} size=${16} className="shrink-0" />
          <span>${importError}</span>
        </div>` : ''}

        <div className="mt-4">
          <div onClick=${() => fileInputRef.current?.click()} className="border-2 border-dashed border-[hsl(var(--border))] rounded-[var(--radius-md)] p-6 text-center cursor-pointer hover:bg-[hsl(var(--muted)/0.15)] transition-all">
            <${Upload} size=${32} className="mx-auto text-[hsl(var(--muted-foreground))]" />
            <p className="mt-2 text-xs font-bold text-[hsl(var(--foreground))]">Upload Product List</p>
            <p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">PDF, Excel, CSV, or JSON</p>
          </div>
          <input ref=${fileInputRef} type="file" accept=".pdf,.xls,.xlsx,.csv,.json,.txt" onChange=${handleFileUpload} className="hidden" />
          
          ${importing && html`<div className="mt-4 flex items-center justify-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <${Loader2} className="animate-spin text-[hsl(var(--primary))]" size={16} />
            <span>Processing document...</span>
          </div>`}

          ${draftItems.length > 0 && html`<div className="mt-5 border-t border-[hsl(var(--border))] pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[hsl(var(--foreground))]">Parsed Products (${draftItems.length})</span>
              <button onClick=${() => setDraftItems([])} className="text-[10px] font-bold text-red-600 hover:underline">Clear Drafts</button>
            </div>
            
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              ${draftItems.map((item, index) => html`<div key=${index} className="p-3 border border-[hsl(var(--border))] rounded-md bg-[hsl(var(--muted)/0.1)] space-y-2 relative">
                <div className="flex justify-between items-center border-b border-[hsl(var(--border))] pb-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">Draft Item #${index + 1}</span>
                  <button onClick=${() => removeDraftItem(index)} className="text-[hsl(var(--destructive))] hover:opacity-80" aria-label="Remove item">
                    <${Trash2} size=${14} />
                  </button>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Product Name</label>
                    <input value=${item.name} onInput=${e => updateDraftItem(index, 'name', e.target.value)} placeholder="Product Name" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">HSN Code</label>
                      <input value=${item.hsn} onInput=${e => updateDraftItem(index, 'hsn', e.target.value)} placeholder="HSN" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Unit</label>
                      <select value=${item.unit} onChange=${e => updateDraftItem(index, 'unit', e.target.value)} className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                        ${unitOptions.map(u => html`<option key=${u} value=${u}>${u}</option>`)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Purchase</label>
                      <input type="number" value=${item.purchasePrice} onInput=${e => updateDraftItem(index, 'purchasePrice', e.target.value === '' ? '' : Number(e.target.value))} placeholder="Cost" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent text-right" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Sale</label>
                      <input type="number" value=${item.salePrice} onInput=${e => updateDraftItem(index, 'salePrice', e.target.value === '' ? '' : Number(e.target.value))} placeholder="Price" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent text-right" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">GST %</label>
                      <input type="number" value=${item.taxRate} onInput=${e => updateDraftItem(index, 'taxRate', e.target.value === '' ? '' : Number(e.target.value))} placeholder="GST %" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent text-right" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Stock</label>
                      <input type="number" value=${item.stock} onInput=${e => updateDraftItem(index, 'stock', e.target.value === '' ? '' : Number(e.target.value))} placeholder="Stock" className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent text-right" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Category</label>
                      <select 
                        value=${['ELECTRICAL', 'HARDWARE', 'PLUMBING', ''].includes((item.category || '').toUpperCase()) ? (item.category || '').toUpperCase() : 'CUSTOM'} 
                        onChange=${e => {
                          const val = e.target.value;
                          if (val === 'CUSTOM') {
                            updateDraftItem(index, 'category', 'NEW CATEGORY');
                          } else {
                            updateDraftItem(index, 'category', val);
                          }
                        }} 
                        className="w-full text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                      >
                        <option value="">Select Category</option>
                        <option value="ELECTRICAL">ELECTRICAL</option>
                        <option value="HARDWARE">HARDWARE</option>
                        <option value="PLUMBING">PLUMBING</option>
                        <option value="CUSTOM">Custom...</option>
                      </select>
                      ${!['ELECTRICAL', 'HARDWARE', 'PLUMBING', ''].includes((item.category || '').toUpperCase()) && html`<input 
                        value=${item.category} 
                        onInput=${e => updateDraftItem(index, 'category', e.target.value)} 
                        placeholder="Enter custom category" 
                        className="w-full mt-1 text-xs p-1.5 rounded border border-[hsl(var(--border))] bg-transparent" 
                      />`}
                    </div>
                  </div>
                </div>
              </div>`)}
            </div>
            
            <button onClick=${importAllDraftItems} disabled=${importing} className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2.5 font-black text-white text-xs">
              <${Plus} size=${14} /> Add Parsed Products to App List
            </button>
          </div>`}
        </div>
      </div>
    </div>

    <!-- PRODUCTS TABLE AND LEDGER WITH SEARCH AND COUNT METRICS -->
    <div className="card overflow-hidden lg:col-span-2 p-5 flex flex-col gap-4">
      <!-- COUNT METRICS ROW -->
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[hsl(var(--muted)/0.3)] p-4 rounded-[var(--radius-md)]">
        <div className="text-center sm:text-left border-r last:border-r-0 border-[hsl(var(--border))] pr-2">
          <span className="block text-[10px] uppercase font-black text-[hsl(var(--muted-foreground))]">Total Products</span>
          <span className="text-xl font-black text-[hsl(var(--foreground))]">${items.length}</span>
        </div>
        <div className="text-center sm:text-left border-r last:border-r-0 border-[hsl(var(--border))] px-2">
          <span className="block text-[10px] uppercase font-black text-[hsl(var(--muted-foreground))]">Categories</span>
          <span className="text-xl font-black text-[hsl(var(--foreground))]">${existingCategories.length}</span>
        </div>
        <div className="text-center sm:text-left border-r last:border-r-0 border-[hsl(var(--border))] px-2">
          <span className="block text-[10px] uppercase font-black text-[hsl(var(--muted-foreground))]">Low Stock Alert</span>
          <span className="text-xl font-black text-red-600">${items.filter(i => Number(i.stock || 0) <= Number(i.lowStock || 25)).length}</span>
        </div>
        <div className="text-center sm:text-left pl-2">
          <span className="block text-[10px] uppercase font-black text-[hsl(var(--muted-foreground))]">Stock Value</span>
          <span className="text-xl font-black text-emerald-600">
            ${money(items.reduce((sum, i) => sum + (Number(i.stock || 0) * Number(i.salePrice || 0)), 0), settings.currency)}
          </span>
        </div>
      </div>

      <!-- SEARCH BAR ROW -->
      <div className="border-b border-[hsl(var(--border))] pb-3 flex items-center justify-start">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[hsl(var(--muted-foreground))]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            value=${searchQuery} 
            onInput=${e => setSearchQuery(e.target.value)} 
            placeholder="Search name, category, barcode..." 
            className="focus-ring pl-11 pr-8 py-2 w-full text-xs rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] placeholder-[hsl(var(--muted-foreground))] font-medium transition-all" 
          />
          ${searchQuery && html`<button onClick=${() => setSearchQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <${X} size=${14} />
          </button>`}
        </div>
      </div>

      <!-- COMPACT VERTICALLY & HORIZONTALLY SCROLLABLE PRODUCT LIST TABLE -->
      <div className="overflow-auto max-h-[500px] border border-[hsl(var(--border))] rounded-[var(--radius-md)] relative bg-[hsl(var(--card))]">
        <table className="w-full min-w-[920px] text-xs border-collapse">
          <thead className="sticky top-0 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] text-left uppercase text-[hsl(var(--muted-foreground))] z-10 font-bold">
            <tr>
              <th className="py-2.5 px-3 whitespace-nowrap">Product</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Category</th>
              <th className="py-2.5 px-3 whitespace-nowrap">HSN</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Stock</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Purchase</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Sale</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">GST</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Ledger</th>
              <th className="py-2.5 px-3 whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            ${filteredItems.map(i => html`<tr key=${i.id} className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.15)] bg-[hsl(var(--card))]">
              <td className="py-2.5 px-3 font-black">
                ${i.name || '-'}
                ${Number(i.stock || 0) <= Number(i.lowStock || 25) ? html`<span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-black text-red-700">LOW</span>` : ''}
              </td>
              <td className="py-2.5 px-3 text-[11px]">${i.category || '-'}</td>
              <td className="py-2.5 px-3 text-[11px]">${i.hsn || '-'}</td>
              <td className="py-2.5 px-3 text-[11px]">
                <span className="font-bold">${i.stock ?? 0}</span> ${i.unit || 'pcs'}
                <div className="text-[9px] text-[hsl(var(--muted-foreground))]">Limit: ${i.lowStock || 25}</div>
              </td>
              <td className="py-2.5 px-3 text-right text-[11px]">${money(i.purchasePrice, settings.currency)}</td>
              <td className="py-2.5 px-3 text-right font-bold text-[11px] text-[hsl(var(--primary))]">${money(i.salePrice, settings.currency)}</td>
              <td className="py-2.5 px-3 text-right text-[11px]">${i.taxRate || 0}%</td>
              <td className="py-2.5 px-3 text-right">
                <button onClick=${() => setLedgerItemId(ledgerItemId === i.id ? '' : i.id)} className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] px-2.5 py-0.5 text-[10px] font-black text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/0.05] transition-all" aria-label=${`Open ledger for ${i.name}`}>
                  <${BookOpen} size=${12} /> Ledger
                </button>
              </td>
              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                <button onClick=${() => edit(i)} className="mr-2.5 text-[hsl(var(--primary))] hover:opacity-80" aria-label=${`Edit ${i.name}`}><${Pencil} size=${14} /></button>
                <button onClick=${() => remove(i)} className="text-[hsl(var(--destructive))] hover:opacity-80" aria-label=${`Delete ${i.name}`}><${Trash2} size=${14} /></button>
              </td>
            </tr>`)}
          </tbody>
        </table>
        ${filteredItems.length === 0 ? html`<p className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">No products found.</p>` : ''}
      </div>

      <!-- LEDGER DETAILS CONTAINER WITH COMPACT MAX HEIGHT -->
      ${ledgerItem ? html`<div className="border-t border-[hsl(var(--border))] pt-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-black text-sm">Product Ledger - ${ledgerItem.name}</h3>
          <div className="flex flex-wrap gap-2 text-[10px] font-black">
            <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1">Sold: ${ledgerQty} ${ledgerItem.unit || 'pcs'}</span>
            <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1">Value: ${money(ledgerAmount, settings.currency)}</span>
            <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1">Stock: ${ledgerItem.stock ?? 0} ${ledgerItem.unit || 'pcs'}</span>
          </div>
        </div>
        <div className="overflow-auto max-h-[250px] border border-[hsl(var(--border))] rounded-[var(--radius-md)] relative bg-[hsl(var(--card))]">
          <table className="w-full min-w-[700px] text-xs border-collapse">
            <thead className="sticky top-0 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] text-left uppercase text-[hsl(var(--muted-foreground))] z-10 font-bold">
              <tr>
                <th className="py-2 px-2.5 whitespace-nowrap">Date</th>
                <th className="py-2 px-2.5 whitespace-nowrap">Invoice</th>
                <th className="py-2 px-2.5 whitespace-nowrap">Party</th>
                <th className="py-2 px-2.5 text-right whitespace-nowrap">Qty</th>
                <th className="py-2 px-2.5 text-right whitespace-nowrap">Rate</th>
                <th className="py-2 px-2.5 text-right whitespace-nowrap">Amount</th>
                <th className="py-2 px-2.5 text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              ${ledgerRows.map(r => html`<tr key=${r.id} className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.1)] bg-[hsl(var(--card))]">
                <td className="py-2 px-2.5 text-[11px]">${r.date || '-'}</td>
                <td className="py-2 px-2.5 font-bold text-[11px]">${r.number || '-'}</td>
                <td className="py-2 px-2.5 text-[11px]">${r.party}</td>
                <td className="py-2 px-2.5 text-right text-[11px]">${r.qty} ${r.unit}</td>
                <td className="py-2 px-2.5 text-right text-[11px]">${money(r.rate, settings.currency)}</td>
                <td className="py-2 px-2.5 text-right font-bold text-[11px]">${money(r.amount, settings.currency)}</td>
                <td className="py-2 px-2.5 text-right text-[11px]">${r.status}</td>
              </tr>`)}
            </tbody>
          </table>
          ${ledgerRows.length === 0 ? html`<p className="p-6 text-center text-xs text-[hsl(var(--muted-foreground))]">No ledger records for this product.</p>` : ''}
        </div>
      </div>` : ''}
    </div>
  </div>`;
}
