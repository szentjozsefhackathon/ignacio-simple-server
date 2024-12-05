import React from "react";
import Navbar from "./components/Navbar";
import CardView from "./components/CardView";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <h1>Welcome to the React App</h1>
        <CardView />
      </div>
    </div>
  );
}

export default App;

