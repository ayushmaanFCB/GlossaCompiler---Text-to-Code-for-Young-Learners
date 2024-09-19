import React, { useState } from "react";
import "./IDE.css"; // Style it separately

const IDE = ({ code, setCode }) => {
  // const [code, setCode] = useState("");
  const [testCase, setTestCase] = useState("");
  const [output, setOutput] = useState("");
  // console.log("IDE code state:", code);

  const handleCompile = async () => {
    try {
      // Make a POST request to /compile-code
      const response = await fetch("http://localhost:5000/compile-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source_code: code, input_data: testCase }), // Send code and testCase
      });

      // Handle the response
      if (response.ok) {
        const data = await response.json();
        setOutput(data.compiled_output); // Update output with the response
      } else {
        setOutput("Error compiling code");
      }
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error while compiling");
    }
  };

  return (
    <div className="ide-container">
      {/* Upper section: code editor + compile button */}
      <div className="ide-editor-section">
        <textarea
          className="code-editor"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            console.log("Code in IDE:", e.target.value);
          }}
          placeholder="Write your code here..."
        ></textarea>
        <button className="compile-button" onClick={handleCompile}>
          Compile
        </button>
      </div>

      {/* Lower section: test case input + output area */}
      <div className="ide-output-section">
        <textarea
          className="testcase-editor"
          value={testCase}
          onChange={(e) => setTestCase(e.target.value)}
          placeholder="Enter input values here..."
        ></textarea>
        <div className="output-area">
          <pre>{output}</pre> {/* Display the compiled output */}
        </div>
      </div>
    </div>
  );
};

export default IDE;
