// this page is used to display posts the user has created
import { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
// Fetch posts created by the user
  useEffect(() => {
    api.get("/posts?author=me")
       .then((res) => setPosts(res.data))
       .catch(setError);
  }, []);

  if (error) return <p>Error: {error.message}</p>;
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.text}</li>
      ))}
    </ul>
  );
}