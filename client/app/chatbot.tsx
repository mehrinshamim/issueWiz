'use client';

import React from 'react';
import { MessageSquare, GitBranch } from 'lucide-react';

interface ChatMessage {
  type: 'bot' | 'user';
  content: any;
}

interface ChatBotProps {
  messages: ChatMessage[];
  userMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

const formatMessageContent = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function ChatBot({
  messages,
  userMessage,
  onMessageChange,
  onSendMessage,
}: ChatBotProps) {
  return (
    <div className="bg-[#162544] rounded-lg shadow-xl min-h-[600px] flex flex-col border border-cyan-500/20">
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-t-lg border-b border-cyan-500/20">
        <div className="flex items-center space-x-3">
          <GitBranch className="text-cyan-400" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-white">Open Source Guide</h2>
            <p className="text-sm text-cyan-300">I'm here to help you start your open source journey!</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                  : 'bg-[#1E2B43] text-white/90 border border-cyan-500/20'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">
                {formatMessageContent(msg.content)}
              </pre>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-cyan-500/20 bg-[#1A1F35]">
        <div className="flex gap-2">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Ask anything about getting started..."
            className="flex-1 p-3 rounded-full bg-[#1E2B43] border border-cyan-500/20 text-white focus:ring-2 focus:ring-cyan-500/40 focus:border-transparent"
          />
          <button
            onClick={onSendMessage}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-3 rounded-full hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-cyan-500/50"
          >
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
