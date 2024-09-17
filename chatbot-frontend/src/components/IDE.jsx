import React, { useState } from "react";
import "./IDE.css"; // Style it separately

const IDE = () => {
  const [code, setCode] = useState("");
  const [testCase, setTestCase] = useState("");
  const [output, setOutput] = useState("");

  const handleCompile = () => {
    // Simulate compilation for now
    setOutput(`Compiled Output for:\n${code}\nWith Test Case:\n${testCase}`);
  };

  return (
    <div className="ide-container">
      {/* Upper section: code editor + compile button */}
      <div className="ide-editor-section">
        <textarea
          className="code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
        ></textarea>
        <button className="compile-button" onClick={handleCompile}>
          Compile Code
        </button>
      </div>

      {/* Lower section: test case input + output area */}
      <div className="ide-output-section">
        <textarea
          className="testcase-editor"
          value={testCase}
          onChange={(e) => setTestCase(e.target.value)}
          placeholder="Enter test case values here..."
        ></textarea>
        <div className="output-area">
          <pre>{output}</pre> {/* Display the compiled output */}
        </div>
      </div>
    </div>
  );
};

export default IDE;
