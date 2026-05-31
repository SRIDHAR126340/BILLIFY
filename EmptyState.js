/* __imports_rewritten__ */
import { html } from '../jsx.js';
import {FilePlus2} from 'https://esm.sh/lucide-react?deps=react@19.2.0';

export function EmptyState({ title, message, action }) {
  return html`
    <div className="card grid place-items-center p-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"><${FilePlus2} /></div>
      <h3 className="mt-4 text-lg font-black">${title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">${message}</p>
      ${action ? html`<div className="mt-5">${action}</div>` : ''}
    </div>
  `;
}