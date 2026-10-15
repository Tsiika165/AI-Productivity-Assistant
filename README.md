# HR Desk Assistant: AI-Powered Workplace Productivity Assistant

Built for the CAPACITI AI Skills Accelerator project. Target user: **HR administrators** in South African workplaces.

## Features (all 5 from the brief)
| Feature | What it does |
|---|---|
| Smart Email Generator | 7 HR scenario templates, 4 tones, 5 audiences, review notes with sensitivity flags |
| Meeting Notes Summariser | Returns validated JSON (zod): summary, decisions, action items, owners, deadlines, risks |
| Task Planner | Eisenhower ranking done by an algorithm, schedule and tips written by the AI |
| Research Assistant | TL;DR, key insights, simplified explanation, recommendations, "verify before use" |
| Chatbot | HR Desk assistant with conversation memory and a safety-focused system prompt |

## What makes it different
1. **POPIA-minded PII masking**: IDs, emails, phones, amounts, names are replaced with tokens in the browser before anything is sent, then restored in the reply (`lib/pii.js`).
2. **Prompt A/B panel**: tick "Compare" to run a basic prompt (v1) and the engineered prompt (v2) side by side (`lib/prompts.js`).
3. **Structured outputs**: the meeting summary is parsed and validated; malformed AI output is rejected, not displayed.
4. **Hybrid planning**: a deterministic algorithm ranks tasks, AI only explains and schedules.
5. **Human review gate**: Copy is locked until the user ticks "I have reviewed this output".
6. **Impact tracker**: running estimate of minutes saved.

## Run it
```bash
npm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
# add your key to .env.local (free: https://aistudio.google.com/apikey)
npm run dev
```
Open http://localhost:3000. **No key? It still runs in Demo Mode** with sample outputs.

## Structure
```
app/api/generate/route.js   single server route that holds the API key
app/page.js                 tabs + time-saved tracker
components/                 ToolPanel (generic tool), Tools, Chat, Output (review gate)
lib/prompts.js              versioned prompt library (v1 vs v2)
lib/pii.js                  redaction + restore
lib/planner.js              Eisenhower scoring
lib/gemini.js, lib/demo.js  model call, demo fallback
docs/                       DOCUMENTATION.md, PROMPT_LOG.md, SLIDES.md
```
No database: nothing is stored server-side. Only the time-saved counter uses browser localStorage.
