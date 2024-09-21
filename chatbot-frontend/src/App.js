import React, { useState } from "react";
import "./App.css";
import Chatbox from "./components/Chatbot";
import IDE from "./components/IDE";

const App = () => {
  const [code, setCode] = useState(""); // State to hold the code for IDE
  const [modalVisible, setModalVisible] = useState(true);

  const handleStay = () => {
    setModalVisible(false); // Hide the modal and remove blur effect
    document.body.classList.remove("modal-active");
  };

  const handleNavigate = () => {
    window.location.href = "https://example.com"; // Replace with your desired link
  };

  // Function to update the IDE's code editor
  const handleCopyToIDE = (text) => {
    setCode((prevCode) => `${prevCode}\n${text}`); // Append the copied text to the existing code
  };

  return (
    <div className="App">
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Choose an Option</h2>
            <button className="stay-button" onClick={handleStay}>
              Stay on the Website
            </button>
            <button className="navigate-button" onClick={handleNavigate}>
              Navigate to Another Link
            </button>
          </div>
        </div>
      )}

      <div className="page-title">
        <img className="banner" src="banner.png"></img>
      </div>

      <div className="app-container">
        <div className="chatbox-section">
          <Chatbox onCopyToIDE={handleCopyToIDE} />
        </div>
        <div className="ide-section">
          <IDE code={code} setCode={setCode} />
        </div>
      </div>

      {/* Floating buttons */}
      <a
        id="button1"
        className="floating-button"
        href="https://discord.com/oauth2/authorize?client_id=1262688746630021142"
        target="_blank"
      >
        <img src="discord.png" alt="Button 1" />
      </a>
      <a
        id="button2"
        className="floating-button"
        href="https://github.com/ayushmaanFCB/Conversational-AI-for-Code-Assistance"
        target="_blank"
      >
        <img src="github.png" alt="Button 2" />
      </a>
    </div>
  );
};

export default App;
