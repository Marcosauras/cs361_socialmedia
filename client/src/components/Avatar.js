export default function Avatar({ src, name, size = 40, className = "" }) {
  const initials =
    (name || "?")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    // Fallback size if not provided
  const style = { width: size, height: size };

  return src ? (
    <img
      src={src}
      alt={`${name || "user"} avatar`}
      style={style}
      className={`rounded-full object-cover border border-white/20 ${className}`}
      onError={(e) => {
        // if the image fails, swap to initials fallback
        e.currentTarget.onerror = null;
        e.currentTarget.src = "";
        e.currentTarget.style.display = "none";
        const sib = e.currentTarget.nextElementSibling;
        if (sib) sib.style.display = "flex";
      }}
    />
  ) : (
    <div
      style={style}
      className={`rounded-full bg-white/20 flex items-center justify-center text-white font-semibold ${className}`}
      aria-label={`${name || "user"} avatar`}
    >
      {initials}
    </div>
  );
}