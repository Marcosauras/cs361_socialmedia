import "./App.css";
import {
  ApolloProvider, ApolloClient, InMemoryCache, createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Homepage from "./components/Homepage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AccountPage from "./components/AccountPage";
import CreatePostPage from "./components/CreatePostPage";
import HelpPage from "./components/HelpPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AppLayout from "./components/AppLayout";
import ReportsPage from "./components/ReportsPage";
import SearchPage from "./components/SearchPage";

const httpLink = createHttpLink({ uri: "http://localhost:3001/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return { headers: { ...headers, authorization: token ? `Bearer ${token}` : "" } };
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
          {/* Public */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          {/* Private layout w/ navbar */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Homepage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Admin-only */}
            <Route
              path="/reports"
              element={
                <AdminRoute>
                  <ReportsPage />
                </AdminRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
