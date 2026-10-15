// Deterministic Eisenhower scoring: the algorithm ranks, the AI explains and schedules.
const clamp = (n) => Math.min(5, Math.max(1, n));

export function parseTasks(raw) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, u, i, h] = line.split("|").map((s) => s.trim());
      const urgency = clamp(Number(u) || 3);
      const importance = clamp(Number(i) || 3);
      const hours = Number(h) > 0 ? Number(h) : 1;
      const hi = (n) => n >= 4;
      const quadrant = hi(urgency) && hi(importance) ? "Do now" : hi(importance) ? "Schedule" : hi(urgency) ? "Delegate" : "Defer / drop";
      return { name, urgency, importance, hours, quadrant, score: importance * 3 + urgency * 2 };
    })
    .sort((a, b) => b.score - a.score || a.hours - b.hours);
}

export const tasksToText = (tasks) =>
  tasks.map((t, n) => `${n + 1}. ${t.name} | urgency ${t.urgency}/5 | importance ${t.importance}/5 | ${t.hours}h | quadrant: ${t.quadrant} | score ${t.score}`).join("\n");
