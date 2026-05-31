/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from '../jsx.js';
import {Save, Trash2} from 'https://esm.sh/lucide-react?deps=react@19.2.0';

const safeEval = expression => {
  const clean = String(expression || '').replace(/×/g, '*').replace(/÷/g, '/').trim();
  if (!clean) return 0;
  if (!/^[0-9+\-*\/().%\s]+$/.test(clean)) throw new Error('Invalid calculation');
  return Function(`"use strict"; return (${clean})`)();
};

export function Tools() {
  const [calc, setCalc] = React.useState('');
  const [result, setResult] = React.useState('');
  const [note, setNote] = React.useState('');
  const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem('sma-quick-notes') || '[]'));
  const [message, setMessage] = React.useState('');
  const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','%','+'];
  const press = value => setCalc(v => `${v}${value}`);
  const calculate = () => {
    try {
      const value = safeEval(calc);
      setResult(Number.isFinite(value) ? String(value) : '0');
      setMessage('');
    } catch (err) {
      setResult('Error');
      setMessage('Calculation correct illa. Numbers and symbols mattum use pannunga.');
    }
  };
  const saveNote = () => {
    if (!note.trim()) return;
    const next = [{ id: `note_${Date.now()}`, text: note.trim(), date: new Date().toLocaleString() }, ...notes];
    setNotes(next);
    localStorage.setItem('sma-quick-notes', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
    setNote('');
    setMessage(''); // CRITICAL: NO description message once the functionality works
  };
  const deleteNote = id => {
    const next = notes.filter(n => n.id !== id);
    setNotes(next);
    localStorage.setItem('sma-quick-notes', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('sma-billing-live-update', { detail: { at: Date.now() } }));
  };
  return html`
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="card p-5">
        <h3 className="text-2xl font-black">🧮</h3>
        ${message ? html`<p className="mt-3 rounded bg-amber-500/10 p-2 text-xs font-bold text-amber-700">${message}</p>` : ''}
        <input value=${calc} onInput=${e => setCalc(e.target.value)} onKeyDown=${e => { if (e.key === 'Enter') calculate(); }} placeholder="0" className="focus-ring mt-4 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-4 text-right text-2xl font-black" />
        <div className="mt-3 rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.7)] p-4 text-right text-xl font-black">${result || '0'}</div>
        <div className="mt-4 grid grid-cols-4 gap-2">${buttons.map(b => html`<button key=${b} onClick=${() => press(b)} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] p-4 font-black hover:bg-[hsl(var(--muted))]">${b}</button>`)}</div>
        <div className="mt-2 grid grid-cols-2 gap-2"><button onClick=${() => { setCalc(''); setResult(''); }} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] p-3 font-black">C</button><button onClick=${calculate} className="rounded-[var(--radius-md)] bg-[hsl(var(--primary))] p-3 font-black text-white">=</button></div>
      </div>
      <div className="card p-5">
        <h3 className="text-2xl font-black">📝</h3>
        <textarea value=${note} onInput=${e => setNote(e.target.value)} placeholder="Notes" className="focus-ring mt-4 min-h-36 w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-transparent p-4"></textarea>
        <button onClick=${saveNote} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[hsl(var(--primary))] px-4 py-3 font-black text-white"><${Save} size=${18} /> Save</button>
        <div className="mt-4 space-y-3">${notes.length ? notes.map(n => html`<div key=${n.id} className="rounded-[var(--radius-md)] border border-[hsl(var(--border))] p-3"><div className="flex items-start justify-between gap-3"><div><p className="whitespace-pre-wrap text-sm font-bold">${n.text}</p><p className="mt-2 text-[10px] font-bold text-[hsl(var(--muted-foreground))]">${n.date}</p></div><button onClick=${() => deleteNote(n.id)} className="text-[hsl(var(--destructive))]"><${Trash2} size=${16} /></button></div></div>`) : html`<p className="rounded-[var(--radius-md)] bg-[hsl(var(--muted)/0.6)] p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">No notes</p>`}</div>
      </div>
    </div>`;
}
