import { useState } from "react";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = ({ setShowChat, messages, setMessages }) => {

  const [input, setInput] = useState("");

  

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

  if (!input.trim()) return;

  const newMessages = [
    ...messages,
    { role: "user", content: input }
  ];

  setMessages(newMessages);
  setInput("");
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:3000/api/chat", {
      messages: newMessages
    });

    setMessages([
      ...newMessages,
      { role: "assistant", content: res.data.reply }
    ]);

  } catch (error) {
    console.log(error);
  }

  setLoading(false);
};

  return (
    <div className="chatbot">

      {/* HEADER */}
      <div className="chat-header flex-row">
        <div>Crypto AI Assistant</div>

        <button
          className="chat-close-btn"
          onClick={() => setShowChat(false)}
        >
          ✕
        </button>
      </div>

      {/* CHAT BODY */}
      <div className="chat-body">

        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "8px 0"
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "10px",
                maxWidth: "80%",
                background: msg.role === "user" ? "#6400ff" : "#2a2a3d",
                color: "white"
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}

        {loading && (
          <p style={{ color: "#aaa" }}>AI is thinking...</p>
        )}

      </div>

      {/* INPUT AREA */}
      <div className="chat-footer">

        <input
          type="text"
          placeholder="Ask anything about crypto..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
};

export default ChatBot;