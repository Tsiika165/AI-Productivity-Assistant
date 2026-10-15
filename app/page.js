
"use client";

import { useEffect, useState } from "react";
import {
  EmailTool,
  MeetingTool,
  PlannerTool,
  ResearchTool,
} from "@/components/Tools";
import Chat from "@/components/Chat";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import { MINUTES_SAVED } from "@/lib/client";

const TABS = [
  {
    id: "chat",
    label: "Ask HR Desk",
    short: "Assistant",
    icon: "chat",
    Comp: Chat,
    description: "A thoughtful second pair of hands",
  },
  {
    id: "email",
    label: "Email writer",
    short: "Email writer",
    icon: "mail",
    Comp: EmailTool,
    description: "Find the right words, faster",
  },
  {
    id: "meeting",
    label: "Meeting notes",
    short: "Meeting notes",
    icon: "notes",
    Comp: MeetingTool,
    description: "Turn conversations into actions",
  },
  {
    id: "planner",
    label: "Task planner",
    short: "Task planner",
    icon: "calendar",
    Comp: PlannerTool,
    description: "Make a workable plan for the day",
  },
  {
    id: "research",
    label: "Research desk",
    short: "Research desk",
    icon: "search",
    Comp: ResearchTool,
    description: "Make dense information clearer",
  },
];

export default function Home() {
  const [tab, setTab] = useState("chat");
  const [stats, setStats] = useState({
    runs: 0,
    minutes: 0,
  });

  const active = TABS.find((t) => t.id === tab) || TABS[0];
  const activeIndex = TABS.findIndex((t) => t.id === tab) + 1;

  useEffect(() => {
    try {
      const savedStats = JSON.parse(
        localStorage.getItem("hrdesk-stats")
      );

      if (savedStats) {
        setStats(savedStats);
      }
    } catch {
      // Ignore unavailable or invalid saved statistics.
    }
  }, []);

  const record = (feature) =>
    setStats((currentStats) => {
      const next = {
        runs: currentStats.runs + 1,
        minutes:
          currentStats.minutes + (MINUTES_SAVED[feature] || 0),
      };

      try {
        localStorage.setItem("hrdesk-stats", JSON.stringify(next));
      } catch {
        // The statistics still update for the current session.
      }

      return next;
    });

  return (
    <div className="app-shell min-h-screen">
      <header className="topbar">
        <a
          href="#home"
          className="brand-lockup"
          aria-label="HR Desk home"
          onClick={(event) => {
            event.preventDefault();
            setTab("chat");
          }}
        >
          <span className="brand-mark">
            <span>h</span>
            <i />
          </span>

          <span className="brand-copy">
            <strong>HR Desk</strong>
            <small>WORKPLACE TOOLKIT</small>
          </span>
        </a>

        <div className="topbar-right">
          <span className="workspace-label">
            <span className="status-dot" />
            Your private workspace
          </span>

          <ThemeToggle />

          <span
            className="avatar"
            aria-label="Workspace profile"
            title="HR Desk workspace"
          >
            HR
          </span>
        </div>
      </header>

      <main id="home" className="main-layout">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">YOUR EVERYDAY WORKSPACE</p>

            <h1>
              Good work starts <em>with a little help.</em>
            </h1>

            <p className="welcome-copy">
              Practical support for the busy parts of HR — from the
              first draft to the final follow-up.
            </p>
          </div>

          <div
            className="time-card"
            title="Estimated time saved per use: email 15 min, meeting 25, plan 20, research 30, chat 5"
          >
            <span className="time-icon">
              <Icon name="bolt" className="h-5 w-5" />
            </span>

            <div>
              <small>ESTIMATED TIME SAVED</small>

              <strong>
                {stats.minutes}
                <span> min</span>
              </strong>

              <p>
                Across {stats.runs} task
                {stats.runs === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </section>

        <div className="workspace-grid">
          <aside className="sidebar" aria-label="Workspace tools">
            <p className="sidebar-heading">YOUR TOOLS</p>

            <nav
              className="tool-nav"
              role="tablist"
              aria-label="Choose a tool"
            >
              {TABS.map((tool) => {
                const selected = tab === tool.id;

                return (
                  <button
                    key={tool.id}
                    type="button"
                    role="tab"
                    id={`tab-${tool.id}`}
                    aria-controls={`panel-${tool.id}`}
                    aria-selected={selected}
                    onClick={() => setTab(tool.id)}
                    className={`tool-nav-item ${
                      selected ? "is-active" : ""
                    }`}
                  >
                    <span className="nav-icon">
                      <Icon
                        name={tool.icon}
                        className="h-[18px] w-[18px]"
                      />
                    </span>

                    <span className="nav-label">
                      <strong>{tool.short}</strong>
                      <small>{tool.description}</small>
                    </span>

                    {selected && (
                      <span className="nav-arrow" aria-hidden="true">
                        ↗
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="sidebar-note">
              <span className="note-icon">
                <Icon name="shield" className="h-4 w-4" />
              </span>

              <strong>Your work stays yours.</strong>

              <p>
                Personal details can be masked before content is sent
                for AI processing.
              </p>
            </div>
          </aside>

          <section
            className="workspace-content"
            aria-label="Selected productivity tool"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  HR DESK / {String(activeIndex).padStart(2, "0")}
                </p>

                <h2>{active.label}</h2>

                <p>{active.description}.</p>
              </div>

              <span className="tool-count">
                TOOL {String(activeIndex).padStart(2, "0")}{" "}
                <span>OF 05</span>
              </span>
            </div>

            {TABS.map(({ id, Comp }) => (
              <div
                key={id}
                id={`panel-${id}`}
                role="tabpanel"
                aria-labelledby={`tab-${id}`}
                hidden={tab !== id}
                className="tool-stage"
                tabIndex={tab === id ? 0 : -1}
              >
                <Comp onRun={record} />
              </div>
            ))}
          </section>
        </div>

        <footer className="app-footer">
          <span>
            <Icon name="shield" className="h-4 w-4" />
            Built with privacy and human judgement in mind
          </span>

          <span>AI outputs are drafts. Please review before use.</span>

          <span className="footer-credit">
            HR DESK <i>·</i> PRODUCTIVITY, WITH CARE
          </span>
        </footer>
      </main>
    </div>
  );
}
