import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_POSTS, GET_ME } from "../utils/queries";
import CollapsibleText from "./CollapsibleText";
import PostImages from "./PostImages";

export default function Homepage() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const { data: userData } = useQuery(GET_ME); // ✅ Pulls logged-in user info
  const username = userData?.me?.username;      // ✅ Extracts reporter username

  const [displayPosts, setDisplayPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [visibleImages, setVisibleImages] = useState({});
  const [reportingPost, setReportingPost] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const observer = useRef(null);
  const sortedRef = useRef([]);
  const BATCH_SIZE = 20;

  useEffect(() => {
    if (data?.posts) {
      const posts = [...data.posts].reverse();
      sortedRef.current = posts;
      setDisplayPosts(posts.slice(0, BATCH_SIZE));
      setHasMore(posts.length > BATCH_SIZE);
    }
  }, [data]);

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  const loadMorePosts = useCallback(() => {
    const start = displayPosts.length;
    const next = sortedRef.current.slice(start, start + BATCH_SIZE);
    setDisplayPosts((prev) => [...prev, ...next]);
    if (start + next.length >= sortedRef.current.length) {
      setHasMore(false);
    }
  }, [displayPosts.length]);

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

  const handleReport = async (post, reason, reporterUsername) => {
    const payload = {
      postId: post._id,
      reason,
      reporter: reporterUsername,
      postContent: {
        author: post.author?.username,
        content: post.content,
        createdAt: post.createdAt,
        images: post.images || [],
      },
    };

    console.log("Reporting payload:", payload);

    try {
      const response = await fetch("http://localhost:3002/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Report submitted. Thank you!");
      } else {
        alert(`Failed to report: ${result.error}`);
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Something went wrong.");
    }
  };

  if (loading)
    return <p className="text-center text-white mt-12">Loading posts…</p>;

  if (error)
    return (
      <div className="p-6">
        <h2 className="text-red-500">Error loading posts</h2>
        <pre className="text-xs text-gray-300">
          {JSON.stringify(
            {
              message: error.message,
              graphQLErrors: error.graphQLErrors,
              networkError: error.networkError?.message,
            },
            null,
            2
          )}
        </pre>
      </div>
    );

  if (!sortedRef.current.length)
    return (
      <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
        <p className="text-center text-white text-xl mt-12">No posts yet.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {reportingPost && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl text-black relative z-[10000]">
              <h2 className="text-xl font-bold mb-2">Report Post</h2>
              <p className="text-sm text-gray-600 mb-4">
                Why are you reporting this post by{" "}
                <strong>{reportingPost.author?.username}</strong>?
              </p>
              <textarea
                className="w-full border border-gray-300 rounded p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                rows={4}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Enter reason here..."
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setReportingPost(null);
                    setReportReason("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={async () => {
                    await handleReport(reportingPost, reportReason, username); // ✅ working now
                    setReportingPost(null);
                    setReportReason("");
                  }}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-white text-center">Feed</h1>

        {displayPosts.map((post, idx) => {
          const isLast = idx === displayPosts.length - 1;
          const showImages = visibleImages[post._id] || false;
          const hasImages =
            Array.isArray(post.images) && post.images.length > 0;

          const toggleImages = () =>
            setVisibleImages((prev) => ({
              ...prev,
              [post._id]: !prev[post._id],
            }));

          return (
            <div
              ref={isLast ? lastPostRef : null}
              key={post._id}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl text-white relative"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{post.author.username}</span>
                <span className="text-sm opacity-80">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>

              <CollapsibleText text={post.content} wordLimit={200} />

              <div className="flex justify-end mt-2">
                <button
                  className="text-sm text-gray-400 bg-red-200 p-2 rounded-lg hover:text-red-500 transition-colors"
                  onClick={() => setReportingPost(post)}
                >
                  Report
                </button>
              </div>

              {hasImages && (
                <button
                  onClick={toggleImages}
                  className="mt-2 mb-3 px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition"
                >
                  {showImages ? "Hide Images" : "Show Images"}
                </button>
              )}

              {showImages && <PostImages imageIds={post.images} />}
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
