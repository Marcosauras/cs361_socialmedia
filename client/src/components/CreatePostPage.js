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

  //  call the microservice to process the pasted URL
  const handleImageUpload = async () => {
    if (!imageInput) return;
    setUploading(true);
    setError(false);

    try {
      const token = localStorage.getItem("id_token");
      const res = await fetch("http://localhost:3002/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: imageInput, type: "post" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Image upload failed");
      }

      // Append the returned CDN URL
      setImages((imgs) => [...imgs, json.url]);
      setImageInput(""); // clear input
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(true);
    } finally {
      setUploading(false);
    }
  };

  // final form submit: send content+images to GraphQL
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPost({ variables: { content, images } });
    } catch {
      setError(true);
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
            placeholder="What's on your mind?"
            className="w-full h-32 px-4 py-3 bg-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zomp-300"
          />


          {/* Error message */}
          {error && (
            <p className="text-center text-rose_quartz-200">
              Something went wrong. Please try again.
            </p>
          )}

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
