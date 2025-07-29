import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: formState });
      Auth.login(data.login.token);
      navigate("/", { replace: true });
    } catch {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-zomp-600 to-persian_green-500 px-6 py-4">
        <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg">
          Smol Gaming Haven
        </h1>

        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
            Log In
          </h2>
          {error && (
            <p className="text-center text-2xl font-bold text-red-600 mb-4">
              Invalid credentials. Please try again.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-white mb-1 font-medium"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-zomp-300"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-white mb-1 font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zomp-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-zomp-500 hover:bg-zomp-600 text-white font-semibold rounded-lg transition-transform hover:scale-105"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-white">
            Need an account?{" "}
            <Link
              to="/signup"
              className="text-persian_green-200 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
