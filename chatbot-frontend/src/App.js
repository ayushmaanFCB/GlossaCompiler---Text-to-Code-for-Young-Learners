import React from "react";
import "./App.css";
import Chatbot from "./components/Chatbot";
import IDE from "./components/IDE";

const App = () => {
  return (
    <div className="app-container">
      <div className="chatbox-section">
        <Chatbot />
      </div>
      <div className="ide-section">
        <IDE />
      </div>
    </div>
  );
};

export default App;
