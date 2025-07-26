import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../utils/queries";
import AddPost from "./AddPost";

export default function PostList() {
  const { loading, data } = useQuery(GET_POSTS);

  if (loading) return <p>Loading posts…</p>;

  return (
    <div>
      <AddPost />
      <h2>All Posts</h2>
      {data.posts.map((p) => (
        <div key={p._id} className="post-card">
          <p><strong>{p.author}</strong> <em>{new Date(p.createdAt).toLocaleString()}</em></p>
          <p>{p.content}</p>
        </div>
      ))}
    </div>
  );
}