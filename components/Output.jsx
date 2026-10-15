"use client";
import { useState } from "react";

export const DISCLAIMER =
  "AI-generated draft. It can be wrong or biased and is not legal advice. Check names, dates, amounts and legal references before use.";

/** One result card with the responsible-AI layer: disclaimer + human review gate before copy. */
export default function Output({ label, result, render }) {
  const [reviewed, setReviewed] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4" aria-label={label}>
      <header className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="rounded bg-ink px-2 py-0.5 font-medium text-white">{label}</span>
        <span>{(result.ms / 1000).toFixed(1)}s</span>
        {result.demo && <span className="rounded bg-amber-100 px-2 py-0.5 text-flag">Demo mode</span>}
        {result.redactions > 0 && (
          <span className="rounded bg-teal-50 px-2 py-0.5 text-signal">{result.redactions} personal detail(s) masked before sending</span>
        )}
      </header>
      {render ? render(result.text) : <div className="whitespace-pre-wrap text-sm leading-relaxed">{result.text}</div>}
      <footer className="mt-4 border-t border-slate-100 pt-3">
        <p className="mb-2 text-xs text-flag">{DISCLAIMER}</p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
            I have reviewed this output
          </label>
          <button className="btn-ghost" disabled={!reviewed} onClick={copy}>{copied ? "Copied" : "Copy"}</button>
        </div>
      </footer>
    </section>
  );
}
