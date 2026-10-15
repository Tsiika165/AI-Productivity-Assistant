export default function Toggle({ checked, onChange, label, tag }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <span className="relative inline-flex h-5 w-9 shrink-0">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="absolute inset-0 rounded-full bg-edge transition peer-checked:bg-signal peer-focus-visible:ring-2 peer-focus-visible:ring-signal peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-fg transition peer-checked:translate-x-4 peer-checked:bg-void" />
      </span>
      <span className="text-fg">{label}</span>
      {tag && <span className="chip ml-auto bg-raised text-mute">{tag}</span>}
    </label>
  );
}