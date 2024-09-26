import React, { useState } from "react";
import "./App.css";
import Chatbox from "./components/Chatbot";
import IDE from "./components/IDE";

const App = () => {
  const [code, setCode] = useState("");
  const [modalVisible, setModalVisible] = useState(true);

  const handleStay = () => {
    const modalElement = document.querySelector(".modal");
    modalElement.classList.add("modal-fade-out");
    setTimeout(() => {
      setModalVisible(false);
      document.body.classList.remove("modal-active");
    }, 1000); // Match the timeout duration with the animation duration (0.5s)
  };

  const handleNavigate = () => {
    window.location.href =
      "https://discord.com/oauth2/authorize?client_id=1262688746630021142"; // Replace with your desired link
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
            <h1>Welcome to EchoCode</h1>
            <div className="image-text-group">
              <img
                src="favicon.png" /* Replace with the path to your image */
                alt="Stay on the Website"
                className="image-button"
                onClick={handleStay}
              />
              <p className="image-description">Explore our Studio</p>
            </div>
            <div className="image-text-group">
              <img
                src="discord.png" /* Replace with the path to your image */
                alt="Navigate to Another Link"
                className="image-button"
                onClick={handleNavigate}
              />
              <p className="image-description">Try our Discord Bot</p>
            </div>
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
