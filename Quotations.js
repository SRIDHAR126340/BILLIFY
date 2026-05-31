/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import jsPDF from 'https://esm.sh/jspdf';
import { html } from '../jsx.js';
import { Link } from 'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0';
import {FileText, Plus, Printer, MessageCircle, X, Eye, Download} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { money } from '../utils/format.js';
import { sharePdfToWhatsApp } from '../utils/whatsappPdf.js';
import { CompanyPrintHeader } from '../components/CompanyPrintHeader.js';
import { drawCompanyPdfHeader } from '../utils/companyPdf.js';

export function Quotations() {
  const settings = useBillingStore(s => s.settings);
  const [template, setTemplate] = React.useState(() => settings.invoiceTemplateChoice || localStorage.getItem('sma-invoice-template-choice') || 'sma');
  const [busy, setBusy] = React.useState('');
  const [msg, setMsg] = React.useState({ type: '', text: '' });
  const [showPrintPreview, setShowPrintPreview] = React.useState(false);
  const cgstRate = Number(settings.defaultCgstRate ?? 9);
  const sgstRate = Number(settings.defaultSgstRate ?? 9);
  const totalGstRate = cgstRate + sgstRate;
  const gstLabel = `CGST + SGST: ${totalGstRate}%`;
  const quoteNo = `QT-${new Date().getFullYear()}-0001`;

  React.useEffect(() => {
    if (settings.invoiceTemplateChoice) {
      setTemplate(settings.invoiceTemplateChoice);
    }
  }, [settings.invoiceTemplateChoice]);
  
  const buildPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth(), pageH = doc.internal.pageSize.getHeight();
    drawCompanyPdfHeader(doc, settings, `QUOTATION: ${quoteNo}`);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toISOString().slice(0, 10)} | Tax: ${totalGstRate}%`, 40, 145);
    doc.text('Customer: Customer Name', 40, 165);
    doc.text(`1. Product / Service | HSN - | Qty 1 | Rate ${money(0, settings.currency)} | Tax ${totalGstRate}%`, 40, 205, { maxWidth: 515 });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`Grand Total: ${money(0, settings.currency)}`, 360, 265);
    
    // Draw outer page border frame
    doc.setDrawColor(17, 24, 39);
    doc.setLineWidth(1.5);
    doc.rect(15, 15, pageW - 30, pageH - 30, 'S');
    
    return doc;
  };

  const printQuotation = () => { try { const doc = buildPdf(); doc.save(`${quoteNo}.pdf`); } catch (err) { setMsg({ type: 'error', text: 'PDF generate panna mudiyala.' }); } };
  const shareWhatsApp = async () => { setBusy('whatsapp'); setMsg({ type: '', text: '' }); try { await sharePdfToWhatsApp({ doc: buildPdf(), fileName: `${quoteNo}.pdf`, title: `${quoteNo} Quotation PDF` }); setMsg({ type: '', text: '' }); } catch (err) { setMsg({ type: 'error', text: 'WhatsApp PDF share failed: ' + (err.message || 'Please allow file sharing permission.') }); } finally { setBusy(''); } };
  
  const quoteStyle = 
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

  const triggerSystemPrint = () => {
    window.print();
  };

  React.useEffect(() => {
    if (showPrintPreview) {
      const style = document.createElement('style');
      style.id = 'quotation-print-preview-style';
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

  const esc = value => String(value ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const customPrintHtml = () => {
    const customTemplateText = localStorage.getItem('sma-custom-invoice-template') || '';
    if (!customTemplateText) return '';
    const itemRowsHtml = `<tr><td>1</td><td>${esc('Product / Service')}</td><td>-</td><td style="text-align:right">1</td><td style="text-align:right">${esc(money(0, settings.currency))}</td><td style="text-align:right">${totalGstRate}%</td><td style="text-align:right">-</td><td style="text-align:right">${esc(money(0, settings.currency))}</td></tr>`;
    const taxSummaryHtml = `<p><span>CGST</span><b>${cgstRate}%</b></p><p><span>SGST</span><b>${sgstRate}%</b></p>`;
    
    const map = {
      businessName: settings.businessName,
      businessTagline: '',
      businessAddress: settings.address || 'Company Address',
      businessPhone: settings.phone || '-',
      businessEmail: settings.email || '-',
      businessGstin: settings.gstin || '-',
      logo: settings.logo || '',
      invoiceNumber: quoteNo,
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: '-',
      status: 'Quotation',
      paymentMode: '-',
      taxLabel: `${totalGstRate}%`,
      customerName: 'Customer Name',
      customerAddress: 'Address',
      customerPhone: '-',
      customerGstin: '-',
      subtotal: money(0, settings.currency),
      cgst: `${cgstRate}%`,
      sgst: `${sgstRate}%`,
      taxSummaryHtml,
      tax: `${totalGstRate}%`,
      discount: money(0, settings.currency),
      total: money(0, settings.currency),
      paid: money(0, settings.currency),
      balance: money(0, settings.currency),
      notes: 'Thank you for your business.',
      itemRows: itemRowsHtml
    };
    return customTemplateText.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => map[key] ?? '');
  };

  const renderQuotationHeader = () => html`<${CompanyPrintHeader} settings=${settings} />`;
  const renderQuotationTitle = () => html`<div className="text-center mt-4 mb-5"><p className="inline-block rounded border border-slate-900 px-8 py-1 text-sm font-black uppercase tracking-widest bg-slate-50">Quotation</p></div>`;

  const renderSmaQuotation = () => html`<article className="print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]"><div className="sma-doc-title">QUOTATION</div><${CompanyPrintHeader} settings=${settings} /><section className="sma-info-grid"><div><h3>Quote To</h3><p className="sma-strong">Customer Name</p><p>Address</p><p>Phone: -</p><p>GSTIN: -</p></div><div><h3>Quotation Details</h3><p><b>Quotation No:</b> ${quoteNo}</p><p><b>Date:</b> ${new Date().toISOString().slice(0, 10)}</p><p><b>Valid Until:</b> -</p><p><b>Tax:</b> ${totalGstRate}%</p></div></section><table className="sma-items-table"><thead><tr><th>#</th><th className="text-left">Description</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Tax</th><th>Amount</th></tr></thead><tbody><tr><td>1</td><td className="text-left sma-strong">Product / Service</td><td>-</td><td>1</td><td>${money(0, settings.currency)}</td><td>${totalGstRate}%</td><td>${money(0, settings.currency)}</td></tr></tbody></table><section className="sma-bottom-grid"><div><h3>Terms</h3><p>Thank you for your business.</p><p className="sma-tax-note">Prices are valid as per quotation validity.</p></div><div className="sma-total-box"><p><span>Subtotal</span><b>${money(0, settings.currency)}</b></p><p><span>CGST</span><b>${cgstRate}%</b></p><p><span>SGST</span><b>${sgstRate}%</b></p><p className="sma-grand"><span>Grand Total</span><b>${money(0, settings.currency)}</b></p></div></section><footer className="sma-sign-row"><div>Customer Signature</div><div>Authorized Signature</div></footer></article>`;
  
  const rawArticle = () => html`
    <article className=${quoteStyle.article}>
      <div className=${quoteStyle.head}>
        <${CompanyPrintHeader} settings=${settings} />
      </div>
      ${renderQuotationTitle()}
      <section className="grid grid-cols-2 gap-4 border-b py-5 text-sm">
        <div>
          <p className="font-black uppercase text-slate-500">Customer Details</p>
          <h3 className="mt-2 text-lg font-black">Customer Name</h3>
          <p className="leading-6">Address<br/>Phone: -<br/>GSTIN: -</p>
        </div>
        <div className="text-right">
          <p><b>Quotation No:</b> ${quoteNo}</p>
          <p><b>Date:</b> ${new Date().toISOString().slice(0, 10)}</p>
          <p><b>Valid Until:</b> -</p>
          <p><b>Tax:</b> ${totalGstRate}%</p>
        </div>
      </section>
      <table className="mt-5 w-full text-sm">
        <thead className=${quoteStyle.table}>
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">HSN</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Rate</th>
            <th className="p-2 text-right">Tax</th>
            <th className="p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">1</td>
            <td className="p-2 font-bold">Product / Service</td>
            <td className="p-2">-</td>
            <td className="p-2 text-right">1</td>
            <td className="p-2 text-right">${money(0, settings.currency)}</td>
            <td className="p-2 text-right">${totalGstRate}%</td>
            <td className="p-2 text-right font-bold">${money(0, settings.currency)}</td>
          </tr>
        </tbody>
      </table>
      <section className="ml-auto mt-6 max-w-sm space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><b>${money(0, settings.currency)}</b></div>
        <div className="flex justify-between"><span>CGST</span><b>${cgstRate}%</b></div>
        <div className="flex justify-between"><span>SGST</span><b>${sgstRate}%</b></div>
        <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-xl font-black"><span>Total</span><span>${money(0, settings.currency)}</span></div>
      </section>
    </article>
  `;

  return html`
    <div className="space-y-5">
      <div className="card p-6 no-print">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black"><${FileText} /> Quotations</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value=${template} onChange=${e => setTemplate(e.target.value)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-3 font-bold" aria-label="Quotation print template">
              <option value="sma">SMA Print Format</option>
              <option value="classic">Classic Template</option>
              <option value="modern">Modern Template</option>
              <option value="compact">Compact Template</option>
              <option value="gst">GST Box Template</option>
              <option value="letterhead">Letterhead Template</option>
              <option value="professional">Professional Teal Template</option>
              <option value="elegant">Elegant Coral Template</option>
              <option value="minimalist">Minimalist Steel Template</option>
              ${localStorage.getItem('sma-custom-invoice-template') ? html`<option value="custom">My Local Template</option>` : ''}
            </select>
            <button onClick=${() => setShowPrintPreview(true)} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-3 font-black text-white">
              <${MessageCircle} size=${18} /> WhatsApp PDF
            </button>
            <button onClick=${() => setShowPrintPreview(true)} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white">
              <${Printer} size=${18} /> Print
            </button>
            <${Link} to="/invoices/new" className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white">
              <${Plus} size=${18} /> Create Quotation
            </${Link}>
          </div>
        </div>
      </div>
      
      ${msg.text ? html`<div className=${`no-print rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${msg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-700'}`}>${msg.text}</div>` : ''}
      
      ${template === 'custom' ? html`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{ __html: customPrintHtml() }}></article>` : template === 'sma' ? renderSmaQuotation() : rawArticle()}

      ${showPrintPreview && html`
        <div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex items-center justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print">
            <span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Quotation #${quoteNo}</span>
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
          ${msg.text ? html`<div className="w-full max-w-4xl mb-4 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${msg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-700'}">${msg.text}</div>` : ''}
          <div className="w-full max-w-4xl">
            ${template === 'custom' ? html`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{ __html: customPrintHtml() }}></article>` : template === 'sma' ? renderSmaQuotation() : rawArticle()}
          </div>
        </div>
      `}
    </div>
  `;
}
