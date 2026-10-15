"use client";
import { useState } from "react";
import { runFeature } from "@/lib/client";
import Output from "./Output";

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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
      <form onSubmit={submit} className="space-y-4 self-start rounded-lg border border-slate-200 bg-white p-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-slate-600">{blurb}</p>
        </div>
        {fields.map((f) => (
          <label key={f.name} className="block text-sm font-medium">
            {f.label}
            {f.type === "select" ? (
              <select className="field mt-1 font-normal" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <textarea className="field mt-1 font-normal" rows={f.rows || 5} placeholder={f.placeholder} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
            )}
          </label>
        ))}
        {Preview && <Preview values={values} />}
        <div className="space-y-1 border-t border-slate-100 pt-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} /> Mask personal details before sending (POPIA)</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} /> Compare basic prompt (v1) vs engineered prompt (v2)</label>
        </div>
        <button className="btn" disabled={loading || !required}>{loading ? "Working..." : submitLabel}</button>
        {error && <p role="alert" className="text-sm text-red-700">{error} Check your input and try again.</p>}
      </form>

      <div className="space-y-4">
        {!loading && !error && Object.keys(results).length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">Fill in the form and choose {submitLabel.toLowerCase()}. Your result appears here.</p>
        )}
        {loading && <p className="p-6 text-sm text-slate-600">Working on it...</p>}
        {results.v1 && <Output label="v1 basic prompt" result={results.v1} render={renderOutput && ((t) => renderOutput(t, "v1"))} />}
        {results.v2 && <Output label="v2 engineered prompt" result={results.v2} render={renderOutput && ((t) => renderOutput(t, "v2"))} />}
      </div>
    </div>
  );
}
