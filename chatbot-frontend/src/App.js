import React, { useState } from "react";
import "./App.css";
import Chatbox from "./components/Chatbot";
import IDE from "./components/IDE";

const App = () => {
  const [code, setCode] = useState("");

  const handleCopyToIDE = (text) => {
    // console.log("Copying to IDE:", text); // Log the copied text to verify
    setCode((prevCode) => `${prevCode}\n${text}`); // Append the copied code to the existing one
  };

  return (
    <div className="app-container">
      <div className="chatbox-section">
        <Chatbox onCopyToIDE={handleCopyToIDE} />
      </div>
      <div className="ide-section">
        <IDE code={code} setCode={setCode} />
      </div>
    </div>
  );
};

export default App;
