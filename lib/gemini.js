// Tries Gemini first; if it keeps failing, falls back to any OpenAI-compatible provider (e.g. Groq).
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const RETRYABLE = [429, 500, 503];

async function tryGemini({ system, messages, json, temperature }, key) {
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { temperature, ...(json ? { responseMimeType: "application/json" } : {}) },
    }),
  });
  if (!res.ok) return { error: `Gemini error ${res.status}: ${(await res.text()).slice(0, 150)}`, status: res.status };
  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
  return text ? { text } : { error: "Gemini returned an empty response.", status: 500 };
}

async function tryFallback({ system, messages, temperature }) {
  const res = await fetch(`${process.env.FALLBACK_BASE_URL}/chat/completions`, {
    method: "POST",
    signal: AbortSignal.timeout(30000),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.FALLBACK_API_KEY}` },
    body: JSON.stringify({
      model: process.env.FALLBACK_MODEL,
      temperature,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok) return { error: `Fallback error ${res.status}: ${(await res.text()).slice(0, 150)}` };
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "";
  return text ? { text } : { error: "Fallback returned an empty response." };
}

export async function callModel({ system, messages, json = false, temperature = 0.4 }) {
  const key = process.env.GEMINI_API_KEY;
  const hasFallback = process.env.FALLBACK_API_KEY && process.env.FALLBACK_BASE_URL && process.env.FALLBACK_MODEL;
  if (!key && !hasFallback) return { demo: true };

  const args = { system, messages, json, temperature };
  let lastError = "";

  if (key) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const r = await tryGemini(args, key);
        if (r.text) return { demo: false, text: r.text, provider: "gemini" };
        lastError = r.error;
        if (!RETRYABLE.includes(r.status)) break; // e.g. bad key or model: go straight to fallback
      } catch (e) {
        lastError = e.name === "TimeoutError" ? "Gemini took too long to respond." : e.message;
      }
      await sleep(1500);
    }
  }

  if (hasFallback) {
    try {
      const r = await tryFallback(args);
      if (r.text) return { demo: false, text: r.text, provider: "fallback" };
      lastError = r.error;
    } catch (e) {
      lastError = e.name === "TimeoutError" ? "The backup AI took too long to respond." : e.message;
    }
  }
  throw new Error(`${lastError} Please try again in a minute.`);
}