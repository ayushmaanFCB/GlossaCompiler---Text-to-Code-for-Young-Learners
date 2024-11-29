import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbox.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "font-awesome/css/font-awesome.min.css";
import { FaYoutube } from "react-icons/fa";

function Chatbox({ onCopyToIDE }) {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const chatHistoryRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [videoSuggestions, setVideoSuggestions] = useState([]);

  const fetchVideoSuggestions = async (messageText) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/suggest-videos",
        {
          prompt: messageText, // Use the provided message text as the query
        }
      );
      if (response.data.videos) {
        setVideoSuggestions(response.data.videos);
        setShowModal(true); // Show the modal with video suggestions
      } else {
        console.error("Failed to fetch videos");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  function VideoSuggestionsModal({ videos, onClose }) {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Format to 'MM/DD/YYYY'
    };

    return (
      <div className="modal-overlay youtube-suggestions-modal">
        <div className="modal-content">
          <h3 style={{ padding: "1rem" }}>SUGGESTED TUTORIAL VIDEOS</h3>
          <div className="video-list">
            {videos.map((video, index) => (
              <div key={index} className="video-item">
                {/* Video preview on the left */}
                <iframe
                  src={`https://www.youtube.com/embed/${new URL(
                    video.link
                  ).searchParams.get("v")}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>

                {/* Video title, link, description, and publish date on the right */}
                <div className="video-info">
                  <h4 style={{ fontSize: "20px" }}>{video.title}</h4>
                  <small style={{ color: "gray" }}>
                    {formatDate(video.publishedAt)}
                  </small>{" "}
                  {/* Format and show the publish date */}
                  <p
                    style={{
                      color: "white",
                      textAlign: "left",
                      fontSize: "14px",
                    }}
                  >
                    {video.description}
                  </p>{" "}
                  {/* Show video description */}
                </div>
              </div>
            ))}
          </div>
          <button className="close-button" onClick={onClose}>
            &times; {/* This will display an "X" */}
          </button>
        </div>
      </div>
    );
  }

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
                  <button
                    onClick={() => fetchVideoSuggestions(msg.text)} // Pass the bot's response text
                    className="suggestions-button"
                  >
                    <FaYoutube size={22} />{" "}
                    {/* Font Awesome YouTube icon with size */}
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

      {/* Conditional rendering for the modal */}
      {showModal && (
        <VideoSuggestionsModal
          videos={videoSuggestions}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Chatbox;
