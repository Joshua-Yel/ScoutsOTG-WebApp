import React, { useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  NavLink,
  Navigate,
} from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/config";
import "./login.css";
import { Helmet } from "react-helmet";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <Helmet>
        <title>Login - Scouts OTG</title>
        <meta
          name="description"
          content="Login to Scouts OTG to access your account. Sign in with your email or use Google authentication for easy access."
        />
        <meta
          name="keywords"
          content="Login, Scouts OTG, user login, Google sign-in, authentication"
        />
      </Helmet>
      <h2>Login to Your Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form
        onSubmit={handleLogin}
        aria-labelledby="login-form"
      >
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Login</button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="google-login"
        >
          Login with Google
        </button>
      </form>
      <p>
        Don’t have an account yet?{" "}
        <NavLink
          to="/signup"
          className="signup-link"
        >
          Sign Up
        </NavLink>
      </p>
    </div>
  );
};

export default Login;
