import { Link } from "react-router-dom";

export default function SearchResults({ results, loading, error }) {
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!results.length) return <div>No results</div>;

  return (
    <ul className="search-results">
      {results.map((post) => (
        <li key={post.id} className="border-b py-2">
          <div className="font-bold">{post.author?.username || "Unknown"}</div>
          <div>{post.content}</div>
          <Link
            to={`/p/${post.id}`}
            className="inline-block mt-2 text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30"
          >
            View Post
          </Link>
        </li>
      ))}
    </ul>
  );
}
