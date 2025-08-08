import { useState } from "react";
import CollapsibleText from "./CollapsibleText";
import PostImages from "./PostImages";

export default function Post({ post, onRequestReport }) {
  const [showImages, setShowImages] = useState(false);

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl text-white relative">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{post.author?.username}</span>
        <span className="text-sm opacity-80">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>

      <CollapsibleText text={post.content} wordLimit={200} />

      {Array.isArray(post.images) && post.images.length > 0 && (
        <>
          <button
            onClick={() => setShowImages((prev) => !prev)}
            className="mt-2 mb-3 px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition"
          >
            {showImages ? "Hide Images" : "Show Images"}
          </button>
          {showImages && <PostImages imageIds={post.images} />}
        </>
      )}

      <div className="flex justify-end bg-red-400 mt-2">
        <button
          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          onClick={() => onRequestReport(post)}
        >
           Report
        </button>
      </div>
    </div>
  );
}