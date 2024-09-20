import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner
import "./IDE.css"; // Style it separately
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css"; // Dark theme
import "codemirror/mode/python/python"; // Python mode

const IDE = ({ code, setCode }) => {
  const [testCase, setTestCase] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const [buttonText, setButtonText] = useState("Compile"); // State for button text

  const handleCompile = async () => {
    setLoading(true); // Set loading to true
    setButtonText("Compiling..."); // Change button text to Compiling
    try {
      const response = await fetch("http://localhost:5000/compile-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source_code: code, input_data: testCase }),
      });

      if (response.ok) {
        const data = await response.json();
        setOutput(data.compiled_output);
      } else {
        setOutput("Error compiling code");
      }
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error while compiling");
    } finally {
      setLoading(false); // Set loading to false after response
      setButtonText("Compile"); // Reset button text back to Compile
    }
  };

  return (
    <div className="ide-container">
      <div className="ide-editor-section">
        <textarea
          className="code-editor"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
          placeholder="Write your code here..."
        ></textarea>
        <button className="compile-button" onClick={handleCompile}>
          {buttonText} {/* Dynamic button text */}
        </button>
      </div>

      <div className="ide-output-section">
        <textarea
          className="testcase-editor"
          value={testCase}
          onChange={(e) => setTestCase(e.target.value)}
          placeholder="Enter input values here..."
        ></textarea>
        <div className="output-area">
          {loading ? (
            <div className="spinner-container">
              <ClipLoader loading={loading} size={50} />{" "}
              {/* Spinner component */}
            </div>
          ) : (
            <pre>{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDE;
