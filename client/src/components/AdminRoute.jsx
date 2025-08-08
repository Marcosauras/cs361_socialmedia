import { Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import auth from "../utils/auth";

export default function AdminRoute({ children }) {
  const loggedIn = auth.loggedIn();

  // Always call hooks — just skip if not logged in
  const { data, loading, error } = useQuery(GET_ME, {
    fetchPolicy: "cache-first",
    skip: !loggedIn,
  });

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (loading) return null;
  if (error) return <Navigate to="/login" replace />;

  const isAdmin = data?.me?.role === "admin";
  return isAdmin ? children : <Navigate to="/" replace />;
}