/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import jsPDF from 'https://esm.sh/jspdf';
import autoTable from 'https://esm.sh/jspdf-autotable';
import { html } from '../jsx.js';
import { Link, useParams } from 'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0';
import {Printer, ArrowLeft, FileText, Upload, MessageCircle, X, Download, Eye} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { money, invoiceTotals, invoiceLineTaxRate, invoiceTaxBreakup, invoiceLineTaxValue } from '../utils/format.js';
import { sharePdfToWhatsApp } from '../utils/whatsappPdf.js';
import { drawCompanyPdfHeader, cleanPdfText } from '../utils/companyPdf.js';
import { CompanyPrintHeader } from '../components/CompanyPrintHeader.js';

export function InvoiceView() {
  const params = useParams();
  const invoices = useBillingStore(s => s.invoices);
  const customers = useBillingStore(s => s.customers);
  const settings = useBillingStore(s => s.settings);
  const [template, setTemplate] = React.useState(() => settings.invoiceTemplateChoice || localStorage.getItem('sma-invoice-template-choice') || 'sma');
  const [customTemplate, setCustomTemplate] = React.useState(() => localStorage.getItem('sma-custom-invoice-template') || '');
  const [templateMsg, setTemplateMsg] = React.useState('');
  const [busy, setBusy] = React.useState('');
  const [shareMsg, setShareMsg] = React.useState({ type: '', text: '' });
  const [showPrintPreview, setShowPrintPreview] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const inv = invoices.find(i => i.id === params.id);

  React.useEffect(() => {
    if (settings.invoiceTemplateChoice) {
      setTemplate(settings.invoiceTemplateChoice);
    }
  }, [settings.invoiceTemplateChoice]);

  React.useEffect(() => {
    // Keep local storage & settings custom template state in sync
    const checkCustom = () => {
      setCustomTemplate(localStorage.getItem('sma-custom-invoice-template') || '');
    };
    window.addEventListener('storage', checkCustom);
    return () => window.removeEventListener('storage', checkCustom);
  }, []);

  if (!inv) return html`<div className="card p-8"><p className="font-black">Invoice not found.</p><${Link} to="/invoices" className="mt-4 inline-flex text-[hsl(var(--primary))]">Back to invoices</${Link}></div>`;

  const viewInv = { ...inv, paymentMode: inv.paymentMode || 'Cash', taxMode: inv.taxMode === 'CUSTOM' ? 'GST' : (inv.taxMode || 'GST'), cgstRate: Number(inv.cgstRate ?? settings.defaultCgstRate ?? 9), sgstRate: Number(inv.sgstRate ?? settings.defaultSgstRate ?? 9) };
  const c = customers.find(x => x.id === viewInv.customerId);
  const totals = invoiceTotals(viewInv);
  const taxBreakup = invoiceTaxBreakup(viewInv);
  const totalTaxPct = viewInv.taxMode === 'IGST' ? (viewInv.items[0]?.taxRate || (Number(viewInv.cgstRate||0) + Number(viewInv.sgstRate||0)) || 18) : (Number(viewInv.cgstRate || 0) + Number(viewInv.sgstRate || 0));
  const taxLabel = `${totalTaxPct}%`;

  const templateStyle = 
    template === 'modern' ? { 
      head: 'border-b-4 border-indigo-600 bg-indigo-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8', 
      table: 'bg-indigo-600 text-white', 
      article: 'print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10' 
    } : template === 'compact' ? { 
      head: 'border-b pb-3', 
      table: 'bg-slate-100 text-slate-900 border-y', 
      article: 'print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-5 text-slate-900 shadow-[var(--shadow-md)] sm:p-7' 
    } : template === 'gst' ? { 
      head: 'border-2 border-slate-900 p-4', 
      table: 'bg-emerald-700 text-white', 
      article: 'print-area mx-auto max-w-4xl rounded-none border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-8' 
    } : template === 'letterhead' ? { 
      head: 'border-b-8 border-purple-600 bg-purple-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8', 
      table: 'bg-purple-700 text-white', 
      article: 'print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10' 
    } : template === 'professional' ? { 
      head: 'border-b-4 border-teal-600 bg-teal-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8', 
      table: 'bg-teal-700 text-white', 
      article: 'print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-teal-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10' 
    } : template === 'elegant' ? { 
      head: 'border-b-4 border-rose-500 bg-rose-50 p-5 -m-6 mb-5 sm:-m-10 sm:mb-5 sm:p-8', 
      table: 'bg-rose-600 text-white', 
      article: 'print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-rose-950 bg-white p-6 text-rose-950 shadow-[var(--shadow-md)] sm:p-10' 
    } : template === 'minimalist' ? { 
      head: 'border-b border-slate-300 pb-4', 
      table: 'bg-slate-100 text-slate-800 border-y', 
      article: 'print-area mx-auto max-w-4xl rounded-none border border-slate-200 bg-white p-6 text-slate-800 shadow-none sm:p-8' 
    } : { 
      head: 'border-b-2 border-slate-900 pb-5', 
      table: 'bg-slate-900 text-white', 
      article: 'print-area mx-auto max-w-4xl rounded-[var(--radius-lg)] border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-[var(--shadow-md)] sm:p-10' 
    };

  const esc = value => String(value ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const lineBaseAmount = l => Number(l.qty || 0) * Number(l.price || 0);
  const lineDiscountValue = l => { const base = lineBaseAmount(l); const raw = l?.discountType === 'percent' ? base * Number(l?.discount || 0) / 100 : Number(l?.discount || 0); return Math.min(Math.max(0, raw), Math.max(0, base)); };
  const lineTaxValue = l => Math.max(0, lineBaseAmount(l) - lineDiscountValue(l)) * invoiceLineTaxRate(viewInv, l) / 100;
  const lineFinalAmount = l => Math.max(0, lineBaseAmount(l) - lineDiscountValue(l)) + lineTaxValue(l);
  const lineTaxText = l => `${invoiceLineTaxRate(viewInv, l)}% (${money(invoiceLineTaxValue(viewInv, l), settings.currency)})`;
  const lineDiscountText = l => lineDiscountValue(l) ? money(lineDiscountValue(l), settings.currency) : money(0, settings.currency);
  const itemRowsHtml = viewInv.items.map((l, idx) => `<tr><td>${idx + 1}</td><td>${esc(l.name)}</td><td>${esc(l.hsn || '-')}</td><td style="text-align:right">${esc(l.qty)}</td><td style="text-align:right">${esc(money(l.price, settings.currency))}</td><td style="text-align:right">${esc(lineTaxText(l))}</td><td style="text-align:right">${esc(lineDiscountText(l))}</td><td style="text-align:right">${esc(money(lineFinalAmount(l), settings.currency))}</td></tr>`).join('');
  const taxSummaryHtml = viewInv.taxMode === 'IGST' ? `<p><span>IGST</span><b>${totalTaxPct}%</b></p>` : `<p><span>CGST</span><b>${viewInv.cgstRate}%</b></p><p><span>SGST</span><b>${viewInv.sgstRate}%</b></p>`;
  const customPrintHtml = () => { const fallback = `<div style="font-family:Arial;padding:24px"><h1>{{businessName}}</h1><h2>Tax Invoice - {{invoiceNumber}}</h2><p>{{businessAddress}}</p><hr/><p><b>Customer:</b> {{customerName}}<br/><b>Date:</b> {{invoiceDate}}<br/><b>Payment:</b> {{paymentMode}}</p><table style="width:100%;border-collapse:collapse" border="1"><thead><tr><th>#</th><th>Product</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Tax</th><th>Discount</th><th>Amount</th></tr></thead><tbody>{{itemRows}}</tbody></table><div style="width:320px;margin-left:auto"><p><span>Subtotal</span><b style="float:right">{{subtotal}}</b></p>{{taxSummaryHtml}}<h3 style="text-align:right;border-top:2px solid #111;padding-top:8px">Total: {{total}}</h3><p>Paid <b style="float:right">{{paid}}</b></p><p>Balance <b style="float:right">{{balance}}</b></p></div></div>`; const source = customTemplate || fallback; const map = { businessName: settings.businessName, businessTagline: '', businessAddress: settings.address || 'Company Address', businessPhone: settings.phone || '-', businessEmail: settings.email || '-', businessGstin: settings.gstin || '-', logo: settings.logo || '', invoiceNumber: viewInv.number, invoiceDate: viewInv.date, dueDate: viewInv.dueDate, status: viewInv.status, paymentMode: viewInv.paymentMode || 'Cash', taxLabel, customerName: c?.name || 'Walk-in Customer', customerAddress: c?.address || 'Counter sale', customerPhone: c?.phone || '-', customerGstin: c?.gstin || '-', subtotal: money(totals.subtotal, settings.currency), cgst: `${viewInv.cgstRate}%`, sgst: `${viewInv.sgstRate}%`, taxSummaryHtml, tax: `${totalTaxPct}%`, discount: money(totals.discount, settings.currency), total: money(totals.total, settings.currency), paid: money(totals.paid, settings.currency), balance: money(totals.balance, settings.currency), notes: viewInv.notes || 'Thank you for your business.', itemRows: itemRowsHtml }; return source.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => map[key] ?? ''); };
  const summaryRows = viewInv.taxMode === 'IGST' ? [[ '', 'IGST', `${totalTaxPct}%` ]] : [ [ '', 'CGST', `${viewInv.cgstRate}%` ], [ '', 'SGST', `${viewInv.sgstRate}%` ] ];

  const buildPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    const pageW = doc.internal.pageSize.getWidth(), pageH = doc.internal.pageSize.getHeight(), margin = 34, safe = cleanPdfText, headerBottom = 132;
    const usableW = pageW - margin * 2;
    const drawHeader = () => drawCompanyPdfHeader(doc, settings, 'TAX INVOICE');
    drawHeader();
    autoTable(doc, { startY: headerBottom + 10, theme: 'grid', margin: { left: margin, right: margin, top: headerBottom + 10, bottom: 34 }, styles: { font: 'helvetica', fontSize: 8.7, cellPadding: 5, overflow: 'linebreak', valign: 'middle', lineColor: [17,24,39], lineWidth: .4, textColor: [17,24,39], minCellHeight: 22 }, headStyles: { fillColor: [241,245,249], textColor: [17,24,39], fontStyle: 'bold', halign: 'center' }, columnStyles: { 0: { cellWidth: usableW / 2 }, 1: { cellWidth: usableW / 2 } }, body: [[{ content: `CUSTOMER DETAILS\n${safe(c?.name || 'Walk-in Customer')}\n${safe(c?.address || 'Counter sale')}\nPhone: ${safe(c?.phone || '-')}\nGSTIN: ${safe(c?.gstin || '-')}` }, { content: `INVOICE DETAILS\nInvoice No: ${safe(viewInv.number)}\nDate: ${safe(viewInv.date || '-')}\nDue Date: ${safe(viewInv.dueDate || '-')}\nPayment: ${safe(viewInv.paymentMode || 'Cash')}\nStatus: ${safe(viewInv.status || '-')}` }]], didDrawPage: data => { if (data.pageNumber > 1) drawHeader(); } });
    autoTable(doc, { startY: doc.lastAutoTable.finalY + 14, showHead: 'everyPage', margin: { left: margin, right: margin, top: headerBottom + 10, bottom: 38 }, theme: 'grid', head: [['#','Product / Details','HSN','Qty','Rate','Tax','Discount','Amount']], body: viewInv.items.map((l, idx) => [idx + 1, safe(l.name || 'Item'), safe(l.hsn || '-'), safe(l.qty || '-'), safe(money(l.price, settings.currency)), safe(lineTaxText(l)), safe(lineDiscountText(l)), safe(money(lineFinalAmount(l), settings.currency))]), styles: { font: 'helvetica', fontSize: 7.8, cellPadding: { top: 5, right: 3, bottom: 5, left: 3 }, overflow: 'linebreak', valign: 'middle', lineColor: [17,24,39], lineWidth: .35, textColor: [17,24,39], minCellHeight: 22 }, headStyles: { fillColor: [17,24,39], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 7.8, minCellHeight: 24 }, columnStyles: { 0:{cellWidth:24,halign:'center'}, 1:{cellWidth:138}, 2:{cellWidth:42,halign:'center'}, 3:{cellWidth:34,halign:'right'}, 4:{cellWidth:62,halign:'right'}, 5:{cellWidth:86,halign:'right'}, 6:{cellWidth:60,halign:'right'}, 7:{cellWidth:usableW - 446,halign:'right'} }, didDrawPage: data => { if (data.pageNumber > 1) drawHeader(); } });
    let y = doc.lastAutoTable.finalY + 16; if (y > pageH - 200) { doc.addPage(); drawHeader(); y = headerBottom + 12; }
    const body = [[`Notes\n${safe(viewInv.notes || 'Thank you for your business.')}`, 'Subtotal', safe(money(totals.subtotal, settings.currency))], ...summaryRows, ['', 'Total', safe(money(totals.total, settings.currency))], ['', 'Paid', safe(money(totals.paid, settings.currency))], ['', 'Balance', safe(money(totals.balance, settings.currency))]];
    autoTable(doc, { startY: y, theme: 'grid', margin: { left: margin, right: margin, top: headerBottom + 10, bottom: 38 }, styles: { font: 'helvetica', fontSize: 8.8, cellPadding: 5, overflow: 'linebreak', lineColor: [17,24,39], lineWidth: .3, textColor: [17,24,39], minCellHeight: 20 }, columnStyles: { 0:{cellWidth:usableW - 240}, 1:{cellWidth:110, fontStyle:'bold'}, 2:{cellWidth:130, halign:'right', fontStyle:'bold'} }, body, didParseCell: d => { if (d.column.index > 0 && d.row.raw?.[1] === 'Total') { d.cell.styles.fontStyle = 'bold'; d.cell.styles.fontSize = 11; d.cell.styles.fillColor = [241,245,249]; } }, didDrawPage: data => { if (data.pageNumber > 1) drawHeader(); } });
    y = doc.lastAutoTable.finalY + 55; if (y > pageH - 40) { doc.addPage(); drawHeader(); y = headerBottom + 70; }
    doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.line(pageW - margin - 150, y - 12, pageW - margin, y - 12); doc.text('Authorized Signature', pageW - margin, y, { align: 'right' });
    const pages = doc.internal.getNumberOfPages(); for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(90); doc.text(`Page ${i} of ${pages}`, pageW / 2, pageH - 14, { align: 'center' }); doc.setDrawColor(17, 24, 39); doc.setLineWidth(1.5); doc.rect(15, 15, pageW - 30, pageH - 30, 'S'); } doc.setTextColor(20);
    return doc;
  };

  const shareWhatsApp = async () => { setBusy('whatsapp'); setShareMsg({ type: '', text: '' }); try { const doc = buildPdf(); await sharePdfToWhatsApp({ doc, fileName: `${viewInv.number}.pdf`, title: `${viewInv.number} Invoice PDF`, phone: c?.phone }); setShareMsg({ type: '', text: '' }); } catch (err) { setShareMsg({ type: 'error', text: 'PDF WhatsApp share failed: ' + (err.message || 'Please try again.') }); } finally { setBusy(''); } };
  
  const triggerSystemPrint = () => {
    window.print();
  };

  React.useEffect(() => {
    if (showPrintPreview) {
      const style = document.createElement('style');
      style.id = 'invoice-print-preview-style';
      style.textContent = `
        @media print {
          @page { size: A4; margin: 15mm !important; }
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
            border: 2px solid #111827 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 15mm !important;
            display: block !important;
          }
        }
      `;
      document.head.appendChild(style);
      return () => {
        style.remove();
      };
    }
  }, [showPrintPreview]);

  const chooseTemplate = value => { setTemplate(value); localStorage.setItem('sma-invoice-template-choice', value); };
  const addTemplate = event => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = e => { const text = String(e.target.result || ''); localStorage.setItem('sma-custom-invoice-template', text); setCustomTemplate(text); chooseTemplate('custom'); setTemplateMsg(''); event.target.value = ''; }; reader.onerror = () => { setTemplateMsg('Template file read panna mudiyala. HTML/TXT file select pannunga.'); event.target.value = ''; }; reader.readAsText(file); };
  const itemAmount = l => money(lineFinalAmount(l), settings.currency);
  const taxRows = viewInv.taxMode === 'IGST' ? html`<p className="flex justify-between"><span>IGST</span><b>${totalTaxPct}%</b></p>` : html`<p className="flex justify-between"><span>CGST</span><b>${viewInv.cgstRate}%</b></p><p className="flex justify-between"><span>SGST</span><b>${viewInv.sgstRate}%</b></p>`;
  
  const invoiceArticle = (sma=false) => html`
    <article className=${sma ? 'print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]' : templateStyle.article}>
      <div className=${sma ? '' : templateStyle.head}>
        <${CompanyPrintHeader} settings=${settings} />
      </div>
      
      ${sma ? html`<div className="sma-title-row"><span>TAX INVOICE</span></div>` : html`<div className="text-center mt-4 mb-5"><p className="inline-block rounded border border-slate-900 px-8 py-1 text-sm font-black uppercase tracking-widest bg-slate-50">Tax Invoice</p></div>`}
      
      <section className=${sma ? 'sma-info-grid' : 'grid grid-cols-2 gap-4 border-b py-5 text-sm'}>
        <div>
          <p className="font-black uppercase text-slate-500 text-[10px] tracking-widest mb-1">Customer Details</p>
          <h3 className="text-lg font-black">${c?.name || 'Walk-in Customer'}</h3>
          <p className="leading-6">${c?.address || 'Counter sale'}<br/>Phone: ${c?.phone || '-'}<br/>GSTIN: ${c?.gstin || '-'}</p>
        </div>
        <div className=${sma ? '' : 'text-right'}>
          <p><b>Invoice No:</b> ${viewInv.number}</p>
          <p><b>Date:</b> ${viewInv.date}</p>
          <p><b>Due Date:</b> ${viewInv.dueDate}</p>
          <p><b>Status:</b> ${viewInv.status}</p>
          <p><b>Payment Mode:</b> ${viewInv.paymentMode || 'Cash'}</p>
          <p><b>Tax:</b> ${taxLabel}</p>
        </div>
      </section>
      
      <table className=${sma ? 'sma-items-table' : 'mt-5 w-full text-sm'}>
        <thead className=${sma ? '' : templateStyle.table}>
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">HSN</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Rate</th>
            <th className="p-2 text-right">Tax</th>
            <th className="p-2 text-right">Discount</th>
            <th className="p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${viewInv.items.map((l, idx) => html`<tr key=${`${l.name}-${idx}`} className="border-b"><td className="p-2">${idx + 1}</td><td className="p-2 font-bold">${l.name}</td><td className="p-2">${l.hsn || '-'}</td><td className="p-2 text-right">${l.qty}</td><td className="p-2 text-right">${money(l.price, settings.currency)}</td><td className="p-2 text-right">${lineTaxText(l)}</td><td className="p-2 text-right">${lineDiscountText(l)}</td><td className="p-2 text-right font-bold">${itemAmount(l)}</td></tr>`)}
        </tbody>
      </table>
      
      <section className=${sma ? 'sma-bottom-grid' : 'ml-auto mt-6 max-w-sm space-y-2 text-sm'}>
        <div>
          <h3 className="font-black uppercase text-slate-500 text-[10px] tracking-widest mb-2">Notes</h3>
          <p className="text-sm italic">${viewInv.notes || 'Thank you for your business.'}</p>
        </div>
        <div className=${sma ? 'sma-total-box' : ''}>
          <p className="flex justify-between"><span>Subtotal</span><b>${money(totals.subtotal, settings.currency)}</b></p>
          ${taxRows}
          <p className="flex justify-between border-t-2 border-slate-900 pt-3 text-xl font-black"><span>Total</span><span>${money(totals.total, settings.currency)}</span></p>
          <p className="flex justify-between"><span>Paid</span><b>${money(totals.paid, settings.currency)}</b></p>
          <p className="flex justify-between"><span>Balance</span><b>${money(totals.balance, settings.currency)}</b></p>
        </div>
      </section>
      
      <footer className="sma-sign-row mt-12 pt-8 flex justify-between">
        <div className="text-center w-48 border-t border-slate-300 pt-2 text-[10px] uppercase font-bold text-slate-400">Customer Signature</div>
        <div className="text-center w-48 border-t border-slate-900 pt-2 text-[10px] uppercase font-bold">Authorized Signature</div>
      </footer>
    </article>
  `;
  
  return html`
    <div className="space-y-4">
      <div className="no-print flex flex-wrap justify-between gap-3">
        <${Link} to="/invoices" className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-bold">
          <${ArrowLeft} size=${17} /> Back
        </${Link}>
        <div className="flex flex-wrap gap-2">
          <select value=${template} onChange=${e => chooseTemplate(e.target.value)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 font-black" aria-label="Invoice template">
            <option value="sma">SMA Print Format</option>
            <option value="classic">Classic Template</option>
            <option value="modern">Modern Template</option>
            <option value="compact">Compact Template</option>
            <option value="gst">GST Box Template</option>
            <option value="letterhead">Letterhead Template</option>
            <option value="professional">Professional Teal Template</option>
            <option value="elegant">Elegant Coral Template</option>
            <option value="minimalist">Minimalist Steel Template</option>
            ${customTemplate ? html`<option value="custom">My Local Template</option>` : ''}
          </select>
          <button onClick=${() => setShowPrintPreview(true)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white">
            <${MessageCircle} size=${17} /> WhatsApp PDF
          </button>
          <button onClick=${() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black">
            <${Upload} size=${17} /> Add Template
          </button>
          <input ref=${fileInputRef} type="file" accept=".html,.htm,.txt,text/html,text/plain" onChange=${addTemplate} className="hidden" />
          <button onClick=${() => setShowPrintPreview(true)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">
            <${Printer} size=${17} /> Print Invoice
          </button>
        </div>
      </div>
      
      ${shareMsg.text ? html`<div className=${`no-print rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${shareMsg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-700'}`}>${shareMsg.text}</div>` : ''}
      ${templateMsg ? html`<div className="no-print rounded-[var(--radius-md)] bg-emerald-500/10 p-3 text-sm font-bold text-emerald-700">${templateMsg}</div>` : ''}
      
      ${template === 'custom' ? html`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{ __html: customPrintHtml() }}></article>` : invoiceArticle(template === 'sma')}

      ${showPrintPreview && html`
        <div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex items-center justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print">
            <span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Invoice #${viewInv.number}</span>
            <div className="flex gap-2">
              <button disabled=${!!busy} onClick=${shareWhatsApp} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white disabled:opacity-60">
                <${MessageCircle} size=${17} /> ${busy === 'whatsapp' ? 'Sharing...' : 'WhatsApp Share'}
              </button>
              <button onClick=${triggerSystemPrint} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">
                <${Printer} size=${17} /> Print
              </button>
              <button onClick=${() => setShowPrintPreview(false)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black text-[hsl(var(--foreground))] bg-[hsl(var(--card))]">
                <${X} size=${17} /> Close
              </button>
            </div>
          </div>
          ${shareMsg.text ? html`<div className="w-full max-w-4xl mb-4 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${shareMsg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-700'}">${shareMsg.text}</div>` : ''}
          <div className="w-full max-w-4xl">
            ${template === 'custom' ? html`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{ __html: customPrintHtml() }}></article>` : invoiceArticle(template === 'sma')}
          </div>
        </div>
      `}
    </div>
  `;
}
