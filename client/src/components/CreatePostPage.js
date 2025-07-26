import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "../utils/mutations";
import auth from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [error, setError] = useState(false);
  const [addPost, { loading }] = useMutation(ADD_POST, {
    onCompleted: () => navigate("/", { replace: true }),
    onError: () => setError(true),
  });

const handleSubmit = async (e) => {
    e.preventDefault();

    // getProfile() returns { data: { username, email, _id }, iat, exp }
    const profile = auth.getProfile();
    const author = profile?.data?.username;

    if (!author) {
      console.error("No author found in token:", profile);
      setError(true);
      return;
    }

    try {
      await addPost({ variables: { content } });
    } catch (err) {
      console.error("GraphQL error on addPost:", err);
      setError(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Gradient background and centered column */}
      <div
        className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-zomp-600 to-persian_green-500 px-6 py-4">
        {/* Site Title */}
        <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg">
          Smol Gaming Haven
        </h1>

        {/* Glass-morphic Card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
            New Post
          </h2>

          {error && (
            <p className="text-center text-rose_quartz-200 mb-4">
              Failed to create post. Please try again.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="content"
                className="block text-white mb-1 font-medium"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="What's on your mind?"
                className="w-full h-32 px-4 py-3 bg-white/20 text-lg text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zomp-300"/>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-zomp-500 hover:bg-zomp-600 text-white font-semibold rounded-lg transition-transform hover:scale-105"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}