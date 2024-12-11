import React from "react";
import "./Navbar.css";

function Navbar() {
  const handleLogin = () => {
    window.location.href = "/login"; // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <h1>Ignáci imák</h1>
      <div className="navbar-links">
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
