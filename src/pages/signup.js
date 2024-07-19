import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "./signup.css";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <Helmet>
        <title>Sign Up - Scouts OTG</title>
        <meta
          name="description"
          content="Create a new account at Scouts OTG. Sign up with your email and password to start exploring our travel packages and services."
        />
        <meta
          name="keywords"
          content="Sign Up, Scouts OTG, create account, user registration, travel services"
        />
      </Helmet>
      <h2>Sign Up for Scouts OTG</h2>
      {error && <p className="error-message">{error}</p>}
      <form
        onSubmit={handleSignup}
        aria-labelledby="signup-form"
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
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="signin-link"
        >
          Log In
        </NavLink>
      </p>
    </div>
  );
};

export default Signup;
