"use client";
import { useState } from "react";
import { runFeature } from "@/lib/client";
import Output from "./Output";
import Icon from "./Icon";
import Toggle from "./Toggle";

const ICONS = { email: "mail", meeting: "notes", planner: "calendar", research: "search" };

/** Generic form -> AI tool. Supports PII masking and a v1 vs v2 prompt comparison. */
export default function ToolPanel({ feature, title, blurb, fields, prepare, Preview, renderOutput, onRun, submitLabel = "Generate" }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, f.default ?? (f.options ? f.options[0] : "")])));
  const [safe, setSafe] = useState(true);
  const [compare, setCompare] = useState(false);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (name, v) => setValues((s) => ({ ...s, [name]: v }));
  const required = fields.filter((f) => f.required).every((f) => values[f.name]?.trim());

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setResults({});
    try {
      const input = prepare ? prepare(values) : values;
      const versions = compare ? ["v1", "v2"] : ["v2"];
      const out = await Promise.all(versions.map((v) => runFeature({ feature, version: v, input, safe })));
      setResults(Object.fromEntries(versions.map((v, n) => [v, out[n]])));
      onRun?.(feature);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const both = results.v1 && results.v2;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <form onSubmit={submit} className="hud panel space-y-5 self-start p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-signal/10 text-signal ring-1 ring-signal/30">
            <Icon name={ICONS[feature] || "bolt"} />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold leading-tight">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-mute">{blurb}</p>
          </div>
        </div>

        {fields.map((f) => (
          <label key={f.name} className="block">
            <span className="label">{f.label}</span>
            {f.type === "select" ? (
              <select className="field" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <textarea className="field resize-y" rows={f.rows || 5} placeholder={f.placeholder} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
            )}
          </label>
        ))}

        {Preview && <Preview values={values} />}

        <div className="space-y-3 rounded-lg border border-edge bg-raised/60 p-3">
          <Toggle checked={safe} onChange={setSafe} label="Mask personal details (POPIA)" tag="privacy" />
          <Toggle checked={compare} onChange={setCompare} label="Compare prompt v1 vs v2" tag="lab" />
        </div>

        <button className="btn w-full" disabled={loading || !required}>
          {loading ? (
            <><span className="h-4 w-4 animate-spin360 rounded-full border-2 border-void/30 border-t-void" /> Working...</>
          ) : (
            <><Icon name="bolt" className="h-4 w-4" /> {submitLabel}</>
          )}
        </button>
        {error && <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error} Check your input and try again.</p>}
      </form>

      <div className={`grid content-start gap-4 ${both ? "xl:grid-cols-2" : ""}`} aria-live="polite">
        {!loading && !error && Object.keys(results).length === 0 && (
          <div className="col-span-full grid place-items-center rounded-xl border border-dashed border-edge px-6 py-16 text-center">
            <svg viewBox="0 0 120 120" className="mb-4 h-24 w-24" fill="none" aria-hidden="true">
              <circle cx="60" cy="60" r="52" stroke="#1F2F49" strokeWidth="1.5" strokeDasharray="3 6" />
              <circle cx="60" cy="60" r="36" stroke="#22D3EE" strokeOpacity=".5" strokeWidth="1.5" />
              <circle cx="60" cy="60" r="20" stroke="#22D3EE" strokeWidth="1.5" />
              <circle cx="60" cy="60" r="4" fill="#22D3EE" />
            </svg>
            <p className="font-display text-base font-medium">Ready when you are</p>
            <p className="mt-1 max-w-xs text-sm text-mute">Fill in the form and press {submitLabel.toLowerCase()}. Your result appears here.</p>
          </div>
        )}
        {loading && (
          <div className="hud panel col-span-full space-y-3 p-5" role="status">
            <div className="skeleton h-5 w-1/3" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-11/12" />
            <div className="skeleton h-3 w-4/5" />
            <div className="skeleton h-3 w-2/3" />
            <p className="pt-2 font-mono text-xs text-mute">Working on it...</p>
          </div>
        )}
        {results.v1 && <Output label="v1 basic prompt" result={results.v1} render={renderOutput && ((t) => renderOutput(t, "v1"))} />}
        {results.v2 && <Output label="v2 engineered prompt" result={results.v2} render={renderOutput && ((t) => renderOutput(t, "v2"))} />}
      </div>
    </div>
  );
}