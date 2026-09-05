import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowUpRight,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { AssistantMessage, generateAssistantResponse } from '../../services/aiAssistantService';

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      sender: 'sahayak',
      text: 'Namaste! I am **Sahayak**, your AI financial guide. Ask me anything about schemes, EMI affordability, documents, or channel partners.',
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Which scheme is best for me?', action: 'best_scheme' },
        { label: 'Can I afford this loan?', action: 'affordability' },
        { label: 'What documents do I need?', action: 'documents' },
        { label: 'What is a moratorium?', action: 'moratorium' }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const { user } = useAuth();
  const { activeScheme, schemes } = useAppData();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const response = generateAssistantResponse(query, user, activeScheme, schemes);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: string) => {
    if (action === 'affordability') {
      navigate('/affordability');
      setIsOpen(false);
    } else if (action === 'find_scheme' || action === 'best_scheme') {
      handleSend('Which scheme is best for me?');
    } else if (action === 'documents') {
      navigate('/documents');
      setIsOpen(false);
    } else if (action === 'partners') {
      navigate('/partners');
      setIsOpen(false);
    } else if (action === 'compare') {
      navigate('/schemes');
      setIsOpen(false);
    } else if (action === 'literacy') {
      navigate('/literacy');
      setIsOpen(false);
    } else if (action === 'applications') {
      navigate('/applications');
      setIsOpen(false);
    } else {
      handleSend(action);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 text-white font-bold text-sm rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
          title="Ask Sahayak AI Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span>Ask Sahayak</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Assistant Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[530px] animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/80 border border-blue-400/40 flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm">Sahayak Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-blue-200">
                  Aware of {user.name.split(' ')[0]}'s profile & active scheme
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Context Banner */}
          {activeScheme && (
            <div className="bg-blue-50/90 border-b border-blue-100 px-3 py-1.5 flex items-center justify-between text-[11px] text-blue-900">
              <span className="font-medium truncate max-w-[240px]">
                Active: {activeScheme.name}
              </span>
              <span className="font-bold text-blue-700 shrink-0">
                {activeScheme.interestRate}%
              </span>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'sahayak' && (
                  <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-2xs">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.action)}
                          className="px-2 py-1 text-[10px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors flex items-center gap-1 border border-blue-200/60"
                        >
                          <span>{act.label}</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1 ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <Bot className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="italic text-[11px]">Sahayak is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask about schemes, loans, EMI..."
                className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
