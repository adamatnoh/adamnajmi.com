import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(false);
      setShowTooltip(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Show after 3 seconds and hide it after 5 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsMounted(true);
      requestAnimationFrame(() => {
        setShowTooltip(true);
      });
    }, 3000);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
      setTimeout(() => setIsMounted(false), 700); // wait animation finish
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

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
            content: "❌ Alamak! Something went wrong. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Network error. Please check your connection.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  // Floating Toggle Button + Tooltip
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip */}
        {isMounted && (
          <div
            className={`
            absolute bottom-full right-0 mb-3
            bg-[#0a0a0a] border border-green-500/30 text-green-400 
            text-xs font-mono px-3 py-1.5 rounded shadow-lg 
            whitespace-nowrap transition-all duration-700 ease-in-out
            ${showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
          `}
          >
            🤖 Ask me about my experience
            <div className="absolute -bottom-1.5 right-4 w-2 h-2 bg-[#0a0a0a] border-b border-r border-green-500/30 rotate-45"></div>
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0a0a0a] border border-green-500/30 text-green-400 p-4 rounded-lg shadow-2xl hover:border-green-400 hover:text-green-300 transition-all duration-200 font-mono text-sm"
        >
          <span className="flex items-center gap-2">
            <span className="text-green-500">$</span> ./ask_adam.sh
          </span>
        </button>
      </div>
    );
  }

  // Chat Window
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] h-[calc(100vh-8rem)] sm:h-[560px] max-h-[600px] min-h-[400px] bg-[#0a0a0a] border border-green-500/30 rounded-lg shadow-2xl flex flex-col z-50 font-mono overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-green-500/20 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex gap-1.5 flex-shrink-0">
            <div
              onClick={() => setIsOpen(false)}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:brightness-225 cursor-pointer"
              aria-label="Close"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-green-400/60 text-[10px] sm:text-xs tracking-wider truncate">
            ┌─[adam@portfolio]─[~]
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 bg-[#0a0a0a]">
        {messages.length === 0 && (
          <div className="text-green-400/50 text-xs leading-relaxed">
            <span className="text-green-500">$</span> echo "Ask me about Adam's
            experience, skills, or background."
            <br />
            <span className="text-green-500">$</span>{" "}
            <span className="animate-pulse">▊</span>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-1.5 rounded text-sm break-words ${
                msg.role === "user"
                  ? "bg-green-500/10 text-green-300 border border-green-500/20"
                  : "text-green-400/90"
              }`}
            >
              <span className="inline [&_p]:m-0 [&_ul]:m-0 [&_li]:my-0.5 [&_ul]:pl-4 [&_br]:block [&_br]:content-[''] [&_br]:my-1 whitespace-pre-wrap">
                {msg.role === "user" ? (
                  <div>
                    <span className="text-green-500/50">$ </span>
                    {msg.content}
                  </div>
                ) : (
                  <div>
                    <span className="text-green-500/50">› </span>
                    <Markdown>{msg.content}</Markdown>
                  </div>
                )}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="text-green-400/60 text-sm">
              <span className="text-green-500">›</span>{" "}
              <span className="animate-pulse">▊</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 sm:p-3 border-t border-green-500/20 bg-black/80 flex items-center gap-2 flex-shrink-0">
        <span className="text-green-500 text-sm font-mono">$</span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-green-400 text-sm font-mono placeholder-green-400/30 min-w-0"
          placeholder="type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-green-500/30 text-green-400/60 hover:text-green-400 transition disabled:opacity-30 text-sm font-mono border border-green-500/20 px-2 py-0.5 rounded hover:border-green-400 flex-shrink-0"
        >
          ⏎
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
