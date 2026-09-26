import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SAMPLE_VOICE_PROMPTS_BY_LANG } from '../../services/naturalLanguageService';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'icon';
  title?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  className = '',
  size = 'md',
  title
}) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Map app language to BCP 47 locale code for Indian speech recognition
  const getLocaleCode = (lang: string) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'ta': return 'ta-IN';
      case 'ml': return 'ml-IN';
      default: return 'en-IN';
    }
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const [listeningStatus, setListeningStatus] = useState<string | null>(null);

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case 'hi': return 'हिन्दी (Hindi)';
      case 'ta': return 'தமிழ் (Tamil)';
      case 'ml': return 'മലയാളം (Malayalam)';
      default: return 'English (India)';
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setShowFallbackModal(true);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setListeningStatus(null);
      return;
    }

    try {
      // Create fresh instance per session to avoid InvalidStateError
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.maxAlternatives = 1;
      recog.lang = getLocaleCode(language);

      recog.onstart = () => {
        setIsListening(true);
        setListeningStatus(`${t('Listening...')} (${getLanguageName(language)})`);
      };

      recog.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        const text = finalTranscript || event.results?.[0]?.[0]?.transcript;
        if (text) {
          onTranscript(text.trim());
          setIsListening(false);
          setListeningStatus(null);
        }
      };

      recog.onerror = (event: any) => {
        setIsListening(false);
        setListeningStatus(null);
        // Only open fallback modal if microphone access is explicitly blocked
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setShowFallbackModal(true);
        }
        // no-speech or network: reset gracefully without intrusive modal
      };

      recog.onend = () => {
        setIsListening(false);
        setListeningStatus(null);
      };

      recognitionRef.current = recog;
      recog.start();
    } catch (err) {
      setIsListening(false);
      setListeningStatus(null);
      setShowFallbackModal(true);
    }
  };

  const activePrompts = SAMPLE_VOICE_PROMPTS_BY_LANG[language] || SAMPLE_VOICE_PROMPTS_BY_LANG.en;

  return (
    <>
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={toggleVoice}
          className={`relative flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-200 animate-pulse'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs'
          } ${
            size === 'icon'
              ? 'p-2 rounded-md'
              : size === 'sm'
              ? 'px-2.5 py-1.5 rounded-md text-xs font-medium gap-1.5'
              : 'px-3 py-1.5 rounded-md text-xs font-medium gap-1.5'
          } ${className}`}
          title={title || (isListening ? t('listeningPrompt') : t('speakPrompt'))}
        >
          {isListening ? (
            <>
              {/* Soundwave animation bars */}
              <div className="flex items-center gap-0.5 h-3.5 mr-1">
                <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-0.5 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" />
              </div>
              <MicOff className={size === 'sm' || size === 'icon' ? 'w-3.5 h-3.5 text-white' : 'w-4 h-4 text-white'} />
              {size !== 'icon' && <span>{t('Listening...')}</span>}
            </>
          ) : (
            <>
              <Mic className={size === 'sm' || size === 'icon' ? 'w-3.5 h-3.5 text-slate-600' : 'w-4 h-4 text-slate-600'} />
              {size !== 'icon' && <span>{t('speakPrompt')}</span>}
            </>
          )}
        </button>

        {/* Listening Floating Tooltip */}
        {isListening && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-lg border border-slate-700 flex items-center gap-1.5 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{listeningStatus || t('Listening...')}</span>
          </div>
        )}
      </div>

      {/* Voice Fallback / Sample Prompts Modal */}
      {showFallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-5 max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-sm bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">{t('voiceFallbackNotice')}</h4>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'हिन्दी वॉयस इनपुट' : language === 'ta' ? 'தமிழ் குரல் உள்ளீடு' : language === 'ml' ? 'മലയാളം വോയ്‌സ് ഇൻപുട്ട്' : 'Indian multilingual voice recognition'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFallbackModal(false)}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {isSupported
                ? 'Microphone access may be restricted in this browser session. You can select any sample natural language statement below to evaluate eligibility matching:'
                : 'Web Speech API is unavailable in this environment. Select a sample query below to test voice search queries:'}
            </p>

            <div className="space-y-2">
              {activePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onTranscript(prompt);
                    setShowFallbackModal(false);
                  }}
                  className="w-full text-left p-2.5 rounded-md text-xs bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-all flex items-start gap-2"
                >
                  <span className="font-mono text-slate-400 text-[10px] mt-0.5">•</span>
                  <span className="font-medium leading-relaxed">"{prompt}"</span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowFallbackModal(false)}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-md"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
