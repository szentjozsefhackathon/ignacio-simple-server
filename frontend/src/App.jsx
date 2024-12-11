import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoginPage from "./components/LoginPage/LoginPage";
import "./App.css";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
      <div className="content">
        {/* <h1>Welcome to the React App</h1> */}
        <div className="links">
          <ul>
            <li>
              <a href="/flutter" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://via.placeholder.com/50x50?text=Web"
                  alt="Web App"
                  className="link-icon"
                />
                Go to Web App
              </a>
            </li>
            <li>
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://via.placeholder.com/50x50?text=Android"
                  alt="Android App"
                  className="link-icon"
                />
                Download Android App
              </a>
            </li>
            <li>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://via.placeholder.com/50x50?text=iOS"
                  alt="iOS App"
                  className="link-icon"
                />
                Download iOS App
              </a>
            </li>
            <li>
              <a href="/windows-download" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://via.placeholder.com/50x50?text=Windows"
                  alt="Windows App"
                  className="link-icon"
                />
                Download Windows App
              </a>
            </li>
            <li>
              <a href="/linux-download" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://via.placeholder.com/50x50?text=Linux"
                  alt="Linux App"
                  className="link-icon"
                />
                Download Linux App
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
