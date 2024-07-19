import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import FormTour from "./pages/FormTour";
import AdminDashboard from "./pages/Admin";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Tours from "./pages/Tours";
import ToursPage from "./pages/toursPage";
import BookingForm from "./pages/BookingForm/BookingForm";
import AdminChatDashboard from "./pages/Chat/AdminChatDashboard";
import UserChat from "./pages/Chat/Chat";
import ChatButton from "./components/ChatButton";

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className={`navbar ${
        isHomePage
          ? isMobile
            ? "mobile-homenav-bg"
            : "transparent-navbar"
          : "not-transparent-navbar"
      }`}
    >
      <Helmet>
        <title>Scouts OTG - Your Adventure Starts Here</title>
        <meta
          name="description"
          content="Discover amazing travel tours with Scouts OTG. Explore our latest tours, read articles, and book your next adventure. Join us for an unforgettable experience!"
        />
        <meta
          name="keywords"
          content="Scouts OTG, travel tours, adventure, vacation, booking, tourism, travel agency"
        />
      </Helmet>
      <div
        className={`navbar ${isHomePage && !isMobile ? "navbar-container-home" : "navbar-container"}`}
      >
        <div
          className={`navbar-brand ${isHomePage && !isMobile ? "navbar-nologo" : ""}`}
        >
          <NavLink
            exact
            to="/"
            className="navbar-logo"
          >
            Scouts OTG
          </NavLink>
        </div>
        <button
          className={`navbar-toggle ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          <span className="navbar-icon">&#9776;</span>
          <span className="navbar-text">{isOpen ? "Close" : "Menu"}</span>
        </button>
        <ul className={`nav nav-pills ${isOpen ? "open" : ""}`}>
          <li
            className={`nav-item ${isHomePage && !isMobile ? "nav li-home" : ""}`}
          >
            <NavLink
              exact
              to="/"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li
            className={`nav-item ${isHomePage && !isMobile ? "nav li-home" : ""}`}
          >
            <NavLink
              to="/tours"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Tours
            </NavLink>
          </li>
          <li
            className={`nav-item ${isHomePage && !isMobile ? "nav li-home" : ""}`}
          >
            <NavLink
              to="/about"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>
          </li>
          <li
            className={`nav-item ${isHomePage && !isMobile ? "nav li-home" : ""}`}
          >
            <NavLink
              to="/contact"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </NavLink>
          </li>
          {currentUser && (
            <>
              {isAdmin && (
                <li
                  className={`nav-item ${isHomePage && !isMobile ? "nav li-home" : ""}`}
                >
                  <NavLink
                    to="/admin"
                    className="nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </NavLink>
                </li>
              )}
              <li
                className={`nav-item ${isHomePage && !isMobile ? "nav li-home" : ""}`}
              >
                <button
                  className="nav-link"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
          {!currentUser && (
            <li
              className={`nav-item ${isHomePage && !isMobile ? "nav li-home" : ""}`}
            >
              <NavLink
                to="/login"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

const PrivateRoute = ({ children, isAdminOnly }) => {
  const { currentUser, isAdmin } = useAuth();

  if (isAdminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/contact"
            element={<Contact />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route
            path="/tours"
            element={<Tours />}
          />
          <Route
            path="/toursPage/:id"
            element={<ToursPage />}
          />
          <Route
            path="/create-tour"
            element={<FormTour />}
          />
          <Route
            path="/booking-form/:id"
            element={<BookingForm />}
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute isAdminOnly={true}>
                <AdminDashboard />
                <AdminChatDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <UserChat />
      </AuthProvider>
    </Router>
  );
};

export default App;
