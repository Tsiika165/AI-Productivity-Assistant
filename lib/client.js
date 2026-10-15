import { redact, restore } from "./pii";

/** Calls /api/generate. When `safe` is on, PII is masked before sending and restored in the reply. */
export async function runFeature({ feature, version = "v2", input, messages, safe = true, map = {} }) {
  let activeMap = map;
  let payload = { feature, version };
  if (messages) {
    const masked = messages.map((m) => {
      if (!safe) return m;
      const r = redact(m.content, activeMap);
      activeMap = r.map;
      return { ...m, content: r.text };
    });
    payload.messages = masked;
  } else {
    const masked = {};
    for (const [k, v] of Object.entries(input)) {
      if (safe && typeof v === "string") {
        const r = redact(v, activeMap);
        activeMap = r.map;
        masked[k] = r.text;
      } else masked[k] = v;
    }
    payload.input = masked;
  }
  const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return { ...data, text: safe ? restore(data.text, activeMap) : data.text, map: activeMap, redactions: Object.keys(activeMap).length, sent: payload };
}

export const MINUTES_SAVED = { email: 15, meeting: 25, planner: 20, research: 30, chat: 5 };
