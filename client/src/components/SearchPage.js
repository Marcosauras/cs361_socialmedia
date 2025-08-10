import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "./SearchBar";

const SEARCH_BASE = process.env.REACT_APP_SEARCH_SERVICE || "http://localhost:4005";

export default function SearchPage({ currentUserId }) {
  const [params, setParams] = useSearchParams();

  // query params: ?q=foo&type=posts|users
  const q = params.get("q") || "";
  const type = (params.get("type") || "posts").toLowerCase();
  const by = (params.get("by") || "content").toLowerCase();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [postResults, setPostResults] = useState([]);
  const [userResults, setUserResults] = useState([]);

  const headers = useMemo(() => ({ "x-user-id": currentUserId || "anon" }), [currentUserId]);

  const runSearch = useCallback(async (query, searchType, byMode = "content") => {
  const value = (query || "").trim();
  if (!value) { setPostResults([]); setUserResults([]); return; }

  setLoading(true);
  setErr(null);
  try {
    if (searchType === "users") {
      const url = new URL(`${SEARCH_BASE}/search/users`);
      url.searchParams.set("q", value);
      url.searchParams.set("limit", "50");
      const res = await fetch(url, { headers, credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUserResults(data.results || []);
      setPostResults([]);
    } else {
      // POSTS
      if (byMode === "author") {
        // <-- use the dedicated endpoint
        const res = await fetch(`${SEARCH_BASE}/search/users/${encodeURIComponent(value)}/posts?limit=50`, {
          headers, credentials: "include"
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPostResults(data.results || []);
        setUserResults([]);
      } else {
        // default: search in content
        const url = new URL(`${SEARCH_BASE}/search/posts`);
        url.searchParams.set("q", value);
        url.searchParams.set("limit", "50");
        const res = await fetch(url, { headers, credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPostResults(data.results || []);
        setUserResults([]);
      }
    }
  } catch (e) {
    setErr(e.message);
    setPostResults([]); setUserResults([]);
  } finally {
    setLoading(false);
  }
}, [headers]);

  useEffect(() => { if (q) runSearch(q, type, by); }, [q, type, by, runSearch]);

  const handleSearchOnPage = (query) => {
    setParams({ q: query, type });
  };

  // toggle between posts and users
  const setType = (next) => {
    setParams({ q, type: next });
  };

const showUserPosts = (username) => {
  setParams({ q: username, type: "posts", by: "author" }); // NEW
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <SearchBar
          onSearch={handleSearchOnPage}
          defaultValue={q}
          autoFocus
          placeholder={type === "users" ? "Search users..." : "Search posts..."}
        />

        {/* Mode toggle */}
        <div className="flex gap-2 text-white">
          <button
            onClick={() => setType("posts")}
            className={`px-3 py-1 rounded ${type === "posts" ? "bg-white/30" : "bg-white/10 hover:bg-white/20"}`}
          >
            Posts
          </button>
          <button
            onClick={() => setType("users")}
            className={`px-3 py-1 rounded ${type === "users" ? "bg-white/30" : "bg-white/10 hover:bg-white/20"}`}
          >
            Users
          </button>
        </div>

        {loading && <div className="text-white">Searching…</div>}
        {err && <div className="text-red-300">Error: {err}</div>}

        {!loading && !err && q && type === "posts" && postResults.length === 0 && (
          <div className="text-white">No posts found for “{q}”.</div>
        )}
        {!loading && !err && q && type === "users" && userResults.length === 0 && (
          <div className="text-white">No users found for “{q}”.</div>
        )}

        {/* Results */}
        {type === "posts" ? (
          <ul className="space-y-3">
            {postResults.map((p) => (
              <li key={p.id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-white">
                <div className="flex justify-between">
                  <strong>{p.author?.username || "Unknown"}</strong>
                  <span className="text-sm opacity-80">{new Date(p.createdAt).toLocaleString()}</span>
                </div>
                <div>{p.content}</div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3">
            {userResults.map((u) => (
              <li key={u.id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-white flex items-center gap-3">
                <img
                  src={u.img || "/placeholder-avatar.png"}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold">{u.username}</div>
                </div>
                <button
                  onClick={() => showUserPosts(u.username)}
                  className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30"
                >
                  View Posts
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}