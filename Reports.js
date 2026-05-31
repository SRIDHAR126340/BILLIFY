/* __imports_rewritten__ */
import { html } from '../jsx.js';
import {BarChart3, ReceiptText, WalletCards, Package, Printer} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { money, invoiceTotals, invoiceLineTaxRate } from '../utils/format.js';
import { CompanyPrintHeader } from '../components/CompanyPrintHeader.js';

export function Reports() {
  const invoices = useBillingStore(s => s.invoices);
  const customers = useBillingStore(s => s.customers);
  const items = useBillingStore(s => s.items);
  const settings = useBillingStore(s => s.settings);
  const revenue = invoices.reduce((sum, inv) => sum + invoiceTotals(inv).total, 0);
  const gst = invoices.reduce((sum, inv) => sum + invoiceTotals(inv).tax, 0);
  const outstanding = invoices.reduce((sum, inv) => sum + invoiceTotals(inv).balance, 0);
  const topInvoices = invoices.slice(0, 8);
  const cards = [
    { label: 'Sales Value', value: money(revenue, settings.currency), icon: ReceiptText },
    { label: 'GST Collected', value: money(gst, settings.currency), icon: WalletCards },
    { label: 'Outstanding', value: money(outstanding, settings.currency), icon: BarChart3 },
    { label: 'Parties / Products', value: `${customers.length} / ${items.length}`, icon: Package }
  ];
  return html`
    <div className="space-y-5">
      <div className="no-print flex justify-end"><button onClick=${() => window.print()} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white"><${Printer} size=${17} /> Print Report</button></div>
      <article className="print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]">
        <${CompanyPrintHeader} settings=${settings} title="Sales & GST Report" />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 no-print">${cards.map(card => { const Icon = card.icon; return html`<div key=${card.label} className="card p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase text-[hsl(var(--muted-foreground))]">${card.label}</p><p className="mt-2 text-2xl font-black">${card.value}</p></div><div className="text-[hsl(var(--primary))]"><${Icon} size=${28} /></div></div></div>`; })}</section>
        <section className="sma-info-grid"><div><h3>REPORT SUMMARY</h3><p><b>Sales Value:</b> ${money(revenue, settings.currency)}</p><p><b>GST Collected:</b> ${money(gst, settings.currency)}</p></div><div><h3>BALANCE SUMMARY</h3><p><b>Outstanding:</b> ${money(outstanding, settings.currency)}</p><p><b>Parties / Products:</b> ${customers.length} / ${items.length}</p></div></section>
        <table className="sma-items-table"><thead><tr><th>Invoice</th><th>Date</th><th>Status</th><th>Tax</th><th>Total</th><th>Balance</th></tr></thead><tbody>${topInvoices.map(inv => { const t = invoiceTotals(inv); return html`<tr key=${inv.id}><td className="sma-strong">${inv.number}</td><td>${inv.date}</td><td>${inv.status}</td><td>${invoiceLineTaxRate(inv, inv.items[0] || {})}% (${money(t.tax, settings.currency)})</td><td className="sma-strong">${money(t.total, settings.currency)}</td><td>${money(t.balance, settings.currency)}</td></tr>`; })}</tbody></table>
        <footer className="sma-sign-row"><div>Prepared By</div><div>Authorized Signature</div></footer>
      </article>
    </div>`;
}
