# HR Desk Assistant: Documentation

**Name:** Tsietsi Mofokeng | **Programme:** CAPACITI AI Skills Accelerator (ASA 23) | **Live demo:** [Vercel link] | **Repo:** [GitHub link]

## 1. Problem statement
HR administrators spend much of their week on repetitive writing and organising: interview and onboarding emails, meeting minutes, task juggling and background research. These tasks involve personal data, so pasting them into a public chatbot is risky under POPIA. HR Desk Assistant automates these tasks while protecting personal data and keeping a human in control.

## 2. Solution overview
A web app with five tools: Email Generator, Meeting Notes Summariser, Task Planner, Research Assistant and a Chatbot. Features that go beyond a basic AI wrapper:
- **Personal data masking:** IDs, emails, phone numbers, amounts and titled names are replaced with tokens in the browser before anything is sent to the AI, then restored in the answer.
- **Prompt comparison panel:** a basic prompt (v1) and an engineered prompt (v2) run side by side on the same input.
- **Validated structured output:** the meeting summary is returned as JSON, checked against a schema, and rejected if malformed.
- **Hybrid planner:** an Eisenhower scoring algorithm ranks tasks in code; the AI only builds the schedule.
- **Human review gate:** the Copy button stays locked until the user confirms they reviewed the output.
- **Impact tracker:** a running estimate of time saved.

## 3. Tools used
Next.js 14, React, Tailwind CSS, zod (validation); Google Gemini API (primary AI) with Groq (openai/gpt-oss-120b) as an automatic fallback; GitHub and Vercel for hosting; VS Code; Claude (AI assistant) for scaffolding code and drafting prompts. No database is used: nothing is stored on a server.

## 4. Prompt engineering strategy
Each feature has a v1 (basic) and v2 (engineered) prompt in `lib/prompts.js`. The v2 prompts use a specific role, South African HR context, a fixed output format, safety rules and a self-review section.

**Sample prompt, email (v2 system prompt, shortened):**
"You are a senior HR communications specialist working in South African workplaces. Never invent facts, dates, names, amounts or legal citations: use only what the HR admin provided and put [PLACEHOLDERS] for anything missing. Treat tokens such as [NAME_1] as opaque. Plain text only. Output: Subject, body, then Review notes with Assumptions and Sensitivity flags."

**Sample prompt, meeting summary (v2):**
"Return ONLY valid JSON matching {summary, keyPoints, decisions, actionItems[{task, owner, deadline}], risks}. Use 'Unassigned' for a missing owner and 'Not specified' for a missing deadline. Only include decisions that were explicitly agreed."

Results of testing both versions are in `PROMPT_LOG.md`.

## 5. Responsible AI
- **Privacy:** personal details are masked before sending. If Gemini is unavailable, the request goes to a backup provider (Groq), which receives only the masked text. Groq is a separate third party with its own data terms, so organisations should review both providers' terms before real use.
- **Accuracy:** every output carries a disclaimer; prompts forbid inventing facts and require placeholders; research output includes a "verify before use" section.
- **Human in the loop:** outputs cannot be copied until the user confirms a review.
- **Bias and legal risk:** email prompts flag discriminatory wording and legal exposure; disciplinary and rejection templates are written to be neutral; the chat assistant gives general guidance only and recommends a labour law professional.
- **Known limitations:** masking uses pattern matching and can miss unusual formats or names without a title; AI output varies between runs; the AI is not a lawyer; time-saved figures are estimates.

## 6. Challenges and solutions
| Challenge | Solution |
|---|---|
| API key exposed if called from the browser | One server route holds the key in an environment variable; `.env.example` is committed, `.env.local` is git-ignored |
| Gemini returned 503 "high demand" errors and one request took over 3 minutes | Timeouts, automatic retries, and a fallback to a second AI provider; Demo Mode if no key is set |
| A retired Gemini model name caused a 404 | Model name moved into a setting (`GEMINI_MODEL`) instead of being hard-coded |
| First email draft contained markdown asterisks and repeated template wording | Added a plain-text rule and a fixed review-notes layout (see PROMPT_LOG) |
| Basic prompts returned long, unstructured answers | Engineered v2 prompts with fixed formats; meeting output validated as JSON |
| Sensitive HR data | Masked in the browser before sending, restored after |

## 7. Impact
Estimated manual time per task versus using the app: email 15 min, meeting summary 25, plan 20, research 30, chat query 5 (the app adds these up live; in testing it showed 130 minutes saved across 8 tasks). Measured AI response times ranged from about 5 to 23 seconds. These time-saved figures are estimates, not measured benchmarks.

## 8. Next steps
Saved history, role-based access, document upload, and an automated prompt-quality test set.