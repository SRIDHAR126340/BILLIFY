/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import jsPDF from 'https://esm.sh/jspdf';
import { html } from '../jsx.js';
import {ShoppingCart, Plus, Paperclip, CheckCircle2, AlertCircle, Printer, Eye, Loader2, MessageCircle, X, Download} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { sharePdfToWhatsApp } from '../utils/whatsappPdf.js';
import { useBillingStore } from '../store/useBillingStore.js';
import { drawCompanyPdfHeader } from '../utils/companyPdf.js';
import { CompanyPrintHeader } from '../components/CompanyPrintHeader.js';

const initialRfq = { companyName: '', contactPerson: '', emailPhone: '', productService: '', quantity: '', details: '', attachmentName: '' };
const PO_KEY = 'sma-purchase-orders';
const safeOrders = () => { try { return JSON.parse(localStorage.getItem(PO_KEY) || '[]'); } catch (err) { return []; } };
const poNumber = count => `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

export function PurchaseOrders() {
  const settings = useBillingStore(s => s.settings);
  const [rfq, setRfq] = React.useState(initialRfq);
  const [orders, setOrders] = React.useState(safeOrders);
  const [showForm, setShowForm] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });
  const [previewOrder, setPreviewOrder] = React.useState(null);
  const updateRfq = (field, value) => { setRfq(form => ({ ...form, [field]: value })); if (message.text) setMessage({ type: '', text: '' }); };
  
  const buildPdf = order => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth(), pageH = doc.internal.pageSize.getHeight();
    drawCompanyPdfHeader(doc, settings, `PURCHASE ORDER: ${order.number}`);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 40, 145);
    doc.text(`Company: ${order.companyName}`, 40, 175);
    doc.text(`Contact: ${order.contactPerson}`, 40, 195);
    doc.text(`Email / Phone: ${order.emailPhone}`, 40, 215);
    doc.text(`Product / Service: ${order.productService}`, 40, 255);
    doc.text(`Quantity: ${order.quantity}`, 40, 275);
    doc.text(`Details: ${order.details}`, 40, 315, { maxWidth: 515 });

    // Draw outer page border frame
    doc.setDrawColor(17, 24, 39);
    doc.setLineWidth(1.5);
    doc.rect(15, 15, pageW - 30, pageH - 30, 'S');

    return doc;
  };

  const shareWhatsApp = order => sharePdfToWhatsApp({ doc: buildPdf(order), fileName: `${order.number}.pdf`, title: `${order.number} Purchase Order PDF`, phone: order.emailPhone });
  const submitRfq = async event => { event.preventDefault(); setSubmitting(true); setMessage({ type: '', text: '' }); try { if (!rfq.companyName.trim() || !rfq.contactPerson.trim() || !rfq.emailPhone.trim() || !rfq.productService.trim() || !rfq.quantity.trim() || !rfq.details.trim()) throw new Error('Please fill all required purchase order fields.'); const nextOrder = { ...rfq, id: `po_${Date.now()}`, number: poNumber(orders.length), date: new Date().toISOString() }; const next = [{ ...nextOrder, whatsappShared: true, pdfGenerated: true }, ...orders]; localStorage.setItem(PO_KEY, JSON.stringify(next)); window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } })); setOrders(next); setRfq(initialRfq); setShowForm(false); setPreviewOrder(nextOrder); } catch (err) { setMessage({ type: 'error', text: 'Failed to create purchase order: ' + (err.message || 'Please try again.') }); } finally { setSubmitting(false); } };
  const printOrder = order => { try { const doc = buildPdf(order); doc.save(`${order.number}.pdf`); } catch (err) { setMessage({ type: 'error', text: 'PDF download failed.' }); } };
  const shareSavedOrder = async order => { setSubmitting(true); setMessage({ type: '', text: '' }); try { await shareWhatsApp(order); setMessage({ type: '', text: '' }); } catch (err) { setMessage({ type: 'error', text: 'WhatsApp PDF share failed: ' + (err.message || 'Please allow file sharing permission.') }); } finally { setSubmitting(false); } };

  const triggerSystemPrint = () => {
    window.print();
  };

  React.useEffect(() => {
    if (previewOrder) {
      const style = document.createElement('style');
      style.id = 'purchase-order-print-preview-style';
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
  }, [previewOrder]);

  const renderPurchaseOrderTemplate = order => {
    if (!order) return '';
    return html`
      <article className="print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]">
        <${CompanyPrintHeader} settings=${settings} />
        
        <div className="text-center mt-4 mb-5">
          <p className="inline-block rounded border border-slate-900 px-8 py-1 text-sm font-black uppercase tracking-widest bg-slate-50">
            Purchase Order
          </p>
        </div>
        
        <section className="grid grid-cols-2 gap-4 border-b py-5 text-sm">
          <div>
            <p className="font-black uppercase text-slate-500 text-[10px] tracking-widest mb-1">Vendor Details</p>
            <h3 className="text-lg font-black">${order.companyName}</h3>
            <p className="leading-6">
              Contact: ${order.contactPerson}<br/>
              Phone/Email: ${order.emailPhone}
            </p>
          </div>
          <div className="text-right">
            <p><b>PO Number:</b> ${order.number}</p>
            <p><b>Date:</b> ${new Date(order.date).toLocaleDateString()}</p>
            <p><b>Status:</b> Pending</p>
          </div>
        </section>
        
        <table className="mt-5 w-full text-sm sma-items-table">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Product / Service</th>
              <th className="p-2 text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">1</td>
              <td className="p-2 font-bold">${order.productService}</td>
              <td className="p-2 text-right">${order.quantity}</td>
            </tr>
          </tbody>
        </table>
        
        <section className="grid grid-cols-1 gap-4 py-5 text-sm mt-4">
          <div>
            <h3 className="font-black uppercase text-slate-500 text-[10px] tracking-widest mb-2">Requirement Details</h3>
            <p className="text-sm whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 border rounded-[var(--radius-md)]">${order.details}</p>
          </div>
        </section>
        
        <footer className="sma-sign-row mt-12 pt-8 flex justify-between">
          <div className="text-center w-48 border-t border-slate-300 pt-2 text-[10px] uppercase font-bold text-slate-400">Vendor Signature</div>
          <div className="text-center w-48 border-t border-slate-900 pt-2 text-[10px] uppercase font-bold">Authorized Signature</div>
        </footer>
      </article>
    `;
  };

  return html`<div className="space-y-5"><div className="card p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-[hsl(var(--muted-foreground))]">Purchase Module</p><h2 className="mt-2 flex items-center gap-2 text-2xl font-black"><${ShoppingCart} /> Purchase Orders</h2></div><button disabled=${submitting} onClick=${() => { setShowForm(true); setMessage({ type: '', text: '' }); }} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white disabled:opacity-60"><${Plus} size=${18} /> New Purchase Order</button></div></div>${message.text ? html`<div className=${`flex items-center gap-2 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${message.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-700'}`}>${message.type === 'success' ? html`<${CheckCircle2} size=${18} />` : html`<${AlertCircle} size=${18} />`}${message.text}</div>` : ''}${showForm ? html`<section className="card overflow-hidden"><div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--primary)/0.04)] p-6"><h2 className="text-2xl font-black tracking-tight">New Purchase Order</h2></div><form onSubmit=${submitRfq} className="p-6"><div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-bold">Company Name<input required disabled=${submitting} value=${rfq.companyName} onInput=${e => updateRfq('companyName', e.target.value)} placeholder="Supplier / company name" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold">Contact Person<input required disabled=${submitting} value=${rfq.contactPerson} onInput=${e => updateRfq('contactPerson', e.target.value)} placeholder="Contact person name" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold">Email / Phone<input required disabled=${submitting} value=${rfq.emailPhone} onInput=${e => updateRfq('emailPhone', e.target.value)} placeholder="email@example.com / mobile" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold">Product or Service<input required disabled=${submitting} value=${rfq.productService} onInput=${e => updateRfq('productService', e.target.value)} placeholder="Product / service" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold">Quantity<input required disabled=${submitting} value=${rfq.quantity} onInput=${e => updateRfq('quantity', e.target.value)} placeholder="Required quantity" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60" /></label><label className="text-sm font-bold md:col-span-2">Purchase Order Details<textarea required disabled=${submitting} value=${rfq.details} onInput=${e => updateRfq('details', e.target.value)} placeholder="Requirement details, delivery terms, notes" className="focus-ring mt-1 min-h-32 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3 disabled:opacity-60"></textarea></label></div><div className="mt-6 flex flex-wrap justify-end gap-2"><button disabled=${submitting} type="button" onClick=${() => setShowForm(false)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-6 py-3 font-black disabled:opacity-60">Cancel</button><button disabled=${submitting} type="submit" className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-6 py-3 font-black text-white shadow-[var(--shadow-sm)] disabled:opacity-60">${submitting ? html`<${Loader2} className="animate-spin" size=${18} />` : html`<MessageCircle size=${18} />`} ${submitting ? 'Generating PDF & Opening WhatsApp...' : 'Submit & WhatsApp PDF'}</button></div></form></section>` : ''}<section className="card overflow-hidden"><div className="border-b border-[hsl(var(--border))] p-5"><h3 className="font-black">Purchase Orders History</h3></div>${orders.length ? html`<div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]"><tr><th className="p-4">PO Prefix</th><th className="p-4">Date</th><th className="p-4">Company</th><th className="p-4">Email / Phone</th><th className="p-4">Product</th><th className="p-4">Qty</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>${orders.map(order => html`<tr key=${order.id} className="border-t border-[hsl(var(--border))]"><td className="p-4 font-black"><button onClick=${() => setPreviewOrder(order)} className="text-[hsl(var(--primary))] hover:underline">${order.number}</button></td><td className="p-4">${new Date(order.date).toLocaleDateString()}</td><td className="p-4">${order.companyName}</td><td className="p-4">${order.emailPhone}</td><td className="p-4">${order.productService}</td><td className="p-4">${order.quantity}</td><td className="p-4 text-right"><div className="flex flex-wrap justify-end gap-2"><button onClick=${() => setPreviewOrder(order)} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-emerald-600 px-3 py-2 text-xs font-black text-white"><${MessageCircle} size=${14} /> WhatsApp PDF</button><button onClick=${() => setPreviewOrder(order)} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[hsl(var(--primary))] px-3 py-2 text-xs font-black text-white"><${Printer} size=${14} /> Print</button></div></td></tr>`)}</tbody></table></div>` : html`<div className="grid place-items-center p-10 text-center"><div className="grid h-16 w-16 place-items-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"><${Eye} size=${30} /></div><h3 className="mt-4 text-lg font-black">No purchase orders yet</h3></div>`}</section>${previewOrder && html`<div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center"><div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex items-center justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print"><span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Purchase Order #${previewOrder.number}</span><div className="flex gap-2"><button disabled=${submitting} onClick=${() => shareSavedOrder(previewOrder)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white disabled:opacity-60"><${MessageCircle} size=${17} /> ${submitting ? 'Sharing...' : 'WhatsApp Share'}</button><button onClick=${triggerSystemPrint} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white"><${Printer} size=${17} /> Print</button><button onClick=${() => setPreviewOrder(null)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black text-[hsl(var(--foreground))] bg-[hsl(var(--card))]"><${X} size=${17} /> Close</button></div></div>${message.text ? html`<div className="w-full max-w-4xl mb-4 flex items-center gap-2 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${message.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-700'}">${message.type === 'success' ? html`<${CheckCircle2} size=${18} />` : html`<${AlertCircle} size=${18} />`}${message.text}</div>` : ''}<div className="w-full max-w-4xl">${renderPurchaseOrderTemplate(previewOrder)}</div></div>`}</div>`;
}
