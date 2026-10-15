"use client";
import { useEffect, useState } from "react";
import { EmailTool, MeetingTool, PlannerTool, ResearchTool } from "@/components/Tools";
import Chat from "@/components/Chat";
import Icon from "@/components/Icon";
import { MINUTES_SAVED } from "@/lib/client";

const TABS = [
  { id: "chat", label: "Chat", icon: "chat", Comp: Chat },
  { id: "email", label: "Email generator", icon: "mail", Comp: EmailTool },
  { id: "meeting", label: "Meeting summariser", icon: "notes", Comp: MeetingTool },
  { id: "planner", label: "Task planner", icon: "calendar", Comp: PlannerTool },
  { id: "research", label: "Research assistant", icon: "search", Comp: ResearchTool },
];

export default function Home() {
  const [tab, setTab] = useState("chat");
  const [stats, setStats] = useState({ runs: 0, minutes: 0 });

  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem("hrdesk-stats")); if (s) setStats(s); } catch {}
  }, []);

  const record = (feature) =>
    setStats((s) => {
      const next = { runs: s.runs + 1, minutes: s.minutes + (MINUTES_SAVED[feature] || 0) };
      try { localStorage.setItem("hrdesk-stats", JSON.stringify(next)); } catch {}
      return next;
    });

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 pb-10 pt-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="21" stroke="#22D3EE" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="3 5" />
            <circle cx="24" cy="24" r="14" stroke="#22D3EE" strokeWidth="2" />
            <path d="M17 24h14M24 17v14" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              HR Desk <span className="text-signal">Assistant</span>
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-mute">
              Drafts, summaries and plans for HR administrators, with personal data masked and a human check on every output.
            </p>
          </div>
        </div>

        <div className="hud panel flex items-center gap-4 px-5 py-3" title="Estimates: email 15 min, meeting 25, plan 20, research 30, chat 5 per use">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-volt/10 text-volt ring-1 ring-volt/30"><Icon name="bolt" /></span>
          <div className="leading-tight">
            <p className="font-mono text-[11px] uppercase tracking-widest text-mute">Time reclaimed</p>
            <p className="font-display text-2xl font-bold">
              {stats.minutes}<span className="ml-1 text-sm font-medium text-mute">min</span>
            </p>
            <p className="font-mono text-[11px] text-mute">across {stats.runs} task{stats.runs === 1 ? "" : "s"}</p>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-20 -mx-4 mb-8 overflow-x-auto bg-void/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6" role="tablist" aria-label="Tools">
        <div className="flex min-w-max gap-2">
          {TABS.map((t, i) => {
            const active = tab === t.id;
            return (
              <button key={t.id} role="tab" aria-selected={active} onClick={() => setTab(t.id)}
                className={`group flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  active
                    ? "border-signal/60 bg-signal/10 text-signal shadow-[0_0_24px_-8px_rgba(34,211,238,0.8)]"
                    : "border-edge bg-surface/80 text-mute hover:border-mute/50 hover:text-fg"}`}>
                <span className={`font-mono text-[11px] ${active ? "text-signal/70" : "text-mute/60"}`}>0{i + 1}</span>
                <Icon name={t.icon} className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      {TABS.map(({ id, Comp }) => (
        <div key={id} role="tabpanel" hidden={tab !== id} className="animate-rise"><Comp onRun={record} /></div>
      ))}

      <footer className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-edge pt-5 font-mono text-[11px] text-mute">
        <span className="flex items-center gap-1.5"><Icon name="shield" className="h-3.5 w-3.5 text-volt" /> Nothing is stored on a server</span>
        <span>Time-saved figures are estimates</span>
        <span>Outputs are AI drafts: verify before sending</span>
      </footer>
    </div>
  );
}