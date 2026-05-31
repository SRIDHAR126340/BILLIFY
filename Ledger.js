/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import html2canvas from 'https://esm.sh/html2canvas';
import jsPDF from 'https://esm.sh/jspdf';
import { html } from '../jsx.js';
import {AlertCircle, Pencil, Save, X, Printer, MessageCircle, Plus} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { money, invoiceTotals, today } from '../utils/format.js';
import { CompanyPrintHeader } from '../components/CompanyPrintHeader.js';
import { sharePdfToWhatsApp } from '../utils/whatsappPdf.js';

export function Ledger() {
  const customers = useBillingStore(s => s.customers);
  const invoices = useBillingStore(s => s.invoices);
  const settings = useBillingStore(s => s.settings);
  const updateInvoice = useBillingStore(s => s.updateInvoice);
  const [editRow, setEditRow] = React.useState(null);
  const [payRows, setPayRows] = React.useState({});
  const [shareMsg, setShareMsg] = React.useState('');
  const [shareBusy, setShareBusy] = React.useState('');
  const [selectedPartyId, setSelectedPartyId] = React.useState('');
  const [ledgerTemplate, setLedgerTemplate] = React.useState(() => localStorage.getItem('sma-party-ledger-template') || 'classic');
  const [selectedLedgerForPreview, setSelectedLedgerForPreview] = React.useState(null);
  const [showPrintPreview, setShowPrintPreview] = React.useState(false);

  const beginEdit = inv => setEditRow({ id: inv.id, paid: inv.totals.paid ?? 0, status: inv.status || 'Unpaid' });
  const cancelEdit = () => setEditRow(null);
  const saveEdit = () => {
    if (!editRow) return;
    const inv = invoices.find(i => i.id === editRow.id);
    if (!inv) return;
    const nextPaid = Number(editRow.paid || 0);
    let nextPayments = Array.isArray(inv.payments) ? inv.payments : (Number(inv.paid || 0) > 0 ? [{ id: `pay_legacy`, date: inv.date || today(), amount: Number(inv.paid || 0), mode: inv.paymentMode || 'Cash', note: 'Legacy payment' }] : []);
    
    const currentSum = nextPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
    if (nextPaid !== currentSum) {
      if (nextPaid === 0) {
        nextPayments = [];
      } else if (nextPayments.length === 0) {
        nextPayments = [{ id: `pay_${Date.now().toString(36)}`, date: today(), amount: nextPaid, mode: 'Cash', note: 'Direct update' }];
      } else {
        const diff = nextPaid - currentSum;
        nextPayments = [...nextPayments, { id: `pay_adj_${Date.now().toString(36)}`, date: today(), amount: diff, mode: 'Other', note: 'Direct adjustment' }];
      }
    }
    updateInvoice(editRow.id, { paid: nextPaid, payments: nextPayments, status: editRow.status || 'Unpaid' });
    setEditRow(null);
  };
  const changeTemplate = value => { setLedgerTemplate(value); try { localStorage.setItem('sma-party-ledger-template', value); } catch (err) {} };
  const addCreditPayment = inv => {
    const amount = Number(payRows[inv.id]?.amount || 0);
    if (amount <= 0) return alert('Payment amount enter pannunga.');
    const existing = Array.isArray(inv.payments) ? inv.payments : (Number(inv.paid || 0) > 0 ? [{ id: `${inv.id}_old`, date: inv.date || today(), amount: Number(inv.paid || 0), mode: inv.paymentMode || 'Credit', note: 'Opening paid' }] : []);
    const nextPaid = existing.reduce((sum, p) => sum + Number(p.amount || 0), 0) + amount;
    const status = nextPaid >= inv.totals.total ? 'Paid' : 'Partial';
    const payment = { id: `pay_${Date.now().toString(36)}`, date: payRows[inv.id]?.date || today(), amount, mode: payRows[inv.id]?.mode || 'Cash', note: payRows[inv.id]?.note || '' };
    updateInvoice(inv.id, { payments: [...existing, payment], paid: nextPaid, status });
    setPayRows(rows => ({ ...rows, [inv.id]: { amount: '', date: today(), mode: 'Cash', note: '' } }));
  };
  const partyLedgers = React.useMemo(() => customers.map(c => {
    const partyInvoices = invoices.filter(inv => inv.customerId === c.id).map(inv => ({ ...inv, totals: invoiceTotals(inv) })).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    const totalInvoice = partyInvoices.reduce((sum, inv) => sum + inv.totals.total, 0);
    const totalPaid = partyInvoices.reduce((sum, inv) => sum + inv.totals.paid, 0);
    const totalBalance = partyInvoices.reduce((sum, inv) => sum + inv.totals.balance, 0);
    const creditInvoices = partyInvoices.filter(inv => inv.totals.balance > 0 || String(inv.status || '').toLowerCase() !== 'paid');
    const lastPayment = partyInvoices.flatMap(inv => (inv.payments || []).map(p => ({ ...p, invoice: inv }))).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0] || partyInvoices.find(inv => inv.totals.paid > 0);
    return { customer: c, invoices: partyInvoices, totalInvoice, totalPaid, totalBalance, creditInvoices, lastPayment };
  }), [customers, invoices]);
  React.useEffect(() => { if (!selectedPartyId && partyLedgers[0]) setSelectedPartyId(partyLedgers[0].customer.id); }, [partyLedgers, selectedPartyId]);
  const selectedLedger = partyLedgers.find(l => l.customer.id === selectedPartyId) || partyLedgers[0];
  const grandOutstanding = partyLedgers.reduce((sum, l) => sum + l.totalBalance, 0);
  
  const printParty = id => {
    const nodes = document.querySelectorAll(`.ledger-print-party[data-party-id="${CSS.escape(id)}"]`);
    if (nodes.length === 0) return;
    const oldTitle = document.title;
    const party = partyLedgers.find(l => l.customer.id === id)?.customer;
    const style = document.createElement('style');
    style.id = 'ledger-landscape-print-style';
    style.textContent = '@page { size: A4 landscape; margin: 15mm !important; }';
    document.head.appendChild(style);
    document.querySelectorAll('.ledger-print-party.print-selected').forEach(el => el.classList.remove('print-selected'));
    nodes.forEach(node => node.classList.add('print-selected'));
    document.body.dataset.printParty = id;
    document.title = `${settings.businessName} - ${party?.name || 'Company'} Ledger`;
    const cleanup = () => {
      nodes.forEach(node => node.classList.remove('print-selected'));
      delete document.body.dataset.printParty;
      document.title = oldTitle;
      document.getElementById('ledger-landscape-print-style')?.remove();
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => window.print(), 50);
    setTimeout(cleanup, 1500);
  };

  React.useEffect(() => {
    if (showPrintPreview) {
      const style = document.createElement('style');
      style.id = 'ledger-print-preview-style';
      style.textContent = `
        @media print {
          @page { size: A4 landscape; margin: 15mm !important; }
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, footer, .no-print {
            display: none !important;
          }
          #root > div > main > div > div > *:not(.print-preview-modal) {
            display: none !important;
          }
          .print-preview-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            z-index: 99999 !important;
            display: block !important;
          }
          .print-preview-modal .no-print,
          .print-preview-modal button,
          .print-preview-modal select {
            display: none !important;
          }
          .print-preview-modal .print-area {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 15mm !important;
            display: block !important;
          }
          .print-preview-modal .ledger-print-party {
            width: 267mm !important;
            max-width: 267mm !important;
            display: block !important;
            padding: 15mm !important;
          }
          .print-preview-modal .ledger-print-party table {
            table-layout: fixed !important;
            font-size: 8.5px !important;
            margin-top: 18px !important;
            width: 100% !important;
          }
          .print-preview-modal .ledger-print-party th,
          .print-preview-modal .ledger-print-party td {
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: clip !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            padding: 9px 6px !important;
            line-height: 1.45 !important;
            vertical-align: middle !important;
            text-align: center !important;
          }
          .print-preview-modal .ledger-print-party th {
            background: #f8fafc !important;
            font-weight: 900 !important;
          }
        }
      `;
      document.head.appendChild(style);
      return () => {
        style.remove();
      };
    }
  }, [showPrintPreview]);

  const buildLedgerPdfFromPrint = async ledger => {
    const source = document.querySelector(`.ledger-print-party[data-party-id="${CSS.escape(ledger.customer.id)}"]`);
    if (!source) throw new Error('Ledger print layout not found.');
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;left:-10000px;top:0;background:white;width:281mm;z-index:-1;';
    const clone = source.cloneNode(true);
    clone.classList.add('print-selected');
    clone.style.cssText = 'display:block !important;width:281mm !important;max-width:281mm !important;margin:0 !important;box-shadow:none !important;border-radius:0 !important;background:white !important;color:#111827 !important;padding:15mm !important;';
    clone.querySelectorAll('.no-print, button, input, select').forEach(el => el.remove());
    clone.querySelectorAll('table').forEach(table => { table.style.tableLayout = 'fixed'; table.style.width = '100%'; table.style.borderCollapse = 'collapse'; table.style.marginTop = '18px'; });
    clone.querySelectorAll('th,td').forEach(cell => { cell.style.whiteSpace = 'normal'; cell.style.overflow = 'visible'; cell.style.textOverflow = 'clip'; cell.style.wordBreak = 'break-word'; cell.style.overflowWrap = 'anywhere'; cell.style.padding = '10px 7px'; cell.style.lineHeight = '1.45'; cell.style.verticalAlign = 'middle'; });
    host.appendChild(clone);
    document.body.appendChild(host);
    try {
      await new Promise(resolve => requestAnimationFrame(resolve));
      const canvas = await html2canvas(clone, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, windowWidth: clone.scrollWidth, windowHeight: clone.scrollHeight });
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 34.02;
      const imgW = pageW - margin * 2;
      const usableH = pageH - margin * 2;
      const pxPerPt = canvas.width / imgW;
      const pageCanvasH = Math.floor(usableH * pxPerPt);
      let y = 0;
      let page = 0;
      while (y < canvas.height) {
        const sliceH = Math.min(pageCanvasH, canvas.height - y);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceH;
        pageCanvas.getContext('2d').drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        if (page) doc.addPage('a4', 'landscape');
        doc.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', margin, margin, imgW, sliceH / pxPerPt);
        y += sliceH;
        page += 1;
      }
      return doc;
    } finally { host.remove(); }
  };
  const shareParty = async ledger => { setShareBusy(ledger.customer.id); setShareMsg(''); try { const doc = await buildLedgerPdfFromPrint(ledger); const fileName = `${(ledger.customer.name || 'company').replace(/[^a-z0-9]+/gi, '-')}-ledger.pdf`; await sharePdfToWhatsApp({ doc, fileName, title: `${ledger.customer.name} Ledger`, phone: ledger.customer.phone }); setShareMsg(''); } catch (err) { setShareMsg('Ledger PDF share failed: ' + (err.message || 'Please try again.')); } finally { setShareBusy(''); } };
  const renderTemplate = ledger => { const c = ledger.customer; return html`<article className=${`card print-area sma-print-sheet ledger-print-party ledger-template-${ledgerTemplate}`} data-party-id=${c.id}><${CompanyPrintHeader} settings=${settings} /><section className="sma-info-grid"><div><h3>PARTY DETAILS</h3><p className="sma-strong sma-customer-name">${c.name}</p><p>${c.address || '-'}</p><p>Phone: ${c.phone || '-'} | Email: ${c.email || '-'}</p><p>GSTIN: ${c.gstin || '-'}</p></div><div><p><b>Total Invoice:</b> ${money(ledger.totalInvoice, settings.currency)}</p><p><b>Paid:</b> ${money(ledger.totalPaid, settings.currency)}</p><p><b>Unpaid/Credit:</b> ${money(ledger.totalBalance, settings.currency)}</p><p><b>Credit Bills:</b> ${ledger.creditInvoices.length}</p><p><b>Last Paid:</b> ${ledger.lastPayment ? `${money(ledger.lastPayment.amount || ledger.lastPayment.totals?.paid, settings.currency)} on ${ledger.lastPayment.date || '-'}` : '-'}</p></div></section><div className="no-print mt-4 flex justify-end gap-2"><button onClick=${() => { setSelectedLedgerForPreview(ledger); setShowPrintPreview(true); }} className="inline-flex items-center gap-1 rounded border border-[hsl(var(--border))] px-3 py-2 text-sm font-black"><${Printer} size=${15} /> Print</button><button onClick=${() => { setSelectedLedgerForPreview(ledger); setShowPrintPreview(true); }} className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-2 text-sm font-black text-white"><${MessageCircle} size=${15} /> WhatsApp PDF</button></div><div className="mt-5 ledger-table-section"><div className="overflow-x-auto"><table className="sma-items-table ledger-report-table min-w-[900px]"><thead><tr><th>Date</th><th>Invoice</th><th>Bill Amount</th><th>Paid Updated</th><th>Credit/Balance</th><th>Payment History</th><th>Status</th><th className="no-print">Add Payment / Edit</th></tr></thead><tbody>${ledger.invoices.length ? ledger.invoices.map(inv => { const editing = editRow?.id === inv.id; const pay = payRows[inv.id] || { amount: '', date: today(), mode: 'Cash', note: '' }; return html`<tr key=${inv.id}><td>${inv.date || '-'}</td><td className="sma-strong">${inv.number || inv.id}</td><td>${money(inv.totals.total, settings.currency)}</td><td>${editing ? html`<input type="number" value=${editRow.paid} onInput=${e => setEditRow({ ...editRow, paid: e.target.value })} className="focus-ring w-24 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1" aria-label="Paid amount" />` : money(inv.totals.paid, settings.currency)}</td><td className=${inv.totals.balance > 0 ? 'sma-strong text-[hsl(var(--destructive))]' : 'sma-strong text-[hsl(var(--primary))]'}>${money(inv.totals.balance, settings.currency)}</td><td>${(() => {
    const payments = Array.isArray(inv.payments) ? inv.payments : (Number(inv.paid || 0) > 0 ? [{ id: 'legacy', date: inv.date || '-', amount: Number(inv.paid || 0), mode: inv.paymentMode || 'Cash', note: 'Initial payment' }] : []);
    const count = payments.length;
    return html`<div className="space-y-1 text-left text-xs max-w-[220px]">
      ${count > 0 ? html`
        <div className="font-extrabold text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded inline-block mb-1">
          Paid ${count} ${count === 1 ? 'time' : 'times'}
        </div>
        <div className="space-y-1 pl-1">
          ${payments.map((p, pIdx) => html`
            <div key=${p.id || pIdx} className="border-l-2 border-emerald-300 pl-1.5 py-0.5 hover:bg-emerald-50/50 transition-colors">
              <span className="font-bold text-gray-800 block text-[11px]">${money(p.amount, settings.currency)}</span>
              <span className="text-[10px] text-gray-500 block">${p.date || '-'} • <span className="font-medium text-blue-600">${p.mode || '-'}</span></span>
              ${p.note ? html`<span className="text-[9px] text-gray-400 italic block">"${p.note}"</span>` : ''}
            </div>
          `)}
        </div>
      ` : html`<span className="text-gray-400 text-xs italic">No payments yet</span>`}
    </div>`;
  })()}</td><td>${editing ? html`<select value=${editRow.status} onChange=${e => setEditRow({ ...editRow, status: e.target.value })} className="focus-ring rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1" aria-label="Invoice status"><option>Paid</option><option>Partial</option><option>Unpaid</option><option>Credit</option></select>` : (inv.status || '-')}</td><td className="no-print">${editing ? html`<div className="flex gap-1"><button onClick=${saveEdit} className="rounded p-1 text-[hsl(var(--primary))]" title="Save ledger"><${Save} size=${16} /></button><button onClick=${cancelEdit} className="rounded p-1 text-[hsl(var(--destructive))]" title="Cancel"><${X} size=${16} /></button></div>` : html`<div className="flex flex-wrap items-center gap-1.5">
    <div className="flex items-center gap-1">
      <input type="number" value=${pay.amount} onInput=${e => setPayRows(r => ({ ...r, [inv.id]: { ...pay, amount: e.target.value } }))} placeholder="Amount" className="w-20 rounded border border-[hsl(var(--border))] bg-transparent p-1 text-xs" />
      <input type="date" value=${pay.date} onInput=${e => setPayRows(r => ({ ...r, [inv.id]: { ...pay, date: e.target.value } }))} className="w-28 rounded border border-[hsl(var(--border))] bg-transparent p-1 text-xs" />
    </div>
    <div className="flex items-center gap-1">
      <select value=${pay.mode || 'Cash'} onChange=${e => setPayRows(r => ({ ...r, [inv.id]: { ...pay, mode: e.target.value } }))} className="w-20 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 text-xs">
        <option value="Cash">Cash</option>
        <option value="UPI">UPI</option>
        <option value="GPay">GPay</option>
        <option value="PhonePe">PhonePe</option>
        <option value="Paytm">Paytm</option>
        <option value="Card">Card</option>
        <option value="Bank Transfer">Bank</option>
        <option value="Cheque">Cheque</option>
        <option value="NEFT / RTGS">NEFT</option>
        <option value="Other">Other</option>
      </select>
      <input type="text" value=${pay.note || ''} onInput=${e => setPayRows(r => ({ ...r, [inv.id]: { ...pay, note: e.target.value } }))} placeholder="Note" className="w-20 rounded border border-[hsl(var(--border))] bg-transparent p-1 text-xs" />
      <button onClick=${() => addCreditPayment(inv)} className="rounded p-1 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)]" title="Add payment"><${Plus} size=${16} /></button>
      <button onClick=${() => beginEdit(inv)} className="rounded p-1 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)]" title="Edit ledger"><${Pencil} size=${16} /></button>
    </div>
  </div>`}</td></tr>`; }) : html`<tr><td colSpan="8" className="py-3 text-center text-[hsl(var(--muted-foreground))]">No invoices for this party.</td></tr>`}</tbody></table></div></div><footer className="sma-sign-row"><div>Prepared By</div><div>Authorized Signature</div></footer></article>`; };
  return html`<div className="space-y-5"><div className="card p-4 no-print"><div className="flex flex-wrap items-center justify-between gap-3"><p className="flex items-center gap-2 text-lg font-black"><${AlertCircle} size=${18} /> Party Wise Outstandings</p><p className="rounded-full bg-[hsl(var(--destructive)/0.12)] px-3 py-1 text-sm font-black text-[hsl(var(--destructive))]">Total Balance: ${money(grandOutstanding, settings.currency)}</p></div>${shareMsg ? html`<p className="mt-2 rounded bg-emerald-500/10 p-2 text-sm font-bold text-emerald-700 whitespace-pre-wrap">${shareMsg}</p>` : ''}<div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">${partyLedgers.map(l => html`<button key=${l.customer.id} onClick=${() => setSelectedPartyId(l.customer.id)} className=${`rounded-[var(--radius-md)] border p-3 text-left ${selectedLedger?.customer.id === l.customer.id ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]' : 'border-[hsl(var(--border))]'}`}><div className="flex justify-between gap-2"><span className="font-black">${l.customer.name}</span><span className=${`font-black ${l.totalBalance > 0 ? 'text-[hsl(var(--destructive))]' : 'text-[hsl(var(--primary))]'}`}>${money(l.totalBalance, settings.currency)}</span></div><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Invoices ${l.invoices.length} · Paid ${money(l.totalPaid, settings.currency)} · Credit Bills ${l.creditInvoices.length}</p></button>`)}</div></div><div className="card p-4 no-print"><div className="grid gap-3 md:grid-cols-2"><label className="text-sm font-black">Select Company / Party<select value=${selectedPartyId} onChange=${e => setSelectedPartyId(e.target.value)} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 font-semibold">${partyLedgers.map(l => html`<option key=${l.customer.id} value=${l.customer.id}>${l.customer.name}</option>`)}</select></label><label className="text-sm font-black">Ledger Print Template<select value=${ledgerTemplate} onChange=${e => changeTemplate(e.target.value)} className="focus-ring mt-1 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 font-semibold"><option value="classic">Classic</option><option value="modern">Modern</option><option value="compact">Compact</option><option value="gstbox">GST Box</option><option value="letterhead">Letterhead</option></select></label></div></div>${selectedLedger ? renderTemplate(selectedLedger) : html`<div className="card p-6 text-center font-bold text-[hsl(var(--muted-foreground))]">No parties available.</div>`}
  
  ${showPrintPreview && selectedLedgerForPreview && html`
    <div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex items-center justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print">
        <span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Ledger (${selectedLedgerForPreview.customer.name})</span>
        <div className="flex gap-2">
          <button disabled=${shareBusy === selectedLedgerForPreview.customer.id} onClick=${() => shareParty(selectedLedgerForPreview)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white disabled:opacity-60">
            <${MessageCircle} size=${17} /> ${shareBusy === selectedLedgerForPreview.customer.id ? 'Sharing...' : 'WhatsApp Share'}
          </button>
          <button onClick=${() => window.print()} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">
            <${Printer} size=${17} /> Print
          </button>
          <button onClick=${() => setShowPrintPreview(false)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black text-[hsl(var(--foreground))] bg-[hsl(var(--card))]">
            <${X} size=${17} /> Close
          </button>
        </div>
      </div>
      ${shareMsg ? html`<div className="w-full max-w-4xl mb-4 bg-emerald-500/10 text-emerald-700 p-3 rounded font-bold text-sm text-center">${shareMsg}</div>` : ''}
      <div className="w-full max-w-4xl">
        ${renderTemplate(selectedLedgerForPreview)}
      </div>
    </div>
  `}
  </div>`;
}
