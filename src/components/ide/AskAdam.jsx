import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { track } from '@vercel/analytics';
import { useChat } from '../chat/useChat';

const SUGGESTIONS = [
  'What is Adam working on right now?',
  'Tell me about the HSS project',
  "What's his strongest tech stack?",
  "Give me a hint for today's daily cipher",
];

const Svg = ({ d, size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d={d} />
  </svg>
);

/**
 * Copilot-style chat panel. Same /api/chat backend (and daily cipher hints)
 * as the floating Chatbot. The IDE shell opens/closes the column; this
 * component only renders the conversation.
 */
export default function AskAdam() {
  const { messages, isLoading, send, reset } = useChat();
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, isLoading]);

  // Let the shell (palette, terminal, buttons) ask questions.
  useEffect(() => {
    const ask = (q) => {
      track('chat_open');
      send(q);
    };
    window.__askAdam = ask;
    const queued = window.__askQueue || [];
    window.__askQueue = [];
    queued.forEach(ask);
    const focus = () => setTimeout(() => inputRef.current?.focus(), 60);
    window.addEventListener('ide:chat-focus', focus);
    return () => {
      delete window.__askAdam;
      window.removeEventListener('ide:chat-focus', focus);
    };
  }, [send]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  const submit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    await send(text);
    inputRef.current?.focus();
  };

  const close = () =>
    window.dispatchEvent(new CustomEvent('ide:chat-toggle', { detail: { open: false } }));

  return (
    <div className="chat">
      <div className="chat-head">
        <span>Ask Adam</span>
        <span className="spacer" />
        <button
          type="button"
          className="icon-btn"
          onClick={reset}
          disabled={!messages.length || isLoading}
          aria-label="New chat"
          title="New chat"
        >
          <Svg d="M12 5v14M5 12h14" />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={close}
          aria-label="Close Ask Adam"
          title="Close"
        >
          <Svg d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
        </button>
      </div>

      <div className="chat-msgs" aria-live="polite" aria-busy={isLoading}>
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-hello">
              <span className="chat-avatar" aria-hidden="true">
                AN
              </span>
              Hi, I'm Adam's portfolio assistant.
            </div>
            <p style={{ margin: 0 }}>
              Ask about his experience, projects, stack or background. Answers come from his resume.
            </p>
            <div className="chat-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} disabled={isLoading}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <div className="who">
              {m.role === 'user' ? (
                <>
                  <span className="me" aria-hidden="true">
                    👤
                  </span>
                  You
                </>
              ) : (
                <>
                  <span className="chat-avatar" aria-hidden="true">
                    AN
                  </span>
                  Ask Adam
                </>
              )}
            </div>
            <div className="body">
              {m.role === 'user' ? (
                m.content
              ) : (
                <Markdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {m.content}
                </Markdown>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-msg assistant">
            <div className="who">
              <span className="chat-avatar" aria-hidden="true">
                AN
              </span>
              Ask Adam
            </div>
            <div className="chat-typing" aria-label="Thinking">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form className="chat-form" onSubmit={submit}>
        <label htmlFor="ask-adam-input" className="sr-only">
          Ask a question about Adam
        </label>
        <textarea
          id="ask-adam-input"
          ref={inputRef}
          rows={1}
          value={input}
          placeholder="Ask about Adam's work…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
          }}
        />
        <div className="chat-form-row">
          <span>Gemini · answers from Adam's resume</span>
          <button
            type="submit"
            className="chat-send"
            disabled={!input.trim() || isLoading}
            aria-label="Send"
          >
            <Svg d="M4 12l16-7.5-5.5 15-2.8-6.2zM11.7 13.3L20 4.5" size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
