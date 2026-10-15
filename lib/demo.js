// Pre-written sample outputs used when no API key is configured (safe fallback for demos).
const tag = "[DEMO MODE: sample output, add GEMINI_API_KEY for live AI]\n\n";

export function demoOutput(feature, version, input = {}) {
  const v2 = version === "v2";
  if (feature === "email") {
    return tag + (v2
      ? `Subject: Interview invitation: ${input.scenario || "Position"} at [COMPANY NAME]

Dear [CANDIDATE NAME],

Thank you for applying for the [JOB TITLE] role. We were impressed by your application and would like to invite you to an interview.

Date and time: [DATE], [TIME]
Venue: [ADDRESS / VIDEO LINK]
You will meet: [INTERVIEWER NAMES]
Please bring a certified copy of your ID and your qualifications.

Kindly confirm your attendance by [DATE] by replying to this email.

Kind regards,
[SENDER NAME]
[JOB TITLE]

--- Review notes ---
- Assumed an in-person or video interview; dates and names left as placeholders.
- Sensitivity flags: None found.`
      : `Hi, we would like to invite you for an interview. Please let us know when you are free. Thanks.`);
  }
  if (feature === "meeting") {
    return v2
      ? JSON.stringify({
          summary: "Team agreed to move the onboarding review to Friday and to start the leave-policy update. Two items are blocked on payroll input.",
          keyPoints: ["Onboarding checklist has 3 outdated steps", "Leave policy needs POPIA wording", "Payroll cut-off is the 25th"],
          decisions: ["Onboarding review moves to Friday", "Leave policy update starts next week"],
          actionItems: [
            { task: "Update onboarding checklist", owner: "Unassigned", deadline: "Friday" },
            { task: "Draft POPIA wording for leave policy", owner: "Nomsa", deadline: "Not specified" },
            { task: "Confirm payroll cut-off with Finance", owner: "Unassigned", deadline: "Not specified" },
          ],
          risks: ["Payroll delays could block the leave policy rollout"],
        })
      : tag + "The team discussed onboarding, the leave policy and payroll. They agreed to some changes and will follow up.";
  }
  if (feature === "planner") {
    return tag + (v2
      ? `PLAN
08:00-10:00  Do now: top-ranked task (deep work, notifications off)
10:00-10:15  Buffer
10:15-12:00  Second-ranked task
13:00-14:30  Schedule quadrant: important, not urgent work
14:30-15:30  Admin and email block

WHY THIS ORDER
Urgent and important work goes first while energy is high.

DELEGATE / DEFER
Delegate urgent-but-unimportant items. Defer low-score items to next week.

TIME OPTIMISATION TIPS
1. Batch email into two fixed windows.
2. Keep one 90-minute deep-work block daily.
3. Use templates for repeat HR letters.`
      : "Monday: do the tasks. Tuesday: do more tasks. Try to be organised.");
  }
  if (feature === "research") {
    return tag + (v2
      ? `TL;DR
This topic matters for HR because it changes how routine work is done and what must be protected.

KEY INSIGHTS
- Automation saves time on repetitive admin
- Human review is still required for sensitive decisions
- Data protection obligations (POPIA) still apply

SIMPLIFIED
Think of it as a fast assistant that drafts, while you stay the decision-maker.

RECOMMENDATIONS FOR HR
- Start with low-risk tasks
- Redact personal data before using AI
- Keep an approval step

VERIFY BEFORE USE
Nothing flagged in demo mode. Verify any figures against the original source.`
      : "This is about AI in HR. It is useful and has some risks.");
  }
  return tag + "I can help with that. Add GEMINI_API_KEY to .env.local to get live answers. In the meantime: could you tell me who the message is for and what outcome you want?";
}
