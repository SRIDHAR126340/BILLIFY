/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from '../jsx.js';
import { Link } from 'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0';
import {BarChart3, ReceiptText, Users, Package, WalletCards, CheckCircle2, AlertCircle} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { money, invoiceTotals } from '../utils/format.js';

export function Dashboard() {
  const invoices = useBillingStore(s => s.invoices);
  const customers = useBillingStore(s => s.customers);
  const items = useBillingStore(s => s.items);
  const settings = useBillingStore(s => s.settings);
  const [graphMode, setGraphMode] = React.useState('sales');
  const [range, setRange] = React.useState(3);
  const [stockPopup, setStockPopup] = React.useState(null);
  const revenue = invoices.reduce((sum, inv) => sum + invoiceTotals(inv).total, 0);
  const outstanding = invoices.reduce((sum, inv) => sum + invoiceTotals(inv).balance, 0);
  const paidCount = invoices.filter(inv => invoiceTotals(inv).balance <= 0).length;
  const unpaidCount = invoices.filter(inv => invoiceTotals(inv).balance > 0).length;
  const lowStockItems = items.filter(i => Number(i.stock || 0) <= Number(i.lowStock || 25));
  const lowStock = lowStockItems.length;

  React.useEffect(() => {
    if (!lowStockItems.length) return;
    const key = lowStockItems.map(i => `${i.id || i.name}:${Number(i.stock || 0)}:${Number(i.lowStock || 25)}`).join('|');
    let oldKey = '';
    try { oldKey = sessionStorage.getItem('sma-low-stock-popup-key') || ''; } catch (err) {}
    if (oldKey === key) return;
    try { sessionStorage.setItem('sma-low-stock-popup-key', key); } catch (err) {}
    setStockPopup(lowStockItems[0]);
  }, [lowStockItems.map(i => `${i.id || i.name}:${i.stock}:${i.lowStock}`).join('|')]);

  React.useEffect(() => {
    if (!stockPopup) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setStockPopup(null);
      }
    };

    const handleDocumentClick = (e) => {
      const isNavClick = e.target.closest('aside') || e.target.closest('header') || e.target.closest('nav') || e.target.closest('a');
      const isInsidePopup = e.target.closest('[role="dialog"]');
      if (isNavClick && !isInsidePopup) {
        setStockPopup(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [stockPopup]);

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const months = Array.from({ length: 60 }, (_, index) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (59 - index));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { key, label: `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`, sales: 0, count: 0 };
  });
  invoices.forEach(inv => {
    const key = String(inv.date || '').slice(0, 7);
    const row = months.find(m => m.key === key);
    if (row) { row.sales += invoiceTotals(inv).total; row.count += 1; }
  });
  const chartData = months.slice(-range);
  const maxValue = Math.max(1, ...chartData.map(m => graphMode === 'sales' ? m.sales : m.count));
  const graphTotal = chartData.reduce((sum, m) => sum + (graphMode === 'sales' ? m.sales : m.count), 0);
  const rangeOptions = [
    { label: 'Last 3 Months', value: 3 },
    { label: 'Last 6 Months', value: 6 },
    { label: '1 Year', value: 12 },
    { label: 'Year 2', value: 24 },
    { label: 'Year 3', value: 36 },
    { label: 'Year 4', value: 48 },
    { label: 'Year 5', value: 60 }
  ];
  const cards = [
    { label: 'Total Sales', value: money(revenue, settings.currency), icon: BarChart3 },
    { label: 'Paid Invoices', value: paidCount, icon: CheckCircle2 },
    { label: 'Unpaid Invoices', value: unpaidCount, icon: AlertCircle },
    { label: 'Outstanding', value: money(outstanding, settings.currency), icon: WalletCards }
  ];
  return html`<div className="space-y-5">
    ${stockPopup ? html`<div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 no-print" role="dialog" aria-modal="true" aria-labelledby="low-stock-title"><div className="w-full max-w-md rounded-[var(--radius-lg)] border-2 border-red-300 bg-[hsl(var(--card))] p-5 shadow-2xl"><div className="flex items-start gap-3"><div className="grid h-11 w-11 flex-none place-items-center rounded-full bg-red-100 text-red-600"><${AlertCircle} size=${24} /></div><div className="min-w-0"><h2 id="low-stock-title" className="text-lg font-black text-red-600">Low Stock Alert</h2><p className="mt-2 text-sm font-bold">${stockPopup.name} stock limit reached.</p><p className="mt-1 text-sm font-black">Remaining Stock: <span className="text-red-600">${Number(stockPopup.stock || 0)} ${stockPopup.unit || ''}</span></p><p className="mt-1 text-xs font-bold text-[hsl(var(--muted-foreground))]">Low stock limit: ${Number(stockPopup.lowStock || 25)}</p></div></div><button type="button" autoFocus onClick=${() => setStockPopup(null)} className="mt-5 w-full rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 text-sm font-black text-white">OK</button></div></div>` : ''}
    <div className="card p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black">Dashboard</h2><p className="mt-1 text-sm font-bold text-[hsl(var(--muted-foreground))]">${settings.businessName}</p></div></div></div>
    ${lowStockItems.length ? html`<section className="rounded-[var(--radius-lg)] border-2 border-red-300 bg-red-50 p-5 text-red-900 shadow-[var(--shadow-sm)]"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="inline-flex items-center gap-2 text-lg font-black"><${AlertCircle} size=${22} /> Low Stock Notifications</h3></div><${Link} to="/items" className="rounded-[var(--radius-md)] bg-red-600 px-4 py-2 text-xs font-black text-white">Update Stock</${Link}></div><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">${lowStockItems.map(item => html`<div key=${item.id || item.name} className="rounded-[var(--radius-md)] border border-red-200 bg-white p-4"><p className="font-black text-red-700">${item.name}</p><div className="mt-2 flex items-center justify-between text-sm"><span className="font-bold">Remaining</span><b>${Number(item.stock || 0)} ${item.unit || ''}</b></div><div className="mt-1 flex items-center justify-between text-xs text-red-700"><span className="font-bold">Limit</span><b>${Number(item.lowStock || 25)}</b></div></div>`)}</div></section>` : ''}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${cards.map(card => { const Icon = card.icon; return html`<div key=${card.label} className="card p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase text-[hsl(var(--muted-foreground))]">${card.label}</p><p className="mt-2 text-2xl font-black">${card.value}</p></div><div className="text-[hsl(var(--primary))]"><${Icon} size=${28} /></div></div></div>`; })}</section>
    <section className="card p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div><h3 className="font-black">Monthly Sales / Invoice Graph</h3></div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="inline-flex rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.7)] p-1" role="tablist" aria-label="Graph type">
            <button type="button" role="tab" aria-selected=${graphMode === 'sales'} onClick=${() => setGraphMode('sales')} className=${`rounded-[var(--radius-sm)] px-4 py-2 text-xs font-black transition ${graphMode === 'sales' ? 'bg-[hsl(var(--primary))] text-white shadow-[var(--shadow-sm)]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))]'}`}>Sales Value</button>
            <button type="button" role="tab" aria-selected=${graphMode === 'count'} onClick=${() => setGraphMode('count')} className=${`rounded-[var(--radius-sm)] px-4 py-2 text-xs font-black transition ${graphMode === 'count' ? 'bg-[hsl(var(--primary))] text-white shadow-[var(--shadow-sm)]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))]'}`}>Invoice Count</button>
          </div>
          <select value=${range} onChange=${e => setRange(Number(e.target.value))} aria-label="Graph timeline" className="focus-ring rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-black">
            ${rangeOptions.map(opt => html`<option key=${opt.value} value=${opt.value}>${opt.label}</option>`)}
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.35)] px-4 py-3"><span className="text-sm font-black">${graphMode === 'sales' ? 'Sales Value' : 'Invoice Count'}</span><span className="text-sm font-black text-[hsl(var(--primary))]">${graphMode === 'sales' ? money(graphTotal, settings.currency) : `${graphTotal} invoices`}</span></div>
      <div className="mt-5 overflow-x-auto rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.30)] p-3 sm:p-5">
        <div key=${`${graphMode}-${range}`} className="flex h-72 min-w-full items-end gap-2 transition-opacity duration-300 ease-out sm:gap-3" style=${{ animation: 'fadeIn 260ms ease-out' }}>
          ${chartData.map((m, index) => { const value = graphMode === 'sales' ? m.sales : m.count; const prev = index > 0 ? (graphMode === 'sales' ? chartData[index - 1].sales : chartData[index - 1].count) : value; const trend = value >= prev; const height = value > 0 ? Math.max(24, (value / maxValue) * 210) : 14; const color = graphMode === 'sales' ? `hsl(${247 + (index % 5) * 10} 100% ${58 + (index % 3) * 5}%)` : `hsl(${150 + (index % 5) * 8} 68% ${38 + (index % 3) * 5}%)`; return html`<div key=${m.key} className="flex min-w-[58px] flex-1 flex-col items-center justify-end gap-2"><div className=${`text-base font-black ${trend ? 'text-emerald-600' : 'text-red-600'}`} title=${trend ? 'Growth' : 'Decay'}>${trend ? '↑' : '↓'}</div><div className="flex w-full items-end justify-center rounded-t-lg px-1 pb-1 text-center text-[10px] font-black text-white shadow-sm transition-all duration-300 ease-out" style=${{ height: `${height}px`, background: color }}><span className="break-words leading-3 drop-shadow-sm">${graphMode === 'sales' ? money(value, settings.currency) : value}</span></div><span className="whitespace-nowrap text-[10px] font-bold text-[hsl(var(--muted-foreground))]">${m.label}</span></div>`; })}
        </div>
      </div>
    </section>
    <div className="grid gap-5 lg:grid-cols-2"><section className="card overflow-hidden"><div className="border-b border-[hsl(var(--border))] p-5"><h3 className="font-black">Recent Invoices</h3></div>${invoices.length ? html`<div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]"><tr><th className="p-4">Invoice</th><th className="p-4">Date</th><th className="p-4 text-right">Total</th></tr></thead><tbody>${invoices.slice(0, 6).map(inv => html`<tr key=${inv.id} className="border-t border-[hsl(var(--border))]"><td className="p-4 font-black"><${Link} to=${`/invoices/${inv.id}`} className="text-[hsl(var(--primary))]">${inv.number}</${Link}></td><td className="p-4">${inv.date}</td><td className="p-4 text-right font-black">${money(invoiceTotals(inv).total, settings.currency)}</td></tr>`)}</tbody></table></div>` : html`<p className="p-8 text-center text-sm text-[hsl(var(--muted-foreground))]">No invoices yet.</p>`}</section><section className="card p-5"><h3 className="font-black">Quick Summary</h3><div className="mt-4 grid gap-3"><div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.55)] p-4"><span className="inline-flex items-center gap-2 font-bold"><${Users} size=${18} /> Parties</span><b>${customers.length}</b></div><div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.55)] p-4"><span className="inline-flex items-center gap-2 font-bold"><${Package} size=${18} /> Products</span><b>${items.length}</b></div><div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.55)] p-4"><span className="inline-flex items-center gap-2 font-bold"><${ReceiptText} size=${18} /> Invoice Count</span><b>${invoices.length}</b></div><div className=${`flex items-center justify-between rounded-[var(--radius-md)] p-4 ${lowStock ? 'bg-red-100 text-red-700 ring-2 ring-red-300' : 'bg-[hsl(var(--muted)/0.55)]'}`}><span className="inline-flex items-center gap-2 font-bold"><${Package} size=${18} /> Low Stock</span><b>${lowStock}</b></div></div></section></div>
  </div>`;
}
