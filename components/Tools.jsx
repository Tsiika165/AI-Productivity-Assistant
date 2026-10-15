"use client";
import { z } from "zod";
import ToolPanel from "./ToolPanel";
import { SCENARIOS } from "@/lib/prompts";
import { parseTasks, tasksToText } from "@/lib/planner";

export function EmailTool({ onRun }) {
  return (
    <ToolPanel
      feature="email" onRun={onRun} title="Email generator" submitLabel="Write email"
      blurb="Pick an HR scenario, who it is for, and the tone. Add the facts you have."
      fields={[
        { name: "scenario", label: "Scenario", type: "select", options: Object.keys(SCENARIOS) },
        { name: "audience", label: "Audience", type: "select", options: ["Candidate", "Employee", "Line manager", "Whole team", "External party"] },
        { name: "tone", label: "Tone", type: "select", options: ["Formal", "Friendly", "Persuasive", "Empathetic but firm"] },
        { name: "details", label: "Details", placeholder: "e.g. Interview for Payroll Clerk, Thursday 10:00, candidate Ms Thandi Nkosi, thandi@example.com", rows: 5, required: true },
      ]}
      prepare={(v) => ({ ...v, guidance: SCENARIOS[v.scenario] })}
    />
  );
}

const MeetingSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
  decisions: z.array(z.string()),
  actionItems: z.array(z.object({ task: z.string(), owner: z.string(), deadline: z.string() })),
  risks: z.array(z.string()).optional().default([]),
});

const Heading = ({ children, tone = "text-signal" }) => (
  <h4 className={`mb-2 font-mono text-[11px] font-medium uppercase tracking-widest ${tone}`}>{children}</h4>
);

function renderMeeting(text, version) {
  if (version !== "v2") return <div className="whitespace-pre-wrap text-sm leading-relaxed">{text}</div>;
  let data;
  try {
    data = MeetingSchema.parse(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch {
    return (
      <div className="text-sm">
        <p className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-red-300">The AI reply did not match the expected structure, so it was not shown as a summary. Run it again.</p>
        <pre className="whitespace-pre-wrap font-mono text-xs text-mute">{text}</pre>
      </div>
    );
  }
  const List = ({ title, items, tone }) => items.length > 0 && (
    <div>
      <Heading tone={tone}>{title}</Heading>
      <ul className="space-y-1.5 text-sm">
        {items.map((x, n) => (
          <li key={n} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />{x}</li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="space-y-5">
      <p className="text-[15px] leading-relaxed">{data.summary}</p>
      <List title="Key points" items={data.keyPoints} />
      <List title="Decisions" items={data.decisions} tone="text-volt" />
      <div>
        <Heading tone="text-spark">Action items</Heading>
        <div className="overflow-x-auto rounded-lg border border-edge">
          <table className="w-full min-w-[26rem] text-left text-sm">
            <thead className="bg-raised font-mono text-[11px] uppercase tracking-widest text-mute">
              <tr><th className="px-3 py-2 font-medium">Task</th><th className="px-3 font-medium">Owner</th><th className="px-3 font-medium">Deadline</th></tr>
            </thead>
            <tbody>
              {data.actionItems.map((a, n) => (
                <tr key={n} className="border-t border-edge">
                  <td className="px-3 py-2.5">{a.task}</td>
                  <td className={`px-3 ${a.owner === "Unassigned" ? "font-medium text-flag" : ""}`}>{a.owner}</td>
                  <td className={`px-3 font-mono text-xs ${a.deadline === "Not specified" ? "font-medium text-flag" : ""}`}>{a.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <List title="Risks" items={data.risks} tone="text-flag" />
    </div>
  );
}

export function MeetingTool({ onRun }) {
  return (
    <ToolPanel
      feature="meeting" onRun={onRun} title="Meeting notes summariser" submitLabel="Summarise notes" renderOutput={renderMeeting}
      blurb="Paste raw notes. You get decisions, action items, owners and deadlines. Missing owners and dates are highlighted, not guessed."
      fields={[{ name: "notes", label: "Meeting notes", rows: 10, required: true, placeholder: "Paste or type your notes here..." }]}
    />
  );
}

function PlannerPreview({ values }) {
  const tasks = parseTasks(values.tasks || "");
  if (tasks.length === 0) return null;
  const colour = { "Do now": "bg-red-500/15 text-red-300", Schedule: "bg-signal/15 text-signal", Delegate: "bg-flag/15 text-flag", "Defer / drop": "bg-edge text-mute" };
  return (
    <div className="rounded-lg border border-edge bg-raised/60 p-3">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-mute">Ranked by urgency and importance (calculated here, not by AI)</p>
      <ol className="space-y-1.5 text-xs">
        {tasks.map((t, n) => (
          <li key={n} className="flex items-center gap-2">
            <span className="w-4 font-mono text-mute">{n + 1}</span>
            <span className="min-w-0 flex-1 truncate">{t.name}</span>
            <span className={`chip ${colour[t.quadrant]}`}>{t.quadrant}</span>
            <span className="w-8 text-right font-mono text-mute">{t.hours}h</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PlannerTool({ onRun }) {
  return (
    <ToolPanel
      feature="planner" onRun={onRun} title="Task planner" submitLabel="Build plan" Preview={PlannerPreview}
      blurb="One task per line: name | urgency 1-5 | importance 1-5 | hours. The app ranks them, then the AI builds the schedule."
      fields={[
        { name: "period", label: "Plan for", type: "select", options: ["daily", "weekly"] },
        { name: "hours", label: "Working hours", type: "select", options: ["08:00-17:00", "09:00-16:30", "07:30-16:00"] },
        { name: "tasks", label: "Tasks", rows: 7, required: true, placeholder: "Run payroll | 5 | 5 | 3\nReply to union query | 4 | 2 | 1\nUpdate leave policy | 2 | 5 | 4" },
      ]}
      prepare={(v) => ({ ...v, tasks: tasksToText(parseTasks(v.tasks)) })}
    />
  );
}

export function ResearchTool({ onRun }) {
  return (
    <ToolPanel
      feature="research" onRun={onRun} title="Research assistant" submitLabel="Summarise"
      blurb="Paste an article or report, or type a topic. You get key insights, a simple explanation, recommendations and what to verify."
      fields={[
        { name: "level", label: "Explain it at", type: "select", options: ["Plain language", "Professional", "Technical"] },
        { name: "content", label: "Article text or topic", rows: 9, required: true, placeholder: "Paste text, or type a topic such as 'Using AI in CV screening: risks of bias'" },
      ]}
    />
  );
}