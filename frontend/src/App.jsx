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

        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="divider-sm"></div>
              <ul class="nav nav-tabs" id="iconNav" role="tablist">
                <li class="nav-item" data-platform="windows" role="tab">
                    <a class="nav-link" id="windows-nav-link" href="/en/downloads/windows" role="tab" data-platform="windows">
                      <img src="/_static/img/icons/windows-logo.svg" id="windows-nav-icon" alt="" title="Windows"/>
                      <p>Windows</p>
                    </a>
                </li>
                <li class="nav-item" data-platform="mac" role="tab">
                    <a class="nav-link" id="mac-nav-link" href="/en/downloads/mac-os" role="tab" data-platform="mac">
                      <img src="/_static/img/icons/mac-logo.svg" id="mac-nav-icon" alt="" title="macOS"/>
                      <p>macOS</p>
                    </a>
                </li>
                <li class="nav-item" data-platform="android" role="tab">
                    <a class="nav-link" id="android-nav-link" href="/en/downloads/android" role="tab" data-platform="android">
                      <img src="/src/assets/android-logo-red-orange.svg" id="android-nav-icon" alt="" title="Android"/>
                      <p>Android</p>
                    </a>
                 </li>
                <li class="nav-item" data-platform="ios" role="tab">
                    <a class="nav-link" id="ios-nav-link" href="/en/downloads/ios" role="tab" data-platform="ios">
                      <img src="/_static/img/icons/ios-logo.svg" id="ios-nav-icon" alt="" title="iOS"/>
                      <p>iOS</p>
                    </a>
                </li>
                <li class="nav-item" data-platform="appletv" role="tab">
                    <a class="nav-link" id="appletv-nav-link" href="/en/downloads/apple-tv" role="tab" data-platform="appletv">
                      <img src="/_static/img/icons/appletv-logo.svg" id="appletv-nav-icon" alt="" title="Apple TV"/>
                      <p>Apple TV</p>
                    </a>
                  </li>
                <li class="nav-item" data-platform="linux" role="tab">
                    <a class="nav-link" id="linux-nav-link" href="/en/downloads/linux" role="tab" data-platform="linux">
                      <img src="/_static/img/icons/linux-logo.svg" id="linux-nav-icon" alt="" title="Linux"/>
                      <p>Linux</p>
                    </a>
                  </li>
                <li class="nav-item" data-platform="chrome" role="tab">
                    <a class="nav-link" id="chrome-nav-link" href="/en/downloads/chrome-os" role="tab" data-platform="chrome">
                      <img src="/_static/img/icons/chrome-logo.svg" id="chrome-nav-icon" alt="" title="Chrome OS"/>
                      <p>Chrome OS</p>
                    </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;
