/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import jsPDF from 'https://esm.sh/jspdf';
import { html } from '../jsx.js';
import { Link } from 'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0';
import {FileSpreadsheet, Plus, Printer, MessageCircle, X, Eye, Download, Trash2, Save, ArrowLeft, AlertCircle, CheckCircle2, Loader2} from 'https://esm.sh/lucide-react?deps=react@19.2.0';
import { useBillingStore } from '../store/useBillingStore.js';
import { money } from '../utils/format.js';
import { sharePdfToWhatsApp } from '../utils/whatsappPdf.js';
import { CompanyPrintHeader } from '../components/CompanyPrintHeader.js';
import { drawCompanyPdfHeader } from '../utils/companyPdf.js';

export function Estimates() {
  const settings = useBillingStore(s => s.settings);
  const customers = useBillingStore(s => s.customers);
  const items = useBillingStore(s => s.items);

  const [template, setTemplate] = React.useState(() => settings.invoiceTemplateChoice || localStorage.getItem('sma-invoice-template-choice') || 'sma');
  const [busy, setBusy] = React.useState('');
  const [msg, setMsg] = React.useState({ type: '', text: '' });
  const [showPrintPreview, setShowPrintPreview] = React.useState(false);
  const [previewEstimate, setPreviewEstimate] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    if (settings.invoiceTemplateChoice) {
      setTemplate(settings.invoiceTemplateChoice);
    }
  }, [settings.invoiceTemplateChoice]);

  // Load estimates from localStorage (sma-estimates-v1) - No default demo data loaded
  const [estimates, setEstimates] = React.useState(() => {
    try {
      const saved = localStorage.getItem('sma-estimates-v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // New estimate state
  const [rfq, setRfq] = React.useState({
    number: '',
    date: new Date().toISOString().slice(0, 10),
    customerId: '',
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    discount: '',
    discountType: 'amount',
    items: [
      { itemId: '', name: '', hsn: '', qty: '', price: '', discount: '', discountType: 'amount' }
    ],
    notes: 'Thank you for your business.'
  });

  const calcLineBase = (line) => Number(line.qty || 0) * Number(line.price || 0);
  const calcLineDiscount = (line) => {
    const base = calcLineBase(line);
    const raw = line.discountType === 'percent' ? (base * Number(line.discount || 0)) / 100 : Number(line.discount || 0);
    return Math.min(Math.max(0, raw), Math.max(0, base));
  };
  const calcLineTotal = (line) => {
    return Math.max(0, calcLineBase(line) - calcLineDiscount(line));
  };

  const calcEstimateSubtotal = est => {
    return (est.items || []).reduce((acc, item) => acc + calcLineBase(item), 0);
  };
  
  const calcEstimateDiscountTotal = est => {
    const lineDisc = (est.items || []).reduce((acc, item) => acc + calcLineDiscount(item), 0);
    const sub = calcEstimateSubtotal(est);
    const baseAfterLine = Math.max(0, sub - lineDisc);
    const overallDisc = est.discountType === 'percent' 
      ? (baseAfterLine * Number(est.discount || 0)) / 100 
      : Number(est.discount || 0);
    return lineDisc + overallDisc;
  };

  const calcEstimateTotal = est => {
    const sub = calcEstimateSubtotal(est);
    const lineDisc = (est.items || []).reduce((acc, item) => acc + calcLineDiscount(item), 0);
    const baseAfterLine = Math.max(0, sub - lineDisc);
    const overallDisc = est.discountType === 'percent' 
      ? (baseAfterLine * Number(est.discount || 0)) / 100 
      : Number(est.discount || 0);
    return Math.max(0, baseAfterLine - overallDisc);
  };

  const getNextEstimateNumber = (currentList) => {
    const prefix = 'EST';
    const year = new Date().getFullYear();
    const count = currentList.length + 1;
    return `${prefix}-${year}-${String(count).padStart(4, '0')}`;
  };

  const handleOpenNewForm = () => {
    const nextNo = getNextEstimateNumber(estimates);
    setRfq({
      number: nextNo,
      date: new Date().toISOString().slice(0, 10),
      customerId: customers[0]?.id || 'custom',
      customerName: customers[0]?.name || '',
      customerAddress: customers[0]?.address || '',
      customerPhone: customers[0]?.phone || '',
      discount: '',
      discountType: 'amount',
      items: [
        { itemId: '', name: '', hsn: '', qty: '', price: '', discount: '', discountType: 'amount' }
      ],
      notes: 'Thank you for your business.'
    });
    setShowForm(true);
    setMsg({ type: '', text: '' });
  };

  const handleCustomerChange = (custId) => {
    if (custId === 'custom') {
      setRfq(prev => ({
        ...prev,
        customerId: 'custom',
        customerName: '',
        customerAddress: '',
        customerPhone: ''
      }));
    } else {
      const cust = customers.find(c => c.id === custId);
      if (cust) {
        setRfq(prev => ({
          ...prev,
          customerId: custId,
          customerName: cust.name || '',
          customerAddress: cust.address || '',
          customerPhone: cust.phone || ''
        }));
      }
    }
  };

  const handleItemProductChange = (index, itemId) => {
    const prod = items.find(i => i.id === itemId);
    if (prod) {
      setRfq(prev => {
        const newItems = [...prev.items];
        newItems[index] = {
          ...newItems[index],
          itemId: itemId,
          name: prod.name || '',
          hsn: prod.hsn || '',
          price: prod.salePrice || '',
          qty: 1,
          discount: '',
          discountType: 'amount'
        };
        return { ...prev, items: newItems };
      });
    }
  };

  const handleItemFieldChange = (index, field, value) => {
    setRfq(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      return { ...prev, items: newItems };
    });
  };

  const handleAddItemRow = () => {
    setRfq(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', name: '', hsn: '', qty: '', price: '', discount: '', discountType: 'amount' }]
    }));
  };

  const handleRemoveItemRow = (index) => {
    setRfq(prev => {
      if (prev.items.length <= 1) return prev;
      return {
        ...prev,
        items: prev.items.filter((_, idx) => idx !== index)
      };
    });
  };

  const saveEstimate = (e) => {
    e.preventDefault();
    try {
      if (!rfq.number.trim()) throw new Error('Please enter estimate number.');
      if (!rfq.customerName.trim()) throw new Error('Please enter customer name.');
      if (rfq.items.some(it => !it.name.trim())) throw new Error('Please select a product or enter description.');

      const newEst = {
        ...rfq,
        id: `est_${Date.now()}`
      };
      const updatedList = [newEst, ...estimates];
      localStorage.setItem('sma-estimates-v1', JSON.stringify(updatedList));
      setEstimates(updatedList);
      setShowForm(false);
      setPreviewEstimate(newEst);
      setShowPrintPreview(true);
      setMsg({ type: '', text: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const deleteEstimate = (id) => {
    if (confirm('Are you sure you want to delete this estimate?')) {
      const updatedList = estimates.filter(e => e.id !== id);
      localStorage.setItem('sma-estimates-v1', JSON.stringify(updatedList));
      setEstimates(updatedList);
      setMsg({ type: '', text: '' });
    }
  };

  const buildPdf = (est) => { 
    if (!est) return null;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' }); 
    const pageW = doc.internal.pageSize.getWidth(), pageH = doc.internal.pageSize.getHeight();
    drawCompanyPdfHeader(doc, settings, `ESTIMATE: ${est.number}`); 
    doc.setFont('helvetica', 'normal'); 
    doc.setFontSize(10); 
    doc.text(`Date: ${est.date}`, 40, 145); 
    doc.text(`Customer: ${est.customerName || 'Customer Name'}`, 40, 165); 
    
    let currentY = 205;
    (est.items || []).forEach((item, idx) => {
      const lineDisc = calcLineDiscount(item);
      const discText = lineDisc > 0 ? ` | Disc -${item.discountType === 'percent' ? `${item.discount}%` : money(item.discount, settings.currency)}` : '';
      doc.text(`${idx + 1}. ${item.name} | HSN ${item.hsn || '-'} | Qty ${item.qty} | Rate ${money(item.price, settings.currency)}${discText} | Amount ${money(calcLineTotal(item), settings.currency)}`, 40, currentY, { maxWidth: 515 });
      currentY += 20;
    });

    doc.setFont('helvetica', 'bold'); 
    doc.setFontSize(13); 
    doc.text(`Subtotal: ${money(calcEstimateSubtotal(est), settings.currency)}`, 360, currentY + 15);
    doc.text(`Discount: ${money(calcEstimateDiscountTotal(est), settings.currency)}`, 360, currentY + 30);
    doc.text(`Grand Total: ${money(calcEstimateTotal(est), settings.currency)}`, 360, currentY + 45); 

    // Draw outer page border frame
    doc.setDrawColor(17, 24, 39);
    doc.setLineWidth(1.5);
    doc.rect(15, 15, pageW - 30, pageH - 30, 'S');

    return doc; 
  };

  const shareWhatsApp = async (est) => { 
    setBusy('whatsapp'); 
    setMsg({ type: '', text: '' }); 
    try { 
      const targetEst = est || previewEstimate;
      if (!targetEst) throw new Error('No estimate selected.');
      const resMsg = await sharePdfToWhatsApp({ 
        doc: buildPdf(targetEst), 
        fileName: `${targetEst.number}.pdf`, 
        title: `${targetEst.number} Estimate PDF`,
        phone: targetEst.customerPhone
      }); 
      if (resMsg) {
        setMsg({ type: 'success', text: resMsg });
      }
    } catch (err) { 
      setMsg({ type: 'error', text: 'WhatsApp PDF share failed: ' + (err.message || 'Please allow file sharing permission.') }); 
    } finally { 
      setBusy(''); 
    } 
  };

  const triggerSystemPrint = () => {
    window.print();
  };

  React.useEffect(() => {
    if (showPrintPreview) {
      const style = document.createElement('style');
      style.id = 'estimate-print-preview-style';
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
  
  const customPrintHtml = (est) => {
    if (!est) return '';
    const customTemplateText = localStorage.getItem('sma-custom-invoice-template') || '';
    if (!customTemplateText) return '';
    const subtotal = calcEstimateSubtotal(est);
    const discount = calcEstimateDiscountTotal(est);
    const total = calcEstimateTotal(est);
    const itemRowsHtml = (est.items || []).map((l, idx) => {
      const lineDisc = calcLineDiscount(l);
      const discText = lineDisc > 0 ? (l.discountType === 'percent' ? `${l.discount}%` : money(l.discount, settings.currency)) : '-';
      return `<tr><td>${idx + 1}</td><td>${esc(l.name)}</td><td>${esc(l.hsn || '-')}</td><td style="text-align:right">${esc(l.qty)}</td><td style="text-align:right">${esc(money(l.price, settings.currency))}</td><td style="text-align:right">-</td><td style="text-align:right">${esc(discText)}</td><td style="text-align:right">${esc(money(calcLineTotal(l), settings.currency))}</td></tr>`;
    }).join('');
    
    const map = {
      businessName: settings.businessName,
      businessTagline: '',
      businessAddress: settings.address || 'Company Address',
      businessPhone: settings.phone || '-',
      businessEmail: settings.email || '-',
      businessGstin: settings.gstin || '-',
      logo: settings.logo || '',
      invoiceNumber: est.number,
      invoiceDate: est.date,
      dueDate: '-',
      status: 'Estimate',
      paymentMode: '-',
      taxLabel: '0%',
      customerName: est.customerName || 'Customer Name',
      customerAddress: est.customerAddress || 'Address',
      customerPhone: est.customerPhone || '-',
      customerGstin: '-',
      subtotal: money(subtotal, settings.currency),
      textSummaryHtml: '<p>Estimate No Tax</p>',
      tax: '0%',
      discount: money(discount, settings.currency),
      total: money(total, settings.currency),
      paid: money(0, settings.currency),
      balance: money(total, settings.currency),
      notes: est.notes || 'Thank you for your business.',
      itemRows: itemRowsHtml
    };
    return customTemplateText.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => map[key] ?? '');
  };

  const renderEstimateTitle = () => html`<div className="text-center mt-4 mb-5"><p className="inline-block rounded border border-slate-900 px-8 py-1 text-sm font-black uppercase tracking-widest bg-slate-50">Estimate</p></div>`;

  const renderSmaEstimate = (est) => {
    if (!est) return '';
    const subtotal = calcEstimateSubtotal(est);
    const discount = calcEstimateDiscountTotal(est);
    const total = calcEstimateTotal(est);
    return html`
      <article className="print-area sma-print-sheet mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]">
        <div className="sma-doc-title">ESTIMATE</div>
        <${CompanyPrintHeader} settings=${settings} />
        <section className="sma-info-grid">
          <div>
            <h3>Estimate To</h3>
            <p className="sma-strong">${est.customerName || 'Customer Name'}</p>
            <p>${est.customerAddress || 'Address'}</p>
            <p>Phone: ${est.customerPhone || '-'}</p>
          </div>
          <div>
            <h3>Estimate Details</h3>
            <p><b>Estimate No:</b> ${est.number}</p>
            <p><b>Date:</b> ${est.date}</p>
          </div>
        </section>
        <table className="sma-items-table">
          <thead>
            <tr>
              <th>#</th>
              <th className="text-left">Description</th>
              <th>HSN</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Discount</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${(est.items || []).map((item, idx) => {
              const lineDisc = calcLineDiscount(item);
              const discDisp = lineDisc > 0 ? (item.discountType === 'percent' ? `${item.discount}%` : money(item.discount, settings.currency)) : '-';
              return html`
                <tr key=${idx}>
                  <td>${idx + 1}</td>
                  <td className="text-left sma-strong">${item.name}</td>
                  <td>${item.hsn || '-'}</td>
                  <td>${item.qty}</td>
                  <td>${money(item.price, settings.currency)}</td>
                  <td>${discDisp}</td>
                  <td>${money(calcLineTotal(item), settings.currency)}</td>
                </tr>
              `;
            })}
          </tbody>
        </table>
        <section className="sma-bottom-grid">
          <div>
            <h3>Terms</h3>
            <p>${est.notes || 'Thank you for your business.'}</p>
          </div>
          <div className="sma-total-box">
            <p><span>Subtotal</span><b>${money(subtotal, settings.currency)}</b></p>
            <p><span>Discount</span><b>${money(discount, settings.currency)}</b></p>
            <p className="sma-grand"><span>Grand Total</span><b>${money(total, settings.currency)}</b></p>
          </div>
        </section>
        <footer className="sma-sign-row">
          <div>Customer Signature</div>
          <div>Authorized Signature</div>
        </footer>
      </article>
    `;
  };
  
  const rawArticle = (est) => {
    if (!est) return '';
    const subtotal = calcEstimateSubtotal(est);
    const discount = calcEstimateDiscountTotal(est);
    const total = calcEstimateTotal(est);

    const estStyle = 
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

    return html`
      <article className=${estStyle.article}>
        <div className=${estStyle.head}>
          <${CompanyPrintHeader} settings=${settings} />
        </div>
        ${renderEstimateTitle()}
        <section className="grid grid-cols-2 gap-4 border-b py-5 text-sm">
          <div>
            <p className="font-black uppercase text-slate-500">Customer Details</p>
            <h3 className="mt-2 text-lg font-black">${est.customerName || 'Customer Name'}</h3>
            <p className="leading-6">${est.customerAddress || 'Address'}<br/>Phone: ${est.customerPhone || '-'}</p>
          </div>
          <div className="text-right">
            <p><b>Estimate No:</b> ${est.number}</p>
            <p><b>Date:</b> ${est.date}</p>
          </div>
        </section>
        <table className="mt-5 w-full text-sm">
          <thead className=${estStyle.table}>
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">HSN</th>
              <th className="p-2 text-right">Qty</th>
              <th className="p-2 text-right">Rate</th>
              <th className="p-2 text-right">Discount</th>
              <th className="p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${(est.items || []).map((item, idx) => {
              const lineDisc = calcLineDiscount(item);
              const discDisp = lineDisc > 0 ? (item.discountType === 'percent' ? `${item.discount}%` : money(item.discount, settings.currency)) : '-';
              return html`
                <tr key=${idx} className="border-b">
                  <td className="p-2">${idx + 1}</td>
                  <td className="p-2 font-bold">${item.name}</td>
                  <td className="p-2">${item.hsn || '-'}</td>
                  <td className="p-2 text-right">${item.qty}</td>
                  <td className="p-2 text-right">${money(item.price, settings.currency)}</td>
                  <td className="p-2 text-right">${discDisp}</td>
                  <td className="p-2 text-right font-bold">${money(calcLineTotal(item), settings.currency)}</td>
                </tr>
              `;
            })}
          </tbody>
        </table>
        <section className="ml-auto mt-6 max-w-sm space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><b>${money(subtotal, settings.currency)}</b></div>
          <div className="flex justify-between"><span>Discount</span><b>${money(discount, settings.currency)}</b></div>
          <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-xl font-black"><span>Total</span><span>${money(total, settings.currency)}</span></div>
        </section>
      </article>
    `;
  };

  return html`
    <div className="space-y-5">
      <div className="card p-6 no-print">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black"><${FileSpreadsheet} /> Estimates</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick=${handleOpenNewForm} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white">
              <${Plus} size=${18} /> Create New Estimate
            </button>
          </div>
        </div>
      </div>
      
      ${msg.text ? html`<div className=${`no-print rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${msg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-700'}`}>${msg.text}</div>` : ''}
      
      ${showForm ? html`
        <section className="card overflow-hidden no-print">
          <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--primary)/0.04)] p-6 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight">New Estimate</h2>
            <button onClick=${() => setShowForm(false)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"><${X} size=${22} /></button>
          </div>
          <form onSubmit=${saveEstimate} className="p-6">
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <label className="text-sm font-bold">Estimate Number
                <input required value=${rfq.number} onInput=${e => setRfq({ ...rfq, number: e.target.value })} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
              <label className="text-sm font-bold">Customer Dropdown
                <select value=${rfq.customerId} onChange=${e => handleCustomerChange(e.target.value)} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  ${customers.map(c => html`<option key=${c.id} value=${c.id}>${c.name}</option>`)}
                  <option value="custom">Custom Customer</option>
                </select>
              </label>
              <label className="text-sm font-bold">Bill Date
                <input type="date" required value=${rfq.date} onInput=${e => setRfq({ ...rfq, date: e.target.value })} className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <label className="text-sm font-bold">Customer Name
                <input required value=${rfq.customerName} onInput=${e => setRfq({ ...rfq, customerName: e.target.value })} placeholder="Enter customer name" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
              <label className="text-sm font-bold">Phone Number
                <input value=${rfq.customerPhone} onInput=${e => setRfq({ ...rfq, customerPhone: e.target.value })} placeholder="Enter customer phone" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
              <label className="text-sm font-bold">Address
                <input value=${rfq.customerAddress} onInput=${e => setRfq({ ...rfq, customerAddress: e.target.value })} placeholder="Enter customer address" className="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" />
              </label>
            </div>

            <div className="border border-[hsl(var(--border))] rounded-[var(--radius-lg)] overflow-hidden mb-6">
              <div className="bg-[hsl(var(--muted)/0.35)] px-4 py-2 flex justify-between items-center border-b border-[hsl(var(--border))]">
                <span className="font-black text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Estimate Items</span>
                <button type="button" onClick=${handleAddItemRow} className="rounded-md bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1 hover:opacity-90 cursor-pointer shadow-sm" style=${{ minHeight: '30px', height: '30px', width: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <${Plus} size=${14} style=${{ width: '14px', height: '14px', flexShrink: 0, marginRight: '4px' }} />
                  <span className="whitespace-nowrap">Add Row</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-xs">
                  <thead className="bg-[hsl(var(--muted))] text-left text-[11px] uppercase text-[hsl(var(--muted-foreground))]">
                    <tr>
                      <th className="p-2">Product Dropdown</th>
                      <th className="p-2">Product / Service</th>
                      <th className="p-2">HSN</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Rate</th>
                      <th className="p-2">Discount</th>
                      <th className="p-2 text-right">Amount</th>
                      <th className="p-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rfq.items.map((line, index) => html`
                      <tr key=${index} className="border-t border-[hsl(var(--border))]">
                        <td className="p-2">
                          <select value=${line.itemId || ''} onChange=${e => handleItemProductChange(index, e.target.value)} className="w-44 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5 text-xs">
                            <option value="">Manual Entry</option>
                            ${items.map(i => html`<option key=${i.id} value=${i.id}>${i.name}</option>`)}
                          </select>
                        </td>
                        <td className="p-2">
                          <input required value=${line.name || ''} onInput=${e => handleItemFieldChange(index, 'name', e.target.value)} placeholder="Product/service description" className="w-56 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs" />
                        </td>
                        <td className="p-2">
                          <input value=${line.hsn || ''} onInput=${e => handleItemFieldChange(index, 'hsn', e.target.value)} placeholder="HSN" className="w-24 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs" />
                        </td>
                        <td className="p-2">
                          <input type="number" required value=${line.qty} onInput=${e => handleItemFieldChange(index, 'qty', e.target.value)} placeholder="Qty" className="w-20 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs text-right" />
                        </td>
                        <td className="p-2">
                          <input type="number" required value=${line.price} onInput=${e => handleItemFieldChange(index, 'price', e.target.value)} placeholder="Price" className="w-28 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs text-right" />
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <select value=${line.discountType || 'amount'} onChange=${e => handleItemFieldChange(index, 'discountType', e.target.value)} className="w-14 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5 text-xs">
                              <option value="amount">₹</option>
                              <option value="percent">%</option>
                            </select>
                            <input type="number" value=${line.discount || ''} onInput=${e => handleItemFieldChange(index, 'discount', e.target.value)} placeholder="Disc" className="w-16 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-1.5 text-xs text-right" />
                          </div>
                        </td>
                        <td className="p-2 text-right font-bold text-xs">
                          ${money(calcLineTotal(line), settings.currency)}
                        </td>
                        <td className="p-2 text-right">
                          <button type="button" disabled=${rfq.items.length <= 1} onClick=${() => handleRemoveItemRow(index)} className="text-[hsl(var(--destructive))] disabled:opacity-30">
                            <${Trash2} size=${14} />
                          </button>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold">Notes / Terms
                <textarea value=${rfq.notes} onInput=${e => setRfq({ ...rfq, notes: e.target.value })} className="focus-ring mt-2 min-h-24 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-3" placeholder="Estimate validity, payment terms, or custom instructions"></textarea>
              </label>
              <div className="flex flex-col justify-end items-end space-y-3 pr-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-[hsl(var(--muted-foreground))]">Overall Estimate Discount:</span>
                  <select value=${rfq.discountType || 'amount'} onChange=${e => setRfq({ ...rfq, discountType: e.target.value })} className="rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 text-xs font-bold" aria-label="Overall discount type">
                    <option value="amount">₹</option>
                    <option value="percent">%</option>
                  </select>
                  <input type="number" value=${rfq.discount || ''} onInput=${e => setRfq({ ...rfq, discount: e.target.value })} placeholder="Overall Disc" className="w-24 rounded-[var(--radius-sm)] border border-[hsl(var(--border))] bg-transparent p-2 text-sm text-right font-bold border-[hsl(var(--border))]" />
                </div>
                <div className="flex justify-between w-full max-w-[280px] text-sm text-[hsl(var(--muted-foreground))]">
                  <span>Subtotal:</span>
                  <span>${money(calcEstimateSubtotal(rfq), settings.currency)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] text-sm text-[hsl(var(--muted-foreground))]">
                  <span>Total Discount:</span>
                  <span>${money(calcEstimateDiscountTotal(rfq), settings.currency)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] text-xl font-black border-t border-[hsl(var(--border))] pt-2">
                  <span>Grand Total:</span>
                  <span>${money(calcEstimateTotal(rfq), settings.currency)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button type="button" onClick=${() => setShowForm(false)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-6 py-3 font-black">Cancel</button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-6 py-3 font-black text-white shadow-[var(--shadow-sm)]">
                <${Save} size=${18} /> Save Estimate
              </button>
            </div>
          </form>
        </section>
      ` : ''}

      ${!showForm && html`
        <section className="card overflow-hidden no-print">
          <div className="border-b border-[hsl(var(--border))] p-5">
            <h3 className="font-black">Estimates History</h3>
          </div>
          ${estimates.length ? html`
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-[hsl(var(--muted))] text-left text-xs uppercase text-[hsl(var(--muted-foreground))]">
                  <tr>
                    <th className="p-4">Estimate No</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total Items</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${estimates.map(est => html`
                    <tr key=${est.id} className="border-t border-[hsl(var(--border))]">
                      <td className="p-4 font-black">
                        <button onClick=${() => { setPreviewEstimate(est); setShowPrintPreview(true); }} className="text-[hsl(var(--primary))] hover:underline">
                          ${est.number}
                        </button>
                      </td>
                      <td className="p-4">${est.date}</td>
                      <td className="p-4">${est.customerName}</td>
                      <td className="p-4">${(est.items || []).length}</td>
                      <td className="p-4 font-bold">${money(calcEstimateTotal(est), settings.currency)}</td>
                      <td className="p-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button onClick=${() => { setPreviewEstimate(est); shareWhatsApp(est); }} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-emerald-600 px-3 py-2 text-xs font-black text-white">
                            <${MessageCircle} size=${14} /> WhatsApp PDF
                          </button>
                          <button onClick=${() => { setPreviewEstimate(est); setShowPrintPreview(true); }} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[hsl(var(--primary))] px-3 py-2 text-xs font-black text-white">
                            <${Printer} size=${14} /> View / Print
                          </button>
                          <button onClick=${() => deleteEstimate(est.id)} className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-red-600 px-3 py-2 text-xs font-black text-white">
                            <${Trash2} size=${14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          ` : html`
            <div className="grid place-items-center p-10 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]">
                <${FileSpreadsheet} size=${30} />
              </div>
              <h3 className="mt-4 text-lg font-black">No estimates yet</h3>
            </div>
          `}
        </section>
      `}

      ${showPrintPreview && previewEstimate && html`
        <div className="print-preview-modal fixed inset-0 z-[9999] bg-slate-900/60 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius-lg)] p-4 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full max-w-4xl shadow-[var(--shadow-md)] no-print">
            <span className="text-lg font-black text-[hsl(var(--foreground))]">Print Preview - Estimate #${previewEstimate.number}</span>
            <div className="flex flex-wrap gap-2">
              <select value=${template} onChange=${e => setTemplate(e.target.value)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 font-bold text-sm" aria-label="Estimate print template">
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
              <button disabled=${!!busy} onClick=${() => shareWhatsApp(previewEstimate)} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-600 px-4 py-2 font-black text-white disabled:opacity-60">
                <${MessageCircle} size=${17} /> ${busy === 'whatsapp' ? 'Sharing...' : 'WhatsApp Share'}
              </button>
              <button onClick=${triggerSystemPrint} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-2 font-black text-white">
                <${Printer} size=${17} /> Print
              </button>
              <button onClick=${() => { setShowPrintPreview(false); setPreviewEstimate(null); }} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[hsl(var(--border))] px-4 py-2 font-black text-[hsl(var(--foreground))] bg-[hsl(var(--card))]">
                <${X} size=${17} /> Close
              </button>
            </div>
          </div>
          ${msg.text ? html`<div className="w-full max-w-4xl mb-4 rounded-[var(--radius-md)] p-3 text-sm font-bold whitespace-pre-wrap ${msg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-700'}">${msg.text}</div>` : ''}
          <div className="w-full max-w-4xl">
            ${template === 'custom' ? html`<article className="print-area mx-auto max-w-4xl bg-white text-slate-900 shadow-[var(--shadow-md)]" dangerouslySetInnerHTML=${{ __html: customPrintHtml(previewEstimate) }}></article>` : template === 'sma' ? renderSmaEstimate(previewEstimate) : rawArticle(previewEstimate)}
          </div>
        </div>
      `}
    </div>
  `;
}
