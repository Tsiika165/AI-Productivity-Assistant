"use client";
import { useEffect, useState } from "react";
import { EmailTool, MeetingTool, PlannerTool, ResearchTool } from "@/components/Tools";
import Chat from "@/components/Chat";
import { MINUTES_SAVED } from "@/lib/client";

const TABS = [
  { id: "chat", label: "Chat", Comp: Chat },
  { id: "email", label: "Email generator", Comp: EmailTool },
  { id: "meeting", label: "Meeting summariser", Comp: MeetingTool },
  { id: "planner", label: "Task planner", Comp: PlannerTool },
  { id: "research", label: "Research assistant", Comp: ResearchTool },
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
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">HR Desk Assistant</h1>
          <p className="text-sm text-slate-600">Drafts, summaries and plans for HR administrators, with personal data masked and a human check on every output.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm" title="Estimates: email 15 min, meeting 25, plan 20, research 30, chat 5 per use">
          <span className="font-semibold">{stats.minutes} min</span> saved across {stats.runs} task{stats.runs === 1 ? "" : "s"}
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-1 border-b border-slate-300" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-signal ${tab === t.id ? "border-signal text-ink" : "border-transparent text-slate-600 hover:text-ink"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {TABS.map(({ id, Comp }) => (
        <div key={id} role="tabpanel" hidden={tab !== id}><Comp onRun={record} /></div>
      ))}

      <footer className="mt-10 border-t border-slate-300 pt-4 text-xs text-slate-600">
        Time-saved figures are estimates. Outputs are AI drafts: verify before sending. Nothing is stored on a server.
      </footer>
    </div>
  );
}
