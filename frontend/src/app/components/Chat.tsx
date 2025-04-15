'use client';

import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api/chatService';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: Date;
  isStreaming?: boolean;
}

export default function Chat() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus(); // Autofocus input on mount
  }, []);

  useEffect(() => {
    const handleStreamDelta = (event: CustomEvent) => {
      const { delta } = event.detail;
      if (!delta) return;

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
          const updatedMessages = [...prev];
          updatedMessages[prev.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + delta
          };
          return updatedMessages;
        }

        return [
          ...prev,
          {
            role: 'assistant' as const,
            content: delta,
            timestamp: new Date(),
            isStreaming: true
          }
        ];
      });
    };

    window.addEventListener('stream-delta', handleStreamDelta as EventListener);

    return () => {
      window.removeEventListener('stream-delta', handleStreamDelta as EventListener);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);

    setInput('');
    setIsLoading(true);

    try {
      await sendMessage(input);

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
          const updatedMessages = [...prev];
          updatedMessages[prev.length - 1] = {
            ...lastMessage,
            isStreaming: false
          };

          // ✅ Focus input field after response is done
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);

          return updatedMessages;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white shadow-sm'
              }`}
            >
              <p className="text-sm sm:text-base">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none p-4 border-t bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 p-2 sm:p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Thinking...</span>
              </div>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
