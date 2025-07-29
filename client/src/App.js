import "./App.css";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Homepage from "./components/Homepage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AccountPage from "./components/AccountPage";
import Navbar from "./components/Navbar";
import CreatePostPage from "./components/CreatePostPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HelpPage from "./components/HelpPage";

const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

// Attach JWT token to every request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
              <Navbar />
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
              <Navbar />
                <AccountPage />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/help"
            element={
              <ProtectedRoute>
              <Navbar />
                <HelpPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect anything else to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
