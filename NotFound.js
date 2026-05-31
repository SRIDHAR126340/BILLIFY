/* __imports_rewritten__ */
import { html } from '../jsx.js';
import { Link } from 'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0';

export function NotFound() {
  return html`<div className="card grid place-items-center p-10 text-center"><h2 className="text-4xl font-black">Page not found</h2><p className="mt-3 text-[hsl(var(--muted-foreground))]">The billing section you opened does not exist.</p><${Link} to="/" className="mt-6 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-5 py-3 font-black text-white">Go to dashboard</${Link}></div>`;
}