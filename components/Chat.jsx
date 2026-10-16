"use client";

import { useEffect, useRef, useState } from "react";
import { runFeature } from "@/lib/client";
import { DISCLAIMER } from "./Output";
import Icon from "./Icon";
import Toggle from "./Toggle";

const STARTERS = [
  "How should I structure a probation review meeting?",
  "Rewrite this to sound more neutral: ...",
  "What should a fair disciplinary hearing invitation include?",
];

export default function Chat({ onRun }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [safe, setSafe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mapRef = useRef({});
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  async function send(e) {
    e.preventDefault();

    if (!text.trim() || loading) return;

    const next = [
      ...messages,
      {
        role: "user",
        content: text.trim(),
      },
    ];

    setMessages(next);
    setText("");
    setLoading(true);
    setError("");

    try {
      const r = await runFeature({
        feature: "chat",
        version: "v2",
        messages: next.slice(-12),
        safe,
        map: mapRef.current,
      });

      mapRef.current = r.map;

      setMessages([
        ...next,
        {
          role: "assistant",
          content: r.text,
        },
      ]);

      onRun?.("chat");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setText("");
    setError("");
    mapRef.current = {};
  }

  return (
    <div className="panel flex h-[68vh] min-h-[32rem] max-w-none flex-col overflow-hidden transition-colors duration-200">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-edge bg-[var(--header-bg)] px-5 py-3.5 transition-colors duration-200">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-signal/10 text-signal ring-1 ring-signal/30">
          <Icon name="chat" />
        </span>

        <div className="leading-tight">
          <p className="font-display font-semibold tracking-tight text-fg">
            HR Desk
          </p>

          <p className="flex items-center gap-1.5 text-[11px] text-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-volt" />
            online
          </p>
        </div>

        <button type="button" className="btn-ghost ml-auto" onClick={clearChat}>
          Clear chat
        </button>
      </div>

      {/* Chat messages and starter prompts */}
      <div
        className="flex-1 space-y-4 overflow-y-auto bg-[var(--surface)] px-5 py-5 transition-colors duration-200"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="animate-rise">
            <p className="font-display text-xl font-semibold text-fg">
              Ask HR Desk anything about your workday.
            </p>

            <p className="mt-1 text-sm text-mute">
              Pick a starter or type your own.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => setText(starter)}
                  className="w-full rounded-lg border border-edge bg-raised px-3 py-3 text-left text-sm text-fg transition-colors duration-200 hover:border-signal/60 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation history */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex animate-rise ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                message.role === "user"
                  ? "rounded-br-sm bg-signal/15 text-fg ring-1 ring-signal/40"
                  : "rounded-bl-sm border border-edge bg-raised text-fg"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div
            className="flex justify-start"
            role="status"
            aria-label="HR Desk is typing"
          >
            <div className="flex gap-1.5 rounded-2xl rounded-bl-sm border border-edge bg-raised px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-blink rounded-full bg-signal"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500 dark:text-red-300"
          >
            {error} Send your message again.
          </p>
        )}

        <div ref={endRef} />
      </div>

      {/* Message input and privacy controls */}
      <form
        onSubmit={send}
        className="space-y-3 border-t border-edge bg-[var(--header-bg)] p-4 transition-colors duration-200"
      >
        <div className="flex gap-2">
          <input
            className="field min-w-0"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your question"
            aria-label="Message"
            disabled={loading}
          />

          <button
            type="submit"
            className="btn shrink-0 px-4"
            disabled={loading || !text.trim()}
            aria-label="Send"
          >
            <Icon name="send" className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        <Toggle
          checked={safe}
          onChange={setSafe}
          label="Mask personal details"
          tag="privacy"
        />

        <p className="text-[11px] leading-relaxed text-flag/80">{DISCLAIMER}</p>
      </form>
    </div>
  );
}
