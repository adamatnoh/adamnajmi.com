// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Oops! Something went wrong. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please check your connection.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Floating Toggle Button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-cyan-500 text-white p-4 rounded-full shadow-xl hover:bg-cyan-600 transition z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    );
  }

  // Chat Window
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#0a0a0a]">
        <span className="text-white font-mono text-sm">Ask Adam</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/50 hover:text-white"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-white/40 text-sm text-center mt-10 font-mono">
            👋 Ask me about Adam's experience, skills, or background.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-cyan-500 text-black"
                  : "bg-white/10 text-white/90 border border-white/5"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white/90 p-3 rounded-lg text-sm border border-white/5">
              <span className="animate-pulse">Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-[#0a0a0a] flex gap-2">
        <input
          type="text"
          className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-cyan-500 text-black px-4 py-2 rounded text-sm font-medium hover:bg-cyan-400 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
