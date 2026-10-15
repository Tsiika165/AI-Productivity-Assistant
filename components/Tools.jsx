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

function renderMeeting(text, version) {
  if (version !== "v2") return <div className="whitespace-pre-wrap text-sm leading-relaxed">{text}</div>;
  let data;
  try {
    data = MeetingSchema.parse(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch {
    return (
      <div className="text-sm">
        <p className="mb-2 text-red-700">The AI reply did not match the expected structure, so it was not shown as a summary. Run it again.</p>
        <pre className="whitespace-pre-wrap text-xs text-slate-600">{text}</pre>
      </div>
    );
  }
  const List = ({ title, items }) => items.length > 0 && (
    <div><h4 className="mb-1 text-sm font-semibold">{title}</h4><ul className="list-disc space-y-0.5 pl-5 text-sm">{items.map((x, n) => <li key={n}>{x}</li>)}</ul></div>
  );
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">{data.summary}</p>
      <List title="Key points" items={data.keyPoints} />
      <List title="Decisions" items={data.decisions} />
      <div>
        <h4 className="mb-1 text-sm font-semibold">Action items</h4>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="text-xs text-slate-600"><tr><th className="py-1 pr-3">Task</th><th className="pr-3">Owner</th><th>Deadline</th></tr></thead>
            <tbody>
              {data.actionItems.map((a, n) => (
                <tr key={n} className="border-t border-slate-100">
                  <td className="py-1.5 pr-3">{a.task}</td>
                  <td className={`pr-3 ${a.owner === "Unassigned" ? "text-flag" : ""}`}>{a.owner}</td>
                  <td className={a.deadline === "Not specified" ? "text-flag" : ""}>{a.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <List title="Risks" items={data.risks} />
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
  const colour = { "Do now": "text-red-700", Schedule: "text-signal", Delegate: "text-flag", "Defer / drop": "text-slate-500" };
  return (
    <div className="rounded-md bg-mist p-2 text-xs">
      <p className="mb-1 font-medium">Ranked by urgency and importance (calculated here, not by AI)</p>
      <ol className="space-y-0.5">
        {tasks.map((t, n) => <li key={n}>{n + 1}. {t.name} <span className={`font-medium ${colour[t.quadrant]}`}>{t.quadrant}</span> ({t.hours}h)</li>)}
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
