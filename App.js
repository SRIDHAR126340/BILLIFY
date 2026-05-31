/* __imports_rewritten__ */
import { html } from './jsx.js';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0';
import { Layout } from './components/Layout.js';
import { Dashboard } from './pages/Dashboard.js';
import { Tools } from './pages/Tools.js';
import { Invoices } from './pages/Invoices.js';
import { InvoiceEditor } from './pages/InvoiceEditor.js';
import { InvoiceView } from './pages/InvoiceView.js';
import { Quotations } from './pages/Quotations.js';
import { Estimates } from './pages/Estimates.js';
import { PurchaseOrders } from './pages/PurchaseOrders.js';
import { Customers } from './pages/Customers.js';
import { Ledger } from './pages/Ledger.js';
import { Items } from './pages/Items.js';
import { Expenses } from './pages/Expenses.js';
import { Reports } from './pages/Reports.js';
import { Settings } from './pages/Settings.js';
import { DataSync } from './pages/DataSync.js';
import { NotFound } from './pages/NotFound.js';
import { Login } from './pages/Login.js';
import { useAuth } from './mainProviders.js';
import { useBillingStore } from './store/useBillingStore.js';

export function ProtectedRoute({ children }) {
  const { user, authLoading, passcodeAuthorized } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return html`
      <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent"></div>
          <p className="text-sm font-black animate-pulse">Verifying secure session...</p>
        </div>
      </div>
    `;
  }

  // Strictly require user session or local passcode authorization. Bypassing login is not allowed.
  if (!user && !passcodeAuthorized) {
    return html`<${Navigate} to="/login" state=${{ from: location }} replace=${true} />`;
  }

  return children;
}

export function App() {
  return html`
    <${HashRouter}>
      <${Routes}>
        <${Route} path="/login" element=${html`<${Login} />`} />
        
        <${Route} element=${html`<${ProtectedRoute}><${Layout} /></${ProtectedRoute}>`}>
          <${Route} path="/" element=${html`<${Navigate} to="/dashboard" replace=${true} />`} />
          <${Route} path="/dashboard" element=${html`<${Dashboard} />`} />
          <${Route} path="/tools" element=${html`<${Tools} />`} />
          <${Route} path="/invoices" element=${html`<${Invoices} />`} />
          <${Route} path="/invoices/new" element=${html`<${InvoiceEditor} />`} />
          <${Route} path="/invoices/:id/edit" element=${html`<${InvoiceEditor} />`} />
          <${Route} path="/invoices/:id" element=${html`<${InvoiceView} />`} />
          <${Route} path="/quotations" element=${html`<${Quotations} />`} />
          <${Route} path="/estimates" element=${html`<${Estimates} />`} />
          <${Route} path="/purchase-orders" element=${html`<${PurchaseOrders} />`} />
          <${Route} path="/customers" element=${html`<${Customers} />`} />
          <${Route} path="/items" element=${html`<${Items} />`} />
          <${Route} path="/ledger" element=${html`<${Ledger} />`} />
          <${Route} path="/expenses" element=${html`<${Expenses} />`} />
          <${Route} path="/reports" element=${html`<${Reports} />`} />
          <${Route} path="/data" element=${html`<${DataSync} />`} />
          <${Route} path="/settings" element=${html`<${Settings} />`} />
          <${Route} path="*" element=${html`<${NotFound} />`} />
        </${Route}>
      </${Routes}>
    </${HashRouter}>
  `;
}
