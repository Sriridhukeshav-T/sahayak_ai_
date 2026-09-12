import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';
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
      return;
    }

    try {
      // Create fresh instance per session to avoid InvalidStateError
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      recog.lang = getLocaleCode(language);

      recog.onstart = () => {
        setIsListening(true);
      };

      recog.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recog.onerror = (event: any) => {
        setIsListening(false);
        // Only open fallback modal if mic is not allowed or unsupported
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setShowFallbackModal(true);
        }
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
      recog.start();
    } catch (err) {
      setIsListening(false);
      setShowFallbackModal(true);
    }
  };

  const activePrompts = SAMPLE_VOICE_PROMPTS_BY_LANG[language] || SAMPLE_VOICE_PROMPTS_BY_LANG.en;

  return (
    <>
      <button
        type="button"
        onClick={toggleVoice}
        className={`relative flex items-center justify-center transition-all ${
          isListening
            ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-xs'
        } ${
          size === 'icon'
            ? 'p-2 rounded-xl'
            : size === 'sm'
            ? 'px-2.5 py-1.5 rounded-lg text-xs font-semibold gap-1.5'
            : 'px-3 py-2 rounded-xl text-xs font-semibold gap-1.5'
        } ${className}`}
        title={title || (isListening ? t('listeningPrompt') : t('speakPrompt'))}
      >
        {isListening ? (
          <>
            <MicOff className={size === 'sm' || size === 'icon' ? 'w-3.5 h-3.5 text-white' : 'w-4 h-4 text-white'} />
            {size !== 'icon' && <span>{t('speakNow')}</span>}
          </>
        ) : (
          <>
            <Mic className={size === 'sm' || size === 'icon' ? 'w-3.5 h-3.5 text-blue-600' : 'w-4 h-4 text-blue-600'} />
            {size !== 'icon' && <span>{t('speakPrompt')}</span>}
          </>
        )}
      </button>

      {/* Voice Fallback / Demo Prompts Modal */}
      {showFallbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t('voiceFallbackNotice')}</h4>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'हिन्दी वॉयस इनपुट सिम्युलेटर' : language === 'ta' ? 'தமிழ் குரல் உள்ளீட்டு இயக்கி' : language === 'ml' ? 'മലയാളം വോയ്‌സ് ഇൻപുട്ട് സിമുലേറ്റർ' : 'Indian multilingual voice recognition'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFallbackModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {isSupported
                ? 'Microphone permissions may be restricted in your current browser session. You can click any localized sample voice statement below to test the AI natural language parser:'
                : 'Your current browser environment does not enable Web Speech API. Click any sample prompt below to simulate spoken voice input:'}
            </p>

            <div className="space-y-2">
              {activePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onTranscript(prompt);
                    setShowFallbackModal(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200/80 hover:border-blue-200 transition-all flex items-start gap-2 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">"{prompt}"</span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowFallbackModal(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
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
