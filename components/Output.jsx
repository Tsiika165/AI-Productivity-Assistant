"use client";
import { useState } from "react";
import Icon from "./Icon";

export const DISCLAIMER =
  "AI-generated draft. It can be wrong or biased and is not legal advice. Check names, dates, amounts and legal references before use.";

/** One result card with the responsible-AI layer: disclaimer + human review gate before copy. */
export default function Output({ label, result, render }) {
  const [reviewed, setReviewed] = useState(false);
  const [copied, setCopied] = useState(false);
  const isV1 = label.startsWith("v1");
  const copy = async () => {
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section className="hud panel animate-rise p-5" aria-label={label}>
      <header className="mb-4 flex flex-wrap items-center gap-2">
        <span className={`chip ${isV1 ? "bg-spark/15 text-spark ring-1 ring-spark/40" : "bg-signal/15 text-signal ring-1 ring-signal/40"}`}>
          {label}
        </span>
        <span className="chip bg-raised text-mute">{(result.ms / 1000).toFixed(1)}s</span>
        {result.demo && <span className="chip bg-flag/15 text-flag ring-1 ring-flag/40">demo mode</span>}
        {result.redactions > 0 && (
          <span className="chip bg-volt/10 text-volt ring-1 ring-volt/30">
            <Icon name="shield" className="h-3 w-3" /> {result.redactions} masked before sending
          </span>
        )}
      </header>

      <div className="text-fg/95">
        {render ? render(result.text) : <div className="whitespace-pre-wrap text-sm leading-relaxed">{result.text}</div>}
      </div>

      <footer className="mt-5 space-y-3 border-t border-edge pt-4">
        <p className="flex gap-2 rounded-lg bg-flag/10 px-3 py-2 text-xs leading-relaxed text-flag/90">
          <Icon name="warn" className="mt-0.5 h-4 w-4 shrink-0" />
          {DISCLAIMER}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input type="checkbox" className="peer sr-only" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
            <span className="grid h-5 w-5 place-items-center rounded border border-mute/50 bg-raised text-void transition peer-checked:border-volt peer-checked:bg-volt peer-focus-visible:ring-2 peer-focus-visible:ring-signal">
              {reviewed && <Icon name="check" className="h-3.5 w-3.5" />}
            </span>
            I have reviewed this output
          </label>
          <button className="btn-ghost" disabled={!reviewed} onClick={copy}>
            <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </footer>
    </section>
  );
}
