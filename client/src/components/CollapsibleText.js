import { useState } from "react";
export default function CollapsibleText({ text, charLimit = 200 }) {
  const isLong = text.length > charLimit;
  const [expanded, setExpanded] = useState(false);

  const display = !isLong || expanded ? text : text.slice(0, charLimit) + "…";

  return (
    <div className="relative">
      <p className="whitespace-pre-wrap">{display}</p>

      {isLong && !expanded && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(true)}
            className="bg-white/20 hover:bg-white/30 text-rose_quartz-200 px-2 py-1 rounded text-sm"
          >
            Show more
          </button>
        </div>
      )}

      {isLong && expanded && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(false)}
            className="bg-white/20 hover:bg-white/30 text-rose_quartz-200 px-2 py-1 rounded text-sm"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
}
