import { html } from '../jsx.js';

export function CompanyPrintHeader({ settings, title = '', dateTime = '' }) {
  const centerStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' };
  const textStyle = { textAlign: 'center', width: '100%', margin: '0 auto' };

  return html`
    <header className="sma-doc-head border-b-2 border-slate-900 pb-5 mb-5 flex flex-col items-center justify-center gap-2 text-center" style=${centerStyle}>
      ${settings.logo ? html`
        <div className="sma-logo-box w-24 h-24 mb-2 flex items-center justify-center" style=${{ margin: '0 auto' }}>
          <img src=${settings.logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
      ` : ''}
      <div className="sma-business-block w-full text-center" style=${textStyle}>
        <h1 className="text-3xl font-black tracking-tight uppercase" style=${{ ...textStyle, display: 'block' }}>
          ${settings.businessName || 'SHREE MAHESHWARA AGENCIES'}
        </h1>
        <p className="text-sm mt-1 leading-relaxed font-bold" style=${{ ...textStyle, display: 'block' }}>
          ${settings.address || 'Company Address'}
        </p>
        <p className="text-sm leading-relaxed font-bold" style=${{ ...textStyle, display: 'block' }}>
          Phone: ${settings.phone || '9489544470'} | Email: ${settings.email || '-'} | GSTIN: ${settings.gstin || '-'}
        </p>
      </div>
      ${title ? html`
        <div className="mt-3 text-center" style=${textStyle}>
          <div className="inline-block border-2 border-slate-900 px-6 py-1 text-sm font-black uppercase tracking-widest bg-slate-50" style=${{ margin: '0 auto' }}>
            ${title}
          </div>
          ${dateTime ? html`<p className="text-[10px] mt-1 font-bold text-slate-500" style=${textStyle}>${dateTime}</p>` : ''}
        </div>
      ` : ''}
    </header>
  `;
}
