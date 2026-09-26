import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  HelpCircle,
  Volume2,
  VolumeX,
  ExternalLink,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { AssistantMessage, generateAssistantResponse } from '../../services/aiAssistantService';
import { VoiceInputButton } from './VoiceInputButton';

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const { user } = useAuth();
  const { activeScheme, schemes } = useAppData();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        try {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length > 0) setVoices(v);
        } catch {
          // ignore
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const getWelcomeMessage = (lang: string): AssistantMessage => {
    switch (lang) {
      case 'hi':
        return {
          id: 'welcome',
          sender: 'sahayak',
          text: 'नमस्ते। मैं सहायक योजना परामर्शदाता हूँ। आधिकारिक सरकारी योजनाओं, पात्रता नियमों, आवश्यक दस्तावेज़ों या आवेदन प्रक्रियाओं के बारे में पूछें।',
          timestamp: 'अभी',
          suggestedActions: [
            { label: 'छोटे व्यवसाय के लिए कौन सी योजनाएं हैं?', action: 'best_scheme' },
            { label: 'पीएमईजीपी के लिए कौन से दस्तावेज़ चाहिए?', action: 'documents' },
            { label: 'क्या मैं मुद्रा ऋण के लिए पात्र हूँ?', action: 'affordability' }
          ]
        };
      case 'ta':
        return {
          id: 'welcome',
          sender: 'sahayak',
          text: 'வணக்கம். அரசு திட்டங்கள், தகுதி நிபந்தனைகள், தேவையான ஆவணங்கள் அல்லது விண்ணப்ப முறைகள் பற்றி என்னிடம் கேட்கலாம்.',
          timestamp: 'இப்போது',
          suggestedActions: [
            { label: 'சிறு வணிகத்திற்கான திட்டங்கள் யாவை?', action: 'best_scheme' },
            { label: 'என்னென்ன ஆவணங்கள் தேவை?', action: 'documents' }
          ]
        };
      default:
        return {
          id: 'welcome',
          sender: 'sahayak',
          text: 'Welcome. I am your Scheme Assistant. Ask questions about verified government schemes, deterministic eligibility criteria, required documents, or official application portals.',
          timestamp: 'Just now',
          suggestedActions: [
            { label: 'Which schemes support small businesses?', action: 'best_scheme' },
            { label: 'What documents are required for PMEGP?', action: 'documents' },
            { label: 'How does interest subsidy work?', action: 'affordability' }
          ]
        };
    }
  };

  const [messages, setMessages] = useState<AssistantMessage[]>([getWelcomeMessage(language)]);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [getWelcomeMessage(language)];
      }
      return prev;
    });
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const cleanTextForSpeech = (text: string) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/[#•*_`✓💡]/g, ' ')
      .replace(/₹\s*/g, ' rupees ')
      .replace(/\n+/g, '. ')
      .trim();
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(text));
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = (textToSend?: string, wasSpoken: boolean = false) => {
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

    setTimeout(() => {
      const response = generateAssistantResponse(query, user, activeScheme, schemes, language);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);

      if (autoSpeak || wasSpoken) {
        handleSpeak(response.id, response.text);
      }
    }, 450);
  };

  return (
    <>
      {/* Calm Civic Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-[#065F46] hover:bg-[#064E3B] text-white font-medium text-xs rounded-md shadow-lg transition-colors border border-emerald-900"
          title="Scheme Assistant"
        >
          <HelpCircle className="w-4 h-4 text-emerald-200" />
          <span>Scheme Assistant</span>
        </button>
      )}

      {/* Assistant Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-2">
          
          {/* Header */}
          <div className="bg-[#064E3B] text-white p-3.5 flex items-center justify-between border-b border-emerald-900">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight">Scheme Assistant</span>
                <span className="text-[10px] text-emerald-300 font-mono">Civic Guide</span>
              </div>
              <p className="text-[10px] text-emerald-100/80">
                Grounded in official Government of India records
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (speakingMsgId && autoSpeak) {
                    window.speechSynthesis.cancel();
                    setSpeakingMsgId(null);
                  }
                  setAutoSpeak(!autoSpeak);
                }}
                className={`p-1.5 rounded transition-colors ${
                  autoSpeak ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-800/60'
                }`}
                title={autoSpeak ? 'Audio speech enabled' : 'Muted'}
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  if (speakingMsgId && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    setSpeakingMsgId(null);
                  }
                  setIsOpen(false);
                }}
                className="p-1.5 rounded text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Scheme Context if selected */}
          {activeScheme && (
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-700">
              <span className="font-medium truncate max-w-[240px]">
                Focus: {activeScheme.officialName || activeScheme.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {activeScheme.code || activeScheme.id}
              </span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F8FAFC]">
            {messages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[88%] p-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#065F46] text-white rounded-md rounded-br-none shadow-2xs'
                        : 'bg-white text-slate-800 rounded-md rounded-bl-none border border-slate-200 shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Source citation if available */}
                    {!isUser && msg.sourceMinistry && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                        <Building2 className="w-3 h-3 text-[#065F46] shrink-0" />
                        <span className="truncate">Source: {msg.sourceMinistry}</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-slate-400 font-mono px-1">
                    {msg.timestamp}
                  </span>

                  {/* Suggested follow-up links */}
                  {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-col gap-1 pt-1 w-full max-w-[92%]">
                      <span className="text-[10px] font-semibold text-slate-400">Suggested queries:</span>
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(action.label)}
                          className="text-left text-[11px] text-slate-700 bg-white hover:bg-emerald-50 hover:text-[#065F46] p-1.5 rounded border border-slate-200 transition-colors"
                        >
                          → {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-md border border-slate-200 text-xs text-slate-500 w-fit">
                <span className="w-1.5 h-1.5 bg-[#065F46] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#065F46] rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#065F46] rounded-full animate-bounce [animation-delay:0.3s]" />
                <span className="text-[11px] ml-1">Searching authoritative directory...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <VoiceInputButton
                onTranscript={transcript => {
                  setInputQuery(transcript);
                  handleSend(transcript, true);
                }}
              />
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask about schemes, rules, documents..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#065F46] text-slate-800"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2 bg-[#065F46] hover:bg-[#064E3B] text-white rounded disabled:opacity-40 transition-colors"
                title="Send"
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
