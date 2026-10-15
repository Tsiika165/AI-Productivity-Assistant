"use client";
import { useRef, useState } from "react";
import { runFeature } from "@/lib/client";
import { DISCLAIMER } from "./Output";

export default function Chat({ onRun }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [safe, setSafe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mapRef = useRef({}); // keeps PII tokens consistent across the whole conversation

  async function send(e) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user", content: text.trim() }];
    setMessages(next); setText(""); setLoading(true); setError("");
    try {
      const r = await runFeature({ feature: "chat", version: "v2", messages: next.slice(-12), safe, map: mapRef.current });
      mapRef.current = r.map;
      setMessages([...next, { role: "assistant", content: r.text }]);
      onRun?.("chat");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[70vh] max-w-3xl flex-col rounded-lg border border-slate-200 bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="text-sm text-slate-600">
            <p className="mb-2 font-medium text-ink">Ask HR Desk anything about your workday.</p>
            <p>Try: "How should I structure a probation review meeting?" or "Rewrite this to sound more neutral: ..."</p>
          </div>
        )}
        {messages.map((m, n) => (
          <div key={n} className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-ink text-white" : "bg-mist"}`}>{m.content}</div>
        ))}
        {loading && <p className="text-sm text-slate-600">HR Desk is typing...</p>}
        {error && <p role="alert" className="text-sm text-red-700">{error} Send your message again.</p>}
      </div>
      <form onSubmit={send} className="border-t border-slate-200 p-3">
        <div className="flex gap-2">
          <input className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question" aria-label="Message" />
          <button className="btn" disabled={loading || !text.trim()}>Send</button>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <label className="flex items-center gap-2"><input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} /> Mask personal details</label>
          <button type="button" className="underline" onClick={() => { setMessages([]); mapRef.current = {}; }}>Clear chat</button>
        </div>
        <p className="mt-1 text-xs text-flag">{DISCLAIMER}</p>
      </form>
    </div>
  );
}
