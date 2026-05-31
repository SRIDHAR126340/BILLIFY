/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from '../jsx.js';
import {Plus, WalletCards} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { money, today } from '../utils/format.js';
import { useBillingStore } from '../store/useBillingStore.js';

export function Expenses() {
  const settings = useBillingStore(s => s.settings);
  const [expenses, setExpenses] = React.useState(() => JSON.parse(localStorage.getItem('sma-expenses') || '[]'));
  const [form, setForm] = React.useState({ date: today(), category: '', vendor: '', amount: '', notes: '' });
  const save = () => {
    if (!form.category.trim() || Number(form.amount || 0) <= 0) return alert('Please enter expense category and amount.');
    const next = [{ ...form, amount: Number(form.amount || 0), id: `exp_${Date.now()}` }, ...expenses];
    setExpenses(next);
    localStorage.setItem('sma-expenses', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
    setForm({ date: today(), category: '', vendor: '', amount: '', notes: '' });
  };
  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  return html`
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="card p-5">
        <h3 className="flex items-center gap-2 text-lg font-black"><${WalletCards} size=${19} /> Add Expense</h3>
        <div className="mt-4 space-y-3">
          <input type="date" value=${form.date} onInput=${e => setForm({ ...form, date: e.target.value })} className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <input value=${form.category} onInput=${e => setForm({ ...form, category: e.target.value })} placeholder="Category (Rent, Transport, Salary...)" className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <input value=${form.vendor} onInput=${e => setForm({ ...form, vendor: e.target.value })} placeholder="Paid to / Vendor" className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <input type="number" value=${form.amount} onInput=${e => setForm({ ...form, amount: e.target.value === '' ? '' : Number(e.target.value) })} placeholder="Amount" className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
          <textarea value=${form.notes} onInput=${e => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="focus-ring min-h-24 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3"></textarea>
          <button onClick=${save} className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white"><${Plus} size=${18} /> Save Expense</button>
        </div>
      </div>
      <div className="card overflow-hidden lg:col-span-2">
        <div className="flex items-center justify-between border-b border-[hsl(var(--border))] p-5"><h3 className="font-black">Expenses Register</h3><p className="text-lg font-black text-[hsl(var(--primary))]">${money(total, settings.currency)}</p></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]"><tr><th className="p-4">Date</th><th className="p-4">Category</th><th className="p-4">Vendor</th><th className="p-4">Notes</th><th className="p-4 text-right">Amount</th></tr></thead><tbody>${expenses.map(e => html`<tr key=${e.id} className="border-t border-[hsl(var(--border))]"><td className="p-4">${e.date}</td><td className="p-4 font-black">${e.category}</td><td className="p-4">${e.vendor || '-'}</td><td className="p-4">${e.notes || '-'}</td><td className="p-4 text-right font-black">${money(e.amount, settings.currency)}</td></tr>`)}</tbody></table>${expenses.length === 0 ? html`<p className="p-8 text-center text-sm text-[hsl(var(--muted-foreground))]">No expenses added yet.</p>` : ''}</div>
      </div>
    </div>`;
}
