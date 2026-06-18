import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
            content: "❌ Oops! Something went wrong. Please try again.",
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
    }
  };

  // Floating Toggle Button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#0a0a0a] border border-green-500/30 text-green-400 p-4 rounded-lg shadow-2xl hover:border-green-400 hover:text-green-300 transition-all duration-200 z-50 font-mono text-sm"
      >
        <span className="flex items-center gap-2">
          <span className="text-green-500">$</span> ./ask_adam.sh
        </span>
      </button>
    );
  }

  // Chat Window
  return (
    <div className="fixed bottom-6 right-6 w-[420px] h-[560px] bg-[#0a0a0a] border border-green-500/30 rounded-lg shadow-2xl flex flex-col z-50 font-mono overflow-hidden">
      {/* Terminal Header – Red dot now closes the window */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-green-500/20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {/* Red dot = Close button */}
            <div
              onClick={() => setIsOpen(false)}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:brightness-225"
              aria-label="Close"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-green-400/60 text-xs tracking-wider">
            ┌─[adam@portfolio]─[~]
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-[#0a0a0a]">
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
              className={` px-3 py-1.5 rounded text-sm ${
                msg.role === "user"
                  ? "bg-green-500/10 text-green-300 border border-green-500/20"
                  : "text-green-400/90"
              }`}
            >
              {/* Message content with compact padding – handles markdown if installed */}
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

      {/* Input Area – with terminal-style ⏎ button */}
      <div className="p-3 border-t border-green-500/20 bg-black/80 flex items-center gap-2">
        <span className="text-green-500 text-sm font-mono">$</span>
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-green-400 text-sm font-mono placeholder-green-400/30"
          placeholder="type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
          autoFocus
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-green-500/30 text-green-400/60 hover:text-green-400 transition disabled:opacity-30 text-sm font-mono border border-green-500/20 px-2 py-0.5 rounded hover:border-green-400"
        >
          ⏎
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
