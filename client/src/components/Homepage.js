import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../utils/queries";
import CollapsibleText from "./CollapsibleText";

export default function Homepage() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [hasMore, setHasMore]       = useState(false);

  const observer   = useRef(null);
  const sortedRef  = useRef([]);
  const BATCH_SIZE = 5;

  // 1️⃣ Sort once when data arrives
  useEffect(() => {
    if (data?.posts) {
      sortedRef.current = [...data.posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDisplayPosts(sortedRef.current.slice(0, BATCH_SIZE));
      setHasMore(sortedRef.current.length > BATCH_SIZE);
    }
  }, [data]);

  // 2️⃣ Clean up observer on unmount
  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  // 3️⃣ Load next batch
  const loadMorePosts = useCallback(() => {
    const start = displayPosts.length;
    const next  = sortedRef.current.slice(start, start + BATCH_SIZE);
    setDisplayPosts((prev) => [...prev, ...next]);
    if (start + next.length >= sortedRef.current.length) {
      setHasMore(false);
    }
  }, [displayPosts.length]);

  // 4️⃣ Observe the last post for infinite scroll
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      observer.current?.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMorePosts]
  );

  // 5️⃣ Loading / error / empty states
  if (loading)
    return <p className="text-center text-white mt-12">Loading posts…</p>;
  if (error)
    return <p className="text-center text-red-500 mt-12">Error loading posts.</p>;

  if (!sortedRef.current.length)
    return (
      <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
        <p className="text-center text-white text-xl mt-12">No posts yet.</p>
      </div>
    );

  // 6️⃣ Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold text-white text-center">
          Feed
        </h1>

        {displayPosts.map((post, idx) => {
          const isLast = idx === displayPosts.length - 1;
          return (
            <div
              ref={isLast ? lastPostRef : null}
              key={post._id}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl text-white relative"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{post.author.username}</span>
                <span className="text-sm opacity-80">{post.createdAt}</span>
              </div>
              <CollapsibleText text={post.content} wordLimit={200} />
              {post.images?.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {post.images.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="attachment"
                      className="object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {hasMore && (
          <p className="text-center text-white mt-4">Loading more…</p>
        )}
      </div>
    </div>
  );
}