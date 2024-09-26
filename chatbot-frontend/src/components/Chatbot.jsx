import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbox.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

function Chatbox({ onCopyToIDE }) {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const chatHistoryRef = useRef(null);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setUserMessage("");
    try {
      const response = await axios.post("http://localhost:5000/generate-code", {
        prompt: userMessage,
      });
      const botMessage = response.data.code;
      setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
    } catch (error) {
      console.error("Error generating code", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error generating response" },
      ]);
    }
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
    hljs.highlightAll();
  }, [messages]);

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
                <>
                  <pre>
                    <code>{msg.text}</code>
                  </pre>
                  <button
                    className="copy-button"
                    onClick={() => onCopyToIDE(msg.text)}
                  >
                    Copy to IDE
                  </button>
                </>
              ) : (
                msg.text
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
            }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
