import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { UPDATE_POST, DELETE_POST} from "../utils/mutations";
import Footer from "./Footer";

export default function AccountPage() {
  const { loading, error, data, refetch } = useQuery(GET_ME);

  const [showPosts, setShowPosts] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [updatePost] = useMutation(UPDATE_POST);
  const [deletePost] = useMutation(DELETE_POST);
  const [deletingId, setDeletingId] = useState(null);

  if (loading) return <p className="text-center text-white">Loading…</p>;
  if (error)
    return (
      <div className="p-6">
        <h2 className="text-red-500">Error loading account</h2>
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

  const user = data.me;

  const handleEdit = (post) => {
    setEditingId(post._id);
    setEditContent(post.content);
  };
  const handleSave = async (postId) => {
    await updatePost({ variables: { postId, content: editContent } });
    setEditingId(null);
    refetch();
  };
  const handleDelete = (postId) => {
    setDeletingId(postId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Profile & Avatar */}
      <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-zomp-600 to-persian_green-500 px-6 py-8">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl text-white space-y-4">
          <h2 className="text-3xl font-extrabold text-center">My Account</h2>

          {/* User Info */}
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {/* Toggle Posts */}
          <button
            onClick={() => setShowPosts((s) => !s)}
            className="mt-4 w-full py-2 bg-zomp-500 hover:bg-zomp-600 text-white font-semibold rounded-lg transition-transform hover:scale-105"
          >
            {showPosts ? "Hide My Posts" : "View My Posts"}
          </button>
        </div>

        {/* Posts List */}
        {showPosts && (
          <div className="w-full max-w-lg mt-8 space-y-6">
            {user.posts.length === 0 ? (
              <p className="text-white text-center">No posts yet.</p>
            ) : (
              user.posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-xl text-white"
                >
                  {editingId === post._id ? (
                    <>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-24 bg-white/20 text-white p-2 rounded"
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          onClick={() => handleSave(post._id)}
                          className="px-4 py-1 bg-kelly_green-500 hover:bg-kelly_green-600 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-1 bg-rose_quartz-500 hover:bg-rose_quartz-600 rounded"
                        >
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
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deletePost({ variables: { postId: deletingId } });
                  setDeletingId(null);
                  refetch();
                }}
                className="px-4 py-2 bg-pink-700 hover:bg-pink-300 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
