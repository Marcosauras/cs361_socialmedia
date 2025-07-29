import { Navigate } from "react-router-dom";
import auth from "../utils/auth";

export default function ProtectedRoute({ children }) {
  return auth.loggedIn() ? children : <Navigate to="/login" replace />;
}
