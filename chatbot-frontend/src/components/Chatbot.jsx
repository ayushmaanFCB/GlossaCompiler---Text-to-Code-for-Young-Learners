import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbox.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

function Chatbox() {
  const [messages, setMessages] = useState([]); // Holds chat history
  const [userMessage, setUserMessage] = useState("");
  const chatHistoryRef = useRef(null); // Reference to the chat history container

  // Function to handle sending user input
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return; // Prevent sending empty messages

    // Add user's message to the chat history
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    // Clear input field
    setUserMessage("");

    try {
      // Send the user input (prompt) to the backend
      const response = await axios.post("http://localhost:5000/generate-code", {
        prompt: userMessage,
      });
      const botMessage = response.data.code;

      // Add bot's response to the chat history
      setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
    } catch (error) {
      console.error("Error generating code", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error generating response" },
      ]);
    }
  };

  // Automatically scroll to the latest message
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
    hljs.highlightAll(); // Apply syntax highlighting to all code blocks
  }, [messages]); // Runs every time messages change

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-history" ref={chatHistoryRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              {msg.sender === "bot" ? (
                <pre>
                  <code>{msg.text}</code>
                </pre> // Display bot response as formatted code
              ) : (
                msg.text // Display user input as plain text
              )}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Enter your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }} // Send message on Enter key
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
