import React, { useState, useEffect } from "react";

export default function SearchBar({ onSearch, defaultValue = "", autoFocus = false, placeholder = "Search posts..." }) {
  const [q, setQ] = useState(defaultValue);

  useEffect(() => { setQ(defaultValue); }, [defaultValue]);

  const submit = () => {
    const value = (q || "").trim();
    if (!value) return;
    if (typeof onSearch === "function") onSearch(value);
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={submit}
        className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 text-white"
        aria-label="Search"
      >
        Search
      </button>
    </div>
  );
}