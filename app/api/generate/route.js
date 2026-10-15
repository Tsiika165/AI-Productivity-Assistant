import { NextResponse } from "next/server";
import { PROMPTS } from "@/lib/prompts";
import { callModel } from "@/lib/gemini";
import { demoOutput } from "@/lib/demo";

export async function POST(req) {
  try {
    const { feature, version = "v2", input = {}, messages } = await req.json();
    const prompt = PROMPTS[feature]?.[version];
    if (!prompt) return NextResponse.json({ error: "Unknown feature or prompt version." }, { status: 400 });

    const msgs = feature === "chat" ? messages : [{ role: "user", content: prompt.build(input) }];
    if (!Array.isArray(msgs) || msgs.length === 0) return NextResponse.json({ error: "Nothing to send." }, { status: 400 });
    if (JSON.stringify(msgs).length > 20000) return NextResponse.json({ error: "Input is too long (max ~20,000 characters)." }, { status: 413 });

    const system = prompt.system.replace("{period}", input.period || "daily");
    const started = Date.now();
    const result = await callModel({ system, messages: msgs, json: !!prompt.json });
    const text = result.demo ? demoOutput(feature, version, input) : result.text;
    return NextResponse.json({ text, demo: !!result.demo, ms: Date.now() - started });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Something went wrong." }, { status: 500 });
  }
}
