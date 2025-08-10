import React from "react";

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
        </li>
      ))}
    </ul>
  );
}