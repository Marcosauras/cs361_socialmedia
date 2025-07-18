import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="p-4 bg-slate-800 text-white flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/posts">My Posts</Link>
      <Link to="/create">Create</Link>
      <span className="flex-1" />
      <Link to="/login">Login</Link>
    </nav>
  );
}