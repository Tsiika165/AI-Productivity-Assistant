// Client-side PII redaction (POPIA-minded). Sensitive values are replaced by
// tokens like [ID_NUMBER_1] BEFORE text leaves the browser, then restored in the AI output.
const RULES = [
  { type: "ID_NUMBER", re: /\b\d{6}\d{4}[01]\d{2}\b/g }, // SA ID: 13 digits
  { type: "EMAIL", re: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi },
  { type: "PHONE", re: /(?:\+27|0)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/g },
  { type: "AMOUNT", re: /\bR\s?\d+(?:[ ,]\d{3})*(?:\.\d{2})?\b/g },
  { type: "ACCOUNT_NUMBER", re: /\b\d{9,11}\b/g },
  { type: "NAME", re: /\b(?:Mr|Mrs|Ms|Miss|Mx|Dr|Prof)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g },
];

/** @param {string} text @param {Record<string,string>} existing token->original map, keeps tokens consistent across calls */
export function redact(text, existing = {}) {
  const map = { ...existing };
  const reverse = Object.fromEntries(Object.entries(map).map(([t, o]) => [o, t]));
  const counters = {};
  Object.keys(map).forEach((t) => {
    const m = t.match(/^\[([A-Z_]+)_(\d+)\]$/);
    if (m) counters[m[1]] = Math.max(counters[m[1]] || 0, Number(m[2]));
  });
  const swap = (type) => (match) => {
    if (reverse[match]) return reverse[match];
    counters[type] = (counters[type] || 0) + 1;
    const token = `[${type}_${counters[type]}]`;
    map[token] = match;
    reverse[match] = token;
    return token;
  };
  let out = text;
  for (const { type, re } of RULES) out = out.replace(re, swap(type));
  return { text: out, map };
}

export function restore(text, map) {
  let out = text;
  for (const [token, original] of Object.entries(map)) out = out.split(token).join(original);
  return out;
}
