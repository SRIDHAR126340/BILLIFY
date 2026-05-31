import { html } from '../jsx.js';

export function StatCard({ label, value, note, icon }) {
  return html`
    <div className="card p-5 transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[hsl(var(--muted-foreground))]">${label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight">${value}</p>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">${note}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]">${icon}</div>
      </div>
    </div>
  `;
}