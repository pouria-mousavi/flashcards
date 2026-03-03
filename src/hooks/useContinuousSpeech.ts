import { useState, useRef, useCallback, useEffect } from 'react';

interface UseContinuousSpeechOptions {
  onWord: (word: string) => void;
  pauseDelay?: number;
  lang?: string;
}

interface UseContinuousSpeechReturn {
  isListening: boolean;
  currentInterim: string;
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export function useContinuousSpeech({
  onWord,
  pauseDelay = 2000,
  lang = 'en-US',
}: UseContinuousSpeechOptions): UseContinuousSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [currentInterim, setCurrentInterim] = useState('');
  const recognitionRef = useRef<any>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStoppedRef = useRef(true);
  const lastProcessedIndexRef = useRef(0);
  const onWordRef = useRef(onWord);

  // Keep callback ref fresh without triggering re-renders
  useEffect(() => { onWordRef.current = onWord; }, [onWord]);

  const isSupported = !!SpeechRecognition;

  const processWord = useCallback((transcript: string) => {
    const words = transcript.trim().split(/\s+/);
    const lastWord = words[words.length - 1]
      ?.replace(/[^a-zA-Z'-]/g, '')
      ?.toLowerCase();

    if (lastWord && lastWord.length >= 2) {
      onWordRef.current(lastWord);
    }
  }, []);

  const start = useCallback(() => {
    if (!SpeechRecognition || recognitionRef.current) return;
    isStoppedRef.current = false;
    lastProcessedIndexRef.current = 0;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let latestFinal = '';
      let interim = '';

      for (let i = lastProcessedIndexRef.current; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          latestFinal = event.results[i][0].transcript;
          lastProcessedIndexRef.current = i + 1;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setCurrentInterim(interim);

      if (latestFinal) {
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = setTimeout(() => {
          processWord(latestFinal);
        }, pauseDelay);
      }
    };

    recognition.onend = () => {
      if (!isStoppedRef.current) {
        // Auto-restart — browsers stop continuous recognition periodically
        try {
          lastProcessedIndexRef.current = 0;
          recognition.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
        setCurrentInterim('');
      }
    };

    recognition.onerror = (event: any) => {
      // Ignore expected non-fatal errors
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.error('Speech error:', event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [lang, pauseDelay, processWord]);

  const stop = useCallback(() => {
    isStoppedRef.current = true;
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setCurrentInterim('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isStoppedRef.current = true;
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
        recognitionRef.current = null;
      }
    };
  }, []);

  return { isListening, currentInterim, start, stop, isSupported };
}
