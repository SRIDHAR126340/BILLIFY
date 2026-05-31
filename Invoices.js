/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from '../jsx.js';
import { Link } from 'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0';
import {Plus, Search, Trash2, Pencil, Eye} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { EmptyState } from '../components/EmptyState.js';
import { money, invoiceTotals } from '../utils/format.js';

export function Invoices() {
  const [query, setQuery] = React.useState('');
  const invoices = useBillingStore(s => s.invoices);
  const customers = useBillingStore(s => s.customers);
  const settings = useBillingStore(s => s.settings);
  const deleteInvoice = useBillingStore(s => s.deleteInvoice);
  const filtered = invoices.filter(inv => `${inv.number} ${customers.find(c => c.id === inv.customerId)?.name || ''} ${inv.status} ${inv.paymentMode || ''}`.toLowerCase().includes(query.toLowerCase()));

  const confirmDelete = inv => {
    if (confirm(`${inv.number} invoice delete pannalama?`)) deleteInvoice(inv.id);
  };

  return html`
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1"><${Search} size=${17} className="pointer-events-none absolute left-4 top-3.5 text-[hsl(var(--muted-foreground))]" /><input value=${query} onInput=${e => setQuery(e.target.value)} className="focus-ring w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-3 pl-11 pr-4" placeholder="Search bills, customers, status or payment mode" /></div>
        <${Link} to="/invoices/new" className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white"><${Plus} size=${18} /> New Invoice</${Link}>
      </div>
      ${filtered.length === 0 ? html`<${EmptyState} title="No invoices found" message="Create a bill or adjust your search to locate an existing invoice." action=${html`<${Link} to="/invoices/new" className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">Create invoice</${Link}>`} />` : html`
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="bg-[hsl(var(--muted))] text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]"><tr><th className="p-4">Invoice</th><th className="p-4">Customer</th><th className="p-4">Date</th><th className="p-4">Payment Mode</th><th className="p-4">Status</th><th className="p-4 text-right">Amount</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody>
                ${filtered.map(inv => { const c = customers.find(x => x.id === inv.customerId); return html`<tr key=${inv.id} className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.45)]"><td className="p-4 font-black"><${Link} to=${`/invoices/${inv.id}`} className="text-[hsl(var(--primary))]">${inv.number}</${Link}></td><td className="p-4">${c?.name || 'Walk-in Customer'}</td><td className="p-4">${inv.date}</td><td className="p-4"><span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1 text-xs font-black">${inv.paymentMode || 'Cash'}</span></td><td className="p-4"><span className="rounded-full bg-[hsl(var(--primary)/0.12)] px-3 py-1 text-xs font-black text-[hsl(var(--primary))]">${invoiceTotals(inv).balance <= 0 ? 'Paid' : inv.status}</span></td><td className="p-4 text-right font-black">${money(invoiceTotals(inv).total, settings.currency)}</td><td className="p-4"><div className="flex flex-wrap justify-end gap-2"><${Link} to=${`/invoices/${inv.id}`} className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] px-3 py-2 text-xs font-black hover:bg-[hsl(var(--muted))]" title="View invoice"><${Eye} size=${14} /> View</${Link}><${Link} to=${`/invoices/${inv.id}/edit`} className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[hsl(var(--primary))] px-3 py-2 text-xs font-black text-white hover:opacity-90" title="Edit invoice"><${Pencil} size=${14} /> Edit</${Link}><button onClick=${() => confirmDelete(inv)} className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[hsl(var(--destructive)/0.35)] px-3 py-2 text-xs font-black text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.10)]" title="Delete invoice"><${Trash2} size=${14} /> Delete</button></div></td></tr>`; })}
              </tbody>
            </table>
          </div>
        </div>`}
    </div>
  `;
}
