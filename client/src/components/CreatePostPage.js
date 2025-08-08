import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "../utils/mutations";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const navigate = useNavigate();
  // Post fields
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imageInput, setImageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const [addPost, { loading }] = useMutation(ADD_POST, {
    onCompleted: () => navigate("/", { replace: true }),
    onError: () => setError(true),
  });

  const isValidHttpUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleImageUpload = async () => {
    if (!isValidHttpUrl(imageInput)) {
      setError(true);
      console.error("Invalid URL format");
      return;
    }

    setUploading(true);
    setError(false);

    try {
      const res = await fetch("http://localhost:8003/api/v1/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageInput }),
      });

      const json = await res.json();

      if (!res.ok || !json.id) {
        throw new Error("Image upload failed");
      }

      setImages((imgs) => [...imgs, json.url]);
      setImageInput("");
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(true);
    } finally {
      setUploading(false);
    }
  };
  // final form submit: send contentimages to GraphQL
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPost({ variables: { content, images } });
    } catch {
      setError(true);
    }
  };
  const handleKeyDown = (e) => {
    // if user presses Enter the post will be submitted
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-zomp-600 to-persian_green-500 px-6 py-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white text-center">
            New Post
          </h2>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            className="w-full h-32 px-4 py-3 bg-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zomp-300"
          />

          {/* Error message */}
          {error && (
            <p className="text-center text-rose_quartz-200">
              Something went wrong. Please try again.
            </p>
          )}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Image URL"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="flex-grow px-3 py-2 bg-white/20 text-white rounded"
            />
            <button
              onClick={handleImageUpload}
              disabled={uploading}
              className="px-3 py-2 bg-kelly_green-500 hover:bg-kelly_green-600 text-white rounded"
            >
              {uploading ? "Uploading…" : "Add"}
            </button>
          </div>

          {/* Preview uploaded images */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {images.map((id) => (
              <div key={id} className="relative">
                <img
                  src={`${id}`}
                  alt="Preview"
                  className="rounded-lg max-h-32 object-cover w-full"
                />
                <button
                  onClick={() =>
                    setImages((prev) => prev.filter((imgId) => imgId !== id))
                  }
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded px-2 py-1"
                >
                  delete
                </button>
              </div>
            ))}
          </div>
          {/* Submit Post */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-zomp-500 hover:bg-zomp-600 text-white font-semibold rounded-lg hover:scale-105"
          >
            {loading ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
