import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_POST, GET_ME } from "../utils/queries";
import auth from "../utils/auth";
import Avatar from "./Avatar";
import PostImages from "./PostImages";

const COMMENT_API = "http://localhost:4002";

export default function PostDetailPage() {
  const { postId } = useParams();

  // GraphQL: post + me
  const {
    data,
    loading: postLoading,
    error: postError,
  } = useQuery(GET_POST, {
    variables: { postId },
    fetchPolicy: "cache-and-network",
  });
  const { data: meData } = useQuery(GET_ME);
  const me = meData?.me;

  // Post record (supporting alternate field names)
  const post = data?.post ?? data?.getPost ?? data?.postById ?? null;

  // Comments state
  const [comments, setComments] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, hasMore: true });
  const [commentsError, setCommentsError] = useState(null); // "unavailable" when down
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch comments (no parentId param when null/empty)
  const loadComments = useCallback(
    async (page = 1) => {
      if (!postId) return;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        const url = new URL(`${COMMENT_API}/comments/${postId}`);
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", "25");
        // no parentId in top-level thread

        const res = await fetch(url.toString(), { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (page === 1) setComments(json.items || []);
        else setComments((prev) => [...prev, ...(json.items || [])]);

        setPageInfo({ page, hasMore: Boolean(json.hasMore) });
        setCommentsError(null);
      } catch (err) {
        console.warn("Comments service unavailable:", err);
        if (page === 1) setComments([]);
        setPageInfo({ page: 1, hasMore: false });
        setCommentsError("unavailable");
      }
    },
    [postId]
  );

  useEffect(() => {
    loadComments(1);
  }, [loadComments]);

  // Create a reply
  const submitReply = async () => {
    if (commentsError) return;
    const content = replyText.trim();
    if (!content) return;

    setSubmitting(true);
    try {
      console.log("[Comment] Sending request:", { postId, content });

      const res = await fetch(`${COMMENT_API}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({ postId, content }),
      });

      if (!res.ok) throw new Error("Failed");

      const created = await res.json();
      console.log("[Comment] Received response:", created);

      setComments((prev) => [...prev, created]);
      setReplyText("");
    } catch (e) {
      console.error("Failed to send reply:", e);
      alert("Could not send reply.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a comment
  const canDelete = (c) => {
    if (!me) return false;
    return String(c.authorId) === String(me._id) || me.role === "admin";
  };

  const deleteComment = async (id) => {
    if (!id) return;
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${COMMENT_API}/comments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.getToken()}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      // Remove locally
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.error("Failed to delete:", e);
      alert("Could not delete comment.");
    } finally {
      setDeletingId(null);
    }
  };

  // Loading / error shells styled like Homepage
  if (postLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
        <div className="max-w-3xl mx-auto text-white">Loading…</div>
      </div>
    );

  if (postError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
        <div className="max-w-3xl mx-auto text-red-200">
          Error loading post.
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
        <div className="max-w-3xl mx-auto text-white">Post not found.</div>
      </div>
    );

  const author = post.author || {};
  // Match Homepage timestamp display (trust server formatting if present)
  const createdAtDisplay = post.createdAt || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
      <div className="max-w-3xl mx-auto space-y-6 text-white">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-sm opacity-90 hover:opacity-100 hover:underline"
          >
            ← Back to Feed
          </Link>
        </div>

        {/* Post card */}
        <article className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl relative">
          <header className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar
                src={author.profileImg}
                name={author.username}
                size={48}
              />
              <div className="leading-tight">
                <div className="font-semibold">
                  {author.username || "Unknown"}
                </div>
                <div className="text-xs opacity-80">{createdAtDisplay}</div>
              </div>
            </div>
          </header>

          {post.content && (
            <p className="whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          )}

          {Array.isArray(post.images) && post.images.length > 0 && (
            <div className="mt-4">
              <PostImages imageIds={post.images} />
            </div>
          )}
        </article>

        {/* Replies */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Replies</h2>

          {commentsError && (
            <div className="text-sm text-yellow-200">
              Replies are temporarily unavailable. You can still read the post.
            </div>
          )}

          {comments.length === 0 && !commentsError && (
            <div className="opacity-90">No replies yet. Be the first!</div>
          )}

          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c._id}
                className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    src={c.authorAvatar}
                    name={c.authorUsername}
                    size={32}
                  />
                  <span className="font-medium">
                    {c.authorUsername || "Unknown"}
                  </span>
                  <time className="ml-auto text-sm opacity-70">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                  </time>

                  {canDelete(c) && (
                    <button
                      className="ml-3 text-sm px-3 py-1 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 disabled:opacity-50"
                      disabled={deletingId === c._id}
                      onClick={() => deleteComment(c._id)}
                      title="Delete comment"
                    >
                      {deletingId === c._id ? "Deleting…" : "Delete"}
                    </button>
                  )}
                </div>

                <p className="mt-2 whitespace-pre-wrap">{c.content}</p>
              </li>
            ))}
          </ul>

          {pageInfo.hasMore && !commentsError && (
            <button
              className="rounded-2xl px-4 py-2 border border-white/20 text-white bg-white/10 hover:bg-white/20 transition"
              onClick={() => loadComments(pageInfo.page + 1)}
            >
              Load more
            </button>
          )}
        </section>

        {/* Reply composer */}
        <footer className="sticky bottom-3">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="flex gap-2 items-end">
              <textarea
                placeholder={
                  commentsError
                    ? "Replies are unavailable right now"
                    : "Write a reply…"
                }
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 resize-none p-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                rows={2}
                disabled={Boolean(commentsError)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    submitReply();
                  }
                }}
              />
              <button
                disabled={
                  submitting || !replyText.trim() || Boolean(commentsError)
                }
                onClick={submitReply}
                className="rounded-2xl px-4 py-2 font-medium shadow disabled:opacity-50 border border-white/20 bg-white/10 hover:bg-white/20 transition"
                title={
                  commentsError
                    ? "Replies are unavailable right now"
                    : "Cmd/Ctrl+Enter to send"
                }
              >
                {submitting ? "Sending…" : "Reply"}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
