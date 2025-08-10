import { useState } from "react";
import CollapsibleText from "./CollapsibleText";
import PostImages from "./PostImages";
import Avatar from "./Avatar";

export default function Post({ post, onRequestReport }) {
  const [showImages, setShowImages] = useState(false);
  const author = post.author || {};
  const created = post.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "";
  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl text-white relative">
      {/* Header with avatar*/}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Avatar src={author.profileImg} name={author.username} size={40} />
            <div
              style={{ width: 40, height: 40, display: "none" }}
              className="rounded-full bg-white/20 items-center justify-center text-white font-semibold"
            >
              {(author.username || "?").slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-semibold">{author.username}</span>
            <span className="text-xs opacity-80">{created}</span>
          </div>
        </div>

        <button
          className="text-sm text-gray-300 hover:text-red-400 transition-colors"
          onClick={() => onRequestReport(post)}
          aria-label="Report post"
          title="Report post"
        >
          Report
        </button>
      </div>

      <CollapsibleText text={post.content} wordLimit={200} />

      {Array.isArray(post.images) && post.images.length > 0 && (
        <>
          <button
            onClick={() => setShowImages((prev) => !prev)}
            className="mt-3 mb-3 px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition"
          >
            {showImages ? "Hide Images" : "Show Images"}
          </button>
          {showImages && <PostImages imageIds={post.images} />}
        </>
      )}
    </div>
  );
}
