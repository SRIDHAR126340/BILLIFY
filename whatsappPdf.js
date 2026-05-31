export const sharePdfToWhatsApp = async ({
  doc,
  fileName,
  title,
  phone = ''
}) => {
  try {
    const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');

    const whatsappUrl = `whatsapp://send?phone=${cleanPhone || ''}`;

    const pdfBlob = doc.output('blob');

    const file = new File([pdfBlob], fileName, {
      type: 'application/pdf'
    });

    // ELECTRON DESKTOP MODE
    if (
      window.desktopApp &&
      window.desktopApp.isElectron &&
      window.desktopApp.shareFile
    ) {
      const reader = new FileReader();

      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };

        reader.onerror = reject;
      });

      reader.readAsDataURL(pdfBlob);

      const base64 = await base64Promise;

      const res = await window.desktopApp.shareFile({
        base64,
        fileName
      });

      window.location.href = whatsappUrl;

      if (res && res.ok) {
        return 'PDF generated successfully and WhatsApp opened!';
      }

      return 'WhatsApp opened!';
    }

    // MOBILE / WEB SHARE
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: title || 'Document',
          text: `Please find attached ${title || 'Document'}`
        });

        return 'PDF shared successfully!';
      } catch (shareErr) {
        if (shareErr.name === 'AbortError') {
          return 'Share cancelled';
        }
      }
    }

    // FALLBACK
    window.location.href = whatsappUrl;

    return 'WhatsApp opened!';
  } catch (err) {
    console.error('WhatsApp share error:', err);
    throw err;
  }
};