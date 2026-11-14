import { useCallback, useRef, useState } from 'react';
import { track } from '@vercel/analytics';

/**
 * Shared chat state for the floating Chatbot (/hss pages) and the
 * Ask Adam side panel. Both talk to /api/chat (Gemini) the same way.
 */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const busy = useRef(false);

  const send = useCallback(async (text) => {
    track('chat_sent');
    const content = String(text ?? '').trim();
    if (!content || busy.current) return false;

    busy.current = true;
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });
      const data = await response.json().catch(() => ({}));
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            response.ok && data.reply
              ? data.reply
              : '❌ Alamak! Something went wrong. Please try again.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Network error. Please check your connection.' },
      ]);
    } finally {
      busy.current = false;
      setIsLoading(false);
    }
    return true;
  }, []);

  const reset = useCallback(() => {
    if (!busy.current) setMessages([]);
  }, []);

  return { messages, isLoading, send, reset };
}
