import { Link, useNavigate } from "react-router-dom";
import auth from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = auth.loggedIn();
// Handle logout
  const handleLogout = () => {
    auth.logout();
    navigate("/login", { replace: true });
  };

// Define your link sets
  const publicLinks = [
    { to: "/login", label: "Log In" },
    { to: "/signup", label: "Sign Up" },
  ];
// Define private links that should only be shown when logged in
  const privateLinks = [
    { to: "/", label: "Homepage" },
    { to: "/create", label: "New Post" },
    { to: "/account", label: "My Account" },
  ];
// Render the navbar
// Use the loggedIn state to determine which links to show
  return (
    <nav className="bg-gradient-to-r from-zomp-600 via-persian_green-500 to-kelly_green-500 text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-2xl font-extrabold hover:text-zomp-200">
          Smol Gaming Haven
        </Link>

        {/* Links */}
        <ul className="flex space-x-6 items-center">
          {(loggedIn ? privateLinks : publicLinks).map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="text-lg font-medium hover:text-kelly_green-200 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}

          {loggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="ml-4 bg-rose_quartz-500 hover:bg-rose_quartz-600 text-white font-medium py-1 px-3 rounded-lg transition-colors"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
