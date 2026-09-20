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
  Volume2,
  VolumeX,
  Radio
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
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const { user } = useAuth();
  const { activeScheme, schemes } = useAppData();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load voices when component mounts
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
          text: 'नमस्ते! मैं **सहायक** हूँ, आपका एआई वित्तीय मार्गदर्शक। योजनाओं, किस्त की वहन क्षमता, आवश्यक दस्तावेज़ों या नजदीकी अधिकृत बैंकों के बारे में कुछ भी पूछें। आप माइक दबाकर बोल भी सकते हैं!',
          timestamp: 'अभी',
          suggestedActions: [
            { label: 'मेरे लिए कौन सी योजना सही है?', action: 'best_scheme' },
            { label: 'क्या मैं यह किस्त वहन कर सकता हूँ?', action: 'affordability' },
            { label: 'कौन से दस्तावेज़ चाहिए?', action: 'documents' },
            { label: 'मोरेटोरियम क्या है?', action: 'moratorium' }
          ]
        };
      case 'ta':
        return {
          id: 'welcome',
          sender: 'sahayak',
          text: 'வணக்கம்! நான் **சஹாயக்**, உங்கள் AI நிதி வழிகாட்டி. அரசு திட்டங்கள், தவணை கணக்கீடு, ஆவணங்கள் அல்லது அங்கீகரிக்கப்பட்ட வங்கிகள் குறித்து என்னிடம் கேட்கலாம். மைக்கை அழுத்தி பேசலாம்!',
          timestamp: 'இப்போது',
          suggestedActions: [
            { label: 'எனக்கான சிறந்த திட்டம் எது?', action: 'best_scheme' },
            { label: 'இதை திருப்பிச் செலுத்த முடியுமா?', action: 'affordability' },
            { label: 'என்ன ஆவணங்கள் தேவை?', action: 'documents' },
            { label: 'மோரட்டோரியம் என்றால் என்ன?', action: 'moratorium' }
          ]
        };
      case 'ml':
        return {
          id: 'welcome',
          sender: 'sahayak',
          text: 'നമസ്കാരം! ഞാൻ **സഹായക്**, നിങ്ങളുടെ AI സാമ്പത്തിക സഹായി. സർക്കാർ വായ്പാ പദ്ധതികൾ, ഇ.എം.ഐ, ആവശ്യമായ രേഖകൾ, ബാങ്കുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം. മൈക്ക് ഉപയോഗിച്ച് സംസാരിക്കാം!',
          timestamp: 'ഇപ്പോൾ',
          suggestedActions: [
            { label: 'ഏറ്റവും അനുയോജ്യമായ പദ്ധതി ഏതാണ്?', action: 'best_scheme' },
            { label: 'എനിക്ക് ഇത് താങ്ങാനാകുമോ?', action: 'affordability' },
            { label: 'എന്തൊക്കെ രേഖകൾ വേണം?', action: 'documents' },
            { label: 'മൊറട്ടോറിയം എന്നാൽ എന്ത്?', action: 'moratorium' }
          ]
        };
      default:
        return {
          id: 'welcome',
          sender: 'sahayak',
          text: 'Namaste! I am **Sahayak**, your AI financial guide. Ask me anything about schemes, EMI affordability, documents, or channel partners. You can speak into the mic or type!',
          timestamp: 'Just now',
          suggestedActions: [
            { label: 'Which scheme is best for me?', action: 'best_scheme' },
            { label: 'Can I afford this loan?', action: 'affordability' },
            { label: 'What documents do I need?', action: 'documents' },
            { label: 'What is a moratorium?', action: 'moratorium' }
          ]
        };
    }
  };

  const [messages, setMessages] = useState<AssistantMessage[]>([getWelcomeMessage(language)]);

  // Synchronize welcome message when language changes if no user messages sent yet
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

  // Clean markdown for text-to-speech
  const cleanTextForSpeech = (text: string) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/[#•*_`✓💡]/g, ' ')
      .replace(/₹\s*/g, ' rupees ')
      .replace(/\n+/g, '. ')
      .trim();
  };

  const getBestVoice = (lang: string) => {
    if (!voices || voices.length === 0) return null;
    if (lang === 'hi') {
      return (
        voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi')) ||
        voices.find(v => v.name.toLowerCase().includes('hindi')) ||
        null
      );
    }
    if (lang === 'ta') {
      return (
        voices.find(v => v.lang === 'ta-IN' || v.lang.startsWith('ta')) ||
        voices.find(v => v.name.toLowerCase().includes('tamil')) ||
        null
      );
    }
    if (lang === 'ml') {
      return (
        voices.find(v => v.lang === 'ml-IN' || v.lang.startsWith('ml')) ||
        voices.find(v => v.name.toLowerCase().includes('malayalam')) ||
        null
      );
    }
    return (
      voices.find(v => v.lang === 'en-IN') ||
      voices.find(v => v.name.toLowerCase().includes('india')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      null
    );
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

    const selectedVoice = getBestVoice(language);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'ta') utterance.lang = 'ta-IN';
      else if (language === 'ml') utterance.lang = 'ml-IN';
      else utterance.lang = 'en-IN';
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

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

      // Auto-read aloud if autoSpeak is ON or if user used voice input
      if (autoSpeak || wasSpoken) {
        handleSpeak(response.id, response.text);
      }
    }, 600);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputQuery(transcript);
    handleSend(transcript, true);
  };

  const handleActionClick = (action: string) => {
    if (action === 'affordability') {
      navigate('/affordability');
      setIsOpen(false);
    } else if (action === 'find_scheme' || action === 'best_scheme') {
      const query = language === 'hi' ? 'मेरे लिए सर्वश्रेष्ठ योजना कौन सी है?' : language === 'ta' ? 'எனக்கான சிறந்த திட்டம் எது?' : language === 'ml' ? 'ഏറ്റവും അനുയോജ്യമായ പദ്ധതി ഏതാണ്?' : 'Which scheme is best for me?';
      handleSend(query);
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
          title={t('voiceAssistantTitle')}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span>{t('askSahayak')}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Assistant Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[540px] animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/80 border border-blue-400/40 flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm">{t('voiceAssistantTitle')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-blue-200">
                  {user.name.split(' ')[0]} ({language.toUpperCase()}) • {activeScheme ? activeScheme.name.slice(0, 18) + '...' : 'AI Active'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Auto-Speak / Voice Mode Toggle */}
              <button
                onClick={() => {
                  if (speakingMsgId && autoSpeak) {
                    window.speechSynthesis.cancel();
                    setSpeakingMsgId(null);
                  }
                  setAutoSpeak(!autoSpeak);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  autoSpeak
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
                title={autoSpeak ? 'Voice Mode: ON (Sahayak speaks answers)' : 'Voice Mode: OFF (Silent)'}
              >
                {autoSpeak ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('Voice Mode')}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mute</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (speakingMsgId && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    setSpeakingMsgId(null);
                  }
                  setIsOpen(false);
                }}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          {activeScheme && (
            <div className="bg-blue-50/90 border-b border-blue-100 px-3 py-1.5 flex items-center justify-between text-[11px] text-blue-900">
              <span className="font-medium truncate max-w-[240px]">
                {t('activeScheme')}: {activeScheme.name}
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
                  <div className="flex items-start justify-between gap-2">
                    <p className="whitespace-pre-line flex-1">{msg.text}</p>
                    
                    {/* Read Aloud Text-to-Speech Button */}
                    {msg.sender === 'sahayak' && (
                      <div className="flex items-center gap-1 shrink-0 mt-0.5">
                        {speakingMsgId === msg.id && (
                          <div className="flex items-center gap-0.5 h-3 px-1">
                            <span className="w-0.5 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-0.5 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-0.5 h-2.5 bg-blue-600 rounded-full animate-bounce" />
                          </div>
                        )}
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className={`p-1 rounded-md transition-colors ${
                            speakingMsgId === msg.id
                              ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400 animate-pulse'
                              : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                          }`}
                          title={speakingMsgId === msg.id ? t('Stop Speaking') : t('Read Aloud')}
                        >
                          {speakingMsgId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

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
                <span className="italic text-[11px]">{t('understandingGoal')}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box with Multilingual Voice Recognition Mic */}
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
                placeholder={t('typeMessagePlaceholder')}
                className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
              />

              {/* Voice Mic Button */}
              <VoiceInputButton
                onTranscript={handleVoiceTranscript}
                size="icon"
                className="shrink-0"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs shrink-0"
                title={t('send')}
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
