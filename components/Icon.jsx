const PATHS = {
  chat: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  notes: "M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6",
  calendar: "M5 5h14v15H5zM5 10h14M9 3v4M15 3v4",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3ZM9 12l2 2 4-4",
  warn: "M12 4l9 16H3L12 4ZM12 10v4M12 17h.01",
  send: "M4 12l16-8-6 16-3-7-7-1Z",
  check: "M5 12l5 5 9-10",
  copy: "M9 9h10v11H9zM5 15V4h10",
  bolt: "M13 3L5 13h6l-1 8 8-10h-6l1-8Z",
};

export default function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}