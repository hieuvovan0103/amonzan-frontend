'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage, type ChatMessage, type ChatModel } from '@/lib/api/chatbot';

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Xin chào! Tôi là trợ lý AI 🎭 — tôi có thể giúp bạn giải đáp mọi thắc mắc về cosplay. Bạn muốn hỏi gì nào?',
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [model, setModel] = useState<ChatModel>('gemini');
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  function handleModelSwitch(newModel: ChatModel) {
    if (newModel === model || isLoading) return;
    setModel(newModel);
    setMessages([WELCOME_MESSAGE]);
    setInput('');
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = updatedMessages.slice(1);
      const reply = await sendChatMessage(history, model);
      setMessages([...updatedMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat popup */}
      {isOpen && (
        <div className="w-[350px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎭</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">Trợ lý AI</p>
                  <p className="text-purple-100 text-xs">Luôn sẵn sàng hỗ trợ</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-purple-200 transition-colors"
                aria-label="Đóng chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Model toggle */}
            <div className="flex rounded-lg overflow-hidden bg-white/10 p-0.5 gap-0.5">
              <button
                onClick={() => handleModelSwitch('gemini')}
                className={`flex-1 text-xs py-1 px-2 rounded-md transition-all font-medium ${
                  model === 'gemini'
                    ? 'bg-white text-purple-700'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ✨ Gemini
              </button>
              <button
                onClick={() => handleModelSwitch('openai')}
                className={`flex-1 text-xs py-1 px-2 rounded-md transition-all font-medium ${
                  model === 'openai'
                    ? 'bg-white text-purple-700'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                🤖 ChatGPT
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 my-1">{children}</ol>,
                        li: ({ children }) => <li className="text-sm">{children}</li>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 flex items-center gap-1">
                  <Loader2 size={14} className="animate-spin text-purple-500" />
                  <span className="text-xs text-gray-400">Đang trả lời...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi về cosplay..."
              disabled={isLoading}
              className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-purple-400 bg-gray-50 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Gửi"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Mở chatbot cosplay"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
