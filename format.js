export function money(value, currency = '₹') {
  return `${currency}${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function invoiceLineTaxRate(inv, line) {
  return inv?.taxMode === 'IGST' ? Number(line?.taxRate || 0) : Number(inv?.cgstRate ?? 9) + Number(inv?.sgstRate ?? 9);
}

function lineBase(line) {
  return Number(line?.qty || 0) * Number(line?.price || 0);
}

function lineDiscount(line) {
  const base = lineBase(line);
  const raw = line?.discountType === 'percent' ? base * Number(line?.discount || 0) / 100 : Number(line?.discount || 0);
  return Math.min(Math.max(0, raw), Math.max(0, base));
}

export function invoiceLineTaxable(line) {
  return Math.max(0, lineBase(line) - lineDiscount(line));
}

export function invoiceLineTaxValue(inv, line) {
  return invoiceLineTaxable(line) * invoiceLineTaxRate(inv, line) / 100;
}

export function invoiceLineTotal(inv, line) {
  const taxable = invoiceLineTaxable(line);
  return taxable + (taxable * invoiceLineTaxRate(inv, line) / 100);
}

function invoiceSubtotal(inv) {
  return (inv?.items ?? []).reduce((sum, l) => sum + lineBase(l), 0);
}

function invoiceLineDiscountTotal(inv) {
  return (inv?.items ?? []).reduce((sum, l) => sum + lineDiscount(l), 0);
}

function invoiceDiscountAmount(inv, subtotal = invoiceSubtotal(inv)) {
  const lineDiscounts = invoiceLineDiscountTotal(inv);
  const legacyBase = Math.max(0, subtotal - lineDiscounts);
  const raw = inv?.discountType === 'percent' ? legacyBase * Number(inv?.discount || 0) / 100 : Number(inv?.discount || 0);
  return Math.min(Math.max(0, lineDiscounts + raw), Math.max(0, subtotal));
}

export function invoiceTaxBreakup(inv) {
  const lines = inv?.items ?? [];
  if (inv?.taxMode !== 'IGST') {
    const cgstRate = Number(inv?.cgstRate ?? 9);
    const sgstRate = Number(inv?.sgstRate ?? 9);
    const taxableBase = lines.reduce((sum, l) => sum + invoiceLineTaxable(l), 0);
    const legacyDiscount = Math.max(0, invoiceDiscountAmount(inv) - invoiceLineDiscountTotal(inv));
    const taxableAfterLegacy = Math.max(0, taxableBase - legacyDiscount);
    const cgst = taxableAfterLegacy * cgstRate / 100;
    const sgst = taxableAfterLegacy * sgstRate / 100;
    return { cgstRate, sgstRate, cgst, sgst, total: cgst + sgst, taxableBase: taxableAfterLegacy };
  }
  const subtotal = invoiceSubtotal(inv);
  const totalDiscount = invoiceDiscountAmount(inv, subtotal);
  const lineDiscounts = invoiceLineDiscountTotal(inv);
  const taxableBeforeLegacy = Math.max(0, subtotal - lineDiscounts);
  const legacyRatio = taxableBeforeLegacy > 0 ? Math.max(0, taxableBeforeLegacy - Math.max(0, totalDiscount - lineDiscounts)) / taxableBeforeLegacy : 0;
  const total = lines.reduce((sum, l) => sum + invoiceLineTaxable(l) * legacyRatio * invoiceLineTaxRate(inv, l) / 100, 0);
  return { cgstRate: 0, sgstRate: 0, cgst: 0, sgst: 0, total, taxableBase: Math.max(0, subtotal - totalDiscount) };
}

export function invoiceTotals(inv) {
  const subtotal = invoiceSubtotal(inv);
  const discount = invoiceDiscountAmount(inv, subtotal);
  const taxable = Math.max(0, subtotal - discount);
  const tax = invoiceTaxBreakup(inv).total;
  const total = Math.max(0, taxable + tax);
  const statusText = String(inv?.status || '').trim().toLowerCase();
  const paymentList = Array.isArray(inv?.payments) ? inv.payments : [];
  const paymentPaid = paymentList.reduce((sum, p) => sum + Number(p?.amount || 0), 0);
  const rawPaid = paymentList.length ? paymentPaid : Number(inv?.paid || 0);
  const paid = statusText === 'paid' ? Math.max(rawPaid, total) : rawPaid;
  return { subtotal, discount, taxable, tax, total, paid, balance: Math.max(0, total - paid) };
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}