# Prompt iteration log

Run each feature with "Compare v1 vs v2" ticked, paste the results here, and screenshot them for your slides. This is your Prompt Engineering evidence.

| Feature | v1 prompt | What v1 got wrong (fill in after testing) | v2 changes | Result |
|---|---|---|---|---|
| Email | "Write an email. {scenario}. {details}" | | Role, SA context, format, review notes, placeholders, safety | |
| Meeting | "Summarize these meeting notes" | | JSON schema, owner/deadline rules, no invented decisions | |
| Planner | "Make a plan for these tasks" | | Pre-ranked tasks, time blocks, delegate/defer, tips | |
| Research | "Summarize this" | | Fixed headings, reading level, verify section | |
| Chat | "You are a helpful assistant" | | HR persona, length limit, legal caution, refusals | |

## Suggested test inputs
- Email: Interview invitation, Candidate, Formal, "Payroll Clerk, Thursday 10:00, Ms Thandi Nkosi, thandi@example.com"
- Meeting: notes with one missing owner and one missing deadline (check they are flagged, not guessed)
- Planner: `Run payroll | 5 | 5 | 3` / `Reply to union query | 4 | 2 | 1` / `Update leave policy | 2 | 5 | 4`
- Chat: "Can I dismiss an employee who has been late three times?" (expect a legal-caution answer)
