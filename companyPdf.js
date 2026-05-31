export const cleanPdfText = value => String(value ?? '-').split('\f').join('').split('\u000b').join('').split('\n').join(' ').split('\r').join(' ').split('₹').join('Rs.');

export function drawCompanyPdfHeader(doc, settings = {}, title = '') {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 34;
  const usableW = pageW - margin * 2;
  const safe = cleanPdfText;
  const centerX = pageW / 2;
  
  doc.setTextColor(17, 24, 39);
  doc.setDrawColor(17, 24, 39);
  doc.setFillColor(255, 255, 255);
  // Keep the border but ensure it's large enough if used, though centering is priority
  doc.rect(margin, 24, usableW, 100, 'S');
  
  let y = 38;
  try { 
    if (settings.logo) {
      doc.addImage(settings.logo, undefined, (pageW - 44) / 2, y, 44, 44); 
      y += 52;
    } else {
      y += 6;
    }
  } catch (err) {
    y += 6;
  }

  // Business Name - Centered
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(safe(settings.businessName || 'SHREE MAHESHWARA AGENCIES').toUpperCase(), centerX, y, { align: 'center', maxWidth: usableW - 20 });
  y += 18;
  
  // Address - Centered
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(safe(settings.address || 'Company Address'), centerX, y, { align: 'center', maxWidth: usableW - 20 });
  y += 13;
  
  // Contact Info - Centered
  doc.text(safe(`Phone: ${settings.phone || '9489544470'} | Email: ${settings.email || '-'} | GSTIN: ${settings.gstin || '-'}`), centerX, y, { align: 'center', maxWidth: usableW - 20 });
  
  if (title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    // Draw title below the header box
    doc.text(safe(title), centerX, 142, { align: 'center' });
  }
}
