# Prompt iteration log

Screenshots are in `docs/screenshots/`. Each feature was run with "Compare v1 vs v2" ticked on the same input.

| Feature | v1 prompt | What v1 got wrong | v2 changes | v2 result |
|---|---|---|---|---|
| Email | "Write an email. {scenario}. {details}" | Raw markdown symbols (**) in the text; invented details not in the input (HR and Finance panel, Teams/Zoom option, "arrive early", accommodations); used the candidate's email as the HR contact address; no review notes or sensitivity flags | Role, South African context, fixed layout, placeholders, review notes, safety rules | Clean plain text, placeholders for missing facts (date, venue, deadline), review notes included; but it mislabelled the candidate as the interviewer and left a placeholder instead of restoring the name |
| Meeting | "Summarize these meeting notes" | Loose bullet list with markdown stars; no decisions section, no owners, no deadlines | JSON schema, "Unassigned" and "Not specified" rules, no invented decisions | Validated table of action items; missing owner and deadline flagged, not guessed |
| Planner | "Make a plan for these tasks" | Very long markdown table; assumed 9-5 hours with a one-hour lunch instead of the 08:00-17:00 chosen; extra pep talk | Pre-ranked tasks from the algorithm, four fixed sections, plain text | Schedule within 08:00-17:00 following the ranking; union query delegated, contracts deferred; three tips |
| Research | "Summarize this" | Long essay and tables; mostly US and EU law, not relevant to South African HR | Five fixed headings, reading level, verify section, no fabricated sources | Short, scannable answer with TL;DR, insights, simplified explanation, recommendations |
| Chat | "You are a helpful assistant" | General answer, not tailored to HR or South African law | HR persona, concise, one clarifying question, legal caution, refusals | Answered the probation question with LRA-aware structure, a "not legal advice" note and a clarifying question |

## Issues found in testing (email)

- **v1:** the basic prompt produced markdown symbols, invented details that were never provided, and gave the candidate's email address as the HR contact. This is the risk of a basic prompt in an HR setting: a draft can look professional while containing made-up facts.
- **v2:** the engineered prompt removed the invented details and used placeholders instead, and it added review notes. However, because the candidate's name was masked, the model confused who was who and listed the candidate as the interviewer.
- **Planned fix (v3):** state each person's role explicitly in the prompt (for example "the candidate is X; the sender is the HR admin") and make sure masked names are restored correctly in the output.

## Observations and limits
- Output varies between runs of the same prompt.
- Speed: structured v2 prompts were sometimes slower (meeting 13.0s vs 4.7s; planner 22.6s vs 7.0s), probably because of service load and the fallback; the research v2 run was faster (5.6s vs 6.7s). In the email test, v1 took 4.4s and v2 took 5.0s.
- Masked names can confuse the model about who is who (the v2 email listed the candidate as the interviewer); a v3 prompt should state each person's role explicitly.
- The planner's v2 tips can assume tools the user never mentioned (e.g. payroll software); a v3 prompt should restrict tips to what was provided.
- Time-saved figures in the app are estimates, not measurements.

## Test inputs used
- Email: Interview invitation, Candidate, Formal, "Payroll Clerk, Thursday 10:00, Ms Thandi Nkosi, thandi@example.com"
- Meeting: notes with one missing owner and one missing deadline
- Planner: Run payroll / Reply to union query / Update leave policy / File old contracts (with urgency, importance, hours)
- Research: "Using AI in CV screening: risks of bias"
- Chat: "How should I structure a probation review meeting?"