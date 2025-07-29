import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { UPDATE_POST, DELETE_POST, UPDATE_USER } from "../utils/mutations";
import Footer from "./Footer";

export default function AccountPage() {
  // Fetch me
  const { loading, error, data, refetch } = useQuery(GET_ME);
  // Update user (for avatar)
  const [updateUser] = useMutation(UPDATE_USER);
  // Local state for avatar URL form
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Posts state as before…
  const [showPosts, setShowPosts] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [updatePost] = useMutation(UPDATE_POST);
  const [deletePost] = useMutation(DELETE_POST);

  if (loading) return <p className="text-center text-white">Loading…</p>;
  if (error) return <p className="text-center text-red-500">Error!</p>;

  const user = data.me;

  // Handler: submit avatar URL to the microservice
  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    setAvatarError("");
    setAvatarLoading(true);

    try {
      const res = await fetch("http://localhost:3002/api/profile-pics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("id_token")}`,
        },
        body: JSON.stringify({ userId: user._id, imageUrl: newAvatarUrl }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Upload failed");
      }

      // Save the returned URL into our User
      await updateUser({
        variables: { profileImg: json.url },
      });
      // Refresh local user data
      await refetch();
      setNewAvatarUrl("");
    } catch (err) {
      console.error(err);
      setAvatarError("Could not upload avatar. Try a different URL.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setEditContent(post.content);
  };
  const handleSave = async (postId) => {
    await updatePost({ variables: { postId, content: editContent } });
    setEditingId(null);
    refetch();
  };
  const handleDelete = async (postId) => {
    await deletePost({ variables: { postId } });
    refetch();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Profile & Avatar Section */}
      <div
        className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-zomp-600 to-persian_green-500 px-6 py-8">
        <div
          className="w-full max-w-md bg-white/10 backdrop-blur-md
                        rounded-2xl p-8 shadow-xl text-white space-y-4"
        >
          <h2 className="text-3xl font-extrabold text-center">My Account</h2>

          {/* Current Avatar */}
          <div className="flex flex-col items-center">
            {user.profileImg ? (
              <img
                src={user.profileImg}
                alt="avatar"
                className="w-24 h-24 rounded-full mb-3"
              />
            ) : (
              <div className="w-24 h-24 bg-white/20 rounded-full mb-3 flex items-center justify-center">
                <span className="text-white opacity-70">No Avatar</span>
              </div>
            )}
          </div>

          {/* Avatar URL Form */}
          <form onSubmit={handleAvatarSubmit} className="space-y-2">
            <label htmlFor="avatarUrl" className="block text-white font-medium">
              New Avatar URL
            </label>
            <input
              id="avatarUrl"
              type="url"
              placeholder="https://example.com/me.png"
              value={newAvatarUrl}
              onChange={(e) => setNewAvatarUrl(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zomp-300"/>
            {avatarError && (
              <p className="text-rose_quartz-200 text-sm">{avatarError}</p>
            )}
            <button
              type="submit"
              disabled={avatarLoading}
              className="w-full py-2 bg-persian_green-500 hover:bg-persian_green-600 text-white font-semibold rounded-lg transition-colors">
              {avatarLoading ? "Uploading…" : "Update Avatar"}
            </button>
          </form>

          {/* User Info Section */}
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {/* Toggle Posts Section */}
          <button
            onClick={() => setShowPosts((s) => !s)}
            className="mt-4 w-full py-2 bg-zomp-500 hover:bg-zomp-600 text-white font-semibold rounded-lg transition-transform hover:scale-105">
            {showPosts ? "Hide My Posts" : "View My Posts"}
          </button>
        </div>

        {/* Posts List (unchanged) */}
        {showPosts && (
          <div className="w-full max-w-lg mt-8 space-y-6">
            {user.posts.length === 0 ? (
              <p className="text-white text-center">No posts yet.</p>
            ) : (
              user.posts.map((post) => (
                <div key={post._id} className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-xl text-white">
                  {editingId === post._id ? (
                    <>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-24 bg-white/20 text-white p-2 rounded"/>
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          onClick={() => handleSave(post._id)}
                          className="px-4 py-1 bg-kelly_green-500 hover:bg-kelly_green-600 rounded">
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-1 bg-rose_quartz-500 hover:bg-rose_quartz-600 rounded">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mb-2">{post.content}</p>
                      <p className="text-sm opacity-80 mb-4">
                        {post.createdAt}
                      </p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="px-3 py-1 bg-kelly_green-500 hover:bg-kelly_green-600 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="px-3 py-1 bg-rose_quartz-500 hover:bg-rose_quartz-600 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
