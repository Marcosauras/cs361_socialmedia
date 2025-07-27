import { useState } from "react";
// This component displays text that can be collapsed or expanded stopping the user from having to read long text all at once.
export default function CollapsibleText({ text, charLimit = 200 }) {
  const isLong = text.length > charLimit;
  const [expanded, setExpanded] = useState(false);

  const display = !isLong || expanded
    ? text
    : text.slice(0, charLimit) + "…";

  return (
    <div className="relative">
      <p className="whitespace-pre-wrap">{display}</p>

      {isLong && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="absolute bottom-0 right-0 bg-white/20 hover:bg-white/30 text-persian_green-200 px-2 py-1 rounded mt-2 text-sm"
        >
          Show more
        </button>
      )}

      {isLong && expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="absolute bottom-0 right-0 bg-white/20 hover:bg-white/30 text-rose_quartz-200 px-2 py-1 rounded mt-2 text-sm"
        >
          Show less
        </button>
      )}
    </div>
  );
}