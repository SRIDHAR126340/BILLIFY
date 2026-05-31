/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from '../jsx.js';
import {Plus, Trash2, Pencil, Save} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { money } from '../utils/format.js';

const emptyProduct = { name: '', hsn: '', unit: 'pcs', category: '', barcode: '', salePrice: '', purchasePrice: '', taxRate: '', discount: '', stock: '', lowStock: 25 };
const emptyParty = { name: '', phone: '', email: '', address: '', gstin: '' };
const unitOptions = ['pcs','box','kg','g','ltr','ml','meter','feet','roll','bundle','bag','packet','carton','dozen','set','pair','job','service'];
const numberProductFields = ['salePrice','purchasePrice','taxRate','discount','stock','lowStock'];
const productPlaceholders = { category: 'Category', hsn: 'HSN / SAC', barcode: 'Barcode / SKU', unit: 'Select unit', salePrice: 'Sale price', purchasePrice: 'Purchase price', taxRate: 'GST %', discount: 'Discount %', stock: 'Opening stock qty', lowStock: 'Low stock limit' };

export function Customers() {
  const customers = useBillingStore(s => s.customers);
  const items = useBillingStore(s => s.items);
  const settings = useBillingStore(s => s.settings);
  const addCustomer = useBillingStore(s => s.addCustomer);
  const updateCustomer = useBillingStore(s => s.updateCustomer);
  const addItem = useBillingStore(s => s.addItem);
  const deleteCustomer = useBillingStore(s => s.deleteCustomer);
  const [form, setForm] = React.useState(emptyParty);
  const [itemForm, setItemForm] = React.useState(emptyProduct);
  const [editId, setEditId] = React.useState('');
  const startEdit = c => { setEditId(c.id); setForm({ name: c.name || '', phone: c.phone || '', email: c.email || '', address: c.address || '', gstin: c.gstin || '' }); setItemForm(emptyProduct); };
  const cancelEdit = () => { setEditId(''); setForm(emptyParty); setItemForm(emptyProduct); };
  const save = () => { if (!form.name.trim()) return; if (editId) { updateCustomer(editId, form); cancelEdit(); return; } const partyId = addCustomer(form); if (itemForm.name.trim()) addItem({ ...itemForm, salePrice: Number(itemForm.salePrice || 0), purchasePrice: Number(itemForm.purchasePrice || 0), taxRate: Number(itemForm.taxRate || 0), discount: Number(itemForm.discount || 0), stock: Number(itemForm.stock || 0), lowStock: Number(itemForm.lowStock || 25), partyId, partyName: form.name }); setForm(emptyParty); setItemForm(emptyProduct); };
  return html`<div className="grid gap-5 lg:grid-cols-3"><div className="card p-5"><h3 className="text-lg font-black">${editId ? 'Edit Party / Customer' : 'Add New Party / Customer'}</h3><div className="mt-4 space-y-3">${['name','phone','email','gstin','address'].map(field => html`<input key=${field} value=${form[field]} onInput=${e => setForm({ ...form, [field]: e.target.value })} placeholder=${field === 'name' ? 'Party / Customer name' : field === 'phone' ? 'Phone number' : field === 'email' ? 'Email address' : field === 'gstin' ? 'GSTIN number' : 'Full address'} className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />`)}${!editId ? html`<div className="rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.55)] p-3"><p className="mb-2 text-sm font-black">Add Product For This Party</p><input value=${itemForm.name} onInput=${e => setItemForm({ ...itemForm, name: e.target.value })} placeholder="Product name for this party" className="focus-ring mb-2 w-full rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2" /><div className="grid grid-cols-2 gap-2">${['category','hsn','barcode','unit','salePrice','purchasePrice','taxRate','discount','stock','lowStock'].map(field => {
    if (field === 'unit') {
      return html`<select key=${field} value=${itemForm.unit || 'pcs'} onChange=${e => setItemForm({ ...itemForm, unit: e.target.value })} className="focus-ring rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2" aria-label="Product unit"><option value="">${productPlaceholders.unit}</option>${unitOptions.map(unit => html`<option key=${unit} value=${unit}>${unit}</option>`)}</select>`;
    } else if (field === 'category') {
      const currentCat = itemForm.category || '';
      const hasCustomCat = currentCat && !['ELECTRICAL', 'HARDWARE', 'PLUMBING'].includes(currentCat.toUpperCase());
      return html`<select key=${field} value=${currentCat.toUpperCase()} onChange=${e => setItemForm({ ...itemForm, category: e.target.value })} className="focus-ring rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2" aria-label="Product category"><option value="">Category</option><option value="ELECTRICAL">ELECTRICAL</option><option value="HARDWARE">HARDWARE</option><option value="PLUMBING">PLUMBING</option>${hasCustomCat ? html`<option value=${currentCat.toUpperCase()}>${currentCat.toUpperCase()}</option>` : ''}</select>`;
    } else {
      return html`<input key=${field} type=${numberProductFields.includes(field) ? 'number' : 'text'} value=${itemForm[field]} onInput=${e => setItemForm({ ...itemForm, [field]: numberProductFields.includes(field) ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value })} placeholder=${productPlaceholders[field]} aria-label=${productPlaceholders[field]} className="focus-ring rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2" />`;
    }
  })}</div></div>` : ''}<div className="grid gap-2 sm:grid-cols-2"><button onClick=${save} className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white"><${editId ? Save : Plus} size=${18} /> ${editId ? 'Update Party' : 'Save Party'}</button>${editId ? html`<button onClick=${cancelEdit} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-3 font-black">Cancel</button>` : ''}</div></div></div><div className="space-y-3 lg:col-span-2">${customers.map(c => { const partyItems = items.filter(i => i.partyId === c.id); return html`<div key=${c.id} className="card p-4"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-lg font-black">${c.name}</p><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">${c.phone || '-'} · ${c.email || '-'}</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">${c.address || '-'} · GSTIN ${c.gstin || '-'}</p></div><div className="flex gap-2"><button onClick=${() => startEdit(c)} className="rounded-[var(--radius-sm)] p-2 text-[hsl(var(--primary))]" title="Edit party"><${Pencil} size=${18} /></button><button onClick=${() => deleteCustomer(c.id)} className="rounded-[var(--radius-sm)] p-2 text-[hsl(var(--destructive))]" title="Delete party"><${Trash2} size=${18} /></button></div></div>${partyItems.length ? html`<div className="mt-4 rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.35)] p-3">${partyItems.map(p => html`<div key=${p.id} className="flex flex-wrap justify-between gap-2 border-t border-[hsl(var(--border))] py-2 text-sm"><span className="font-bold">${p.name}</span><span>${money(p.salePrice, settings.currency)} · ${p.unit || 'pcs'} · GST ${p.taxRate || 0}% · Disc ${p.discount || 0}% · Stock ${p.stock || 0}</span></div>`)}</div>` : ''}</div>`; })}</div></div>`;
}
