import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';
import { SAMPLE_VOICE_PROMPTS } from '../../services/naturalLanguageService';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-IN'; // Indian English, supports common terms

      recog.onstart = () => setIsListening(true);
      recog.onend = () => setIsListening(false);
      recog.onerror = () => {
        setIsListening(false);
        setShowFallbackModal(true);
      };
      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      setRecognition(recog);
    } else {
      setIsSupported(false);
    }
  }, [onTranscript]);

  const toggleVoice = () => {
    if (!isSupported) {
      setShowFallbackModal(true);
      return;
    }

    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
      } catch (err) {
        setShowFallbackModal(true);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleVoice}
        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
          isListening
            ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
        } ${className}`}
        title={isListening ? 'Listening... Speak now' : 'Speak your goal (Voice Input)'}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-white" />
            <span>Listening...</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-blue-600" />
            <span>Voice Input</span>
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
                  <h4 className="font-bold text-sm text-slate-900">Voice Recognition Input</h4>
                  <p className="text-[11px] text-slate-500">Select a simulated voice prompt or use mic</p>
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
                ? 'Microphone permissions might be blocked by your browser settings. You can click any sample voice statement below to test the AI natural language parser:'
                : 'Your current browser does not enable Web Speech API. Click any sample prompt below to simulate voice speech:'}
            </p>

            <div className="space-y-2">
              {SAMPLE_VOICE_PROMPTS.map((prompt, idx) => (
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
