// Locale-aware text-to-speech.
//
// Plays audio through the Supabase `tts` edge function, which proxies Google
// Translate TTS. The `lang` query param selects the voice locale (added so the
// Swedish deck can use a native Swedish voice). Falls back to the browser's
// SpeechSynthesis if the proxy is blocked.

const TTS_ENDPOINT = 'https://dgqkwzuykhmcxvajumne.supabase.co/functions/v1/tts';

export type TtsLang = 'en' | 'sv';

const BROWSER_LOCALE: Record<TtsLang, string> = {
  en: 'en-US',
  sv: 'sv-SE',
};

// Single shared audio element so a new play() always interrupts the previous
// clip instead of overlapping.
let currentAudio: HTMLAudioElement | null = null;

export function playTTS(text?: string | null, lang: TtsLang = 'en'): void {
  if (!text) return;

  // Stop anything currently playing.
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const url = `${TTS_ENDPOINT}?lang=${lang}&q=${encodeURIComponent(text)}`;
  const audio = new Audio(url);
  audio.playbackRate = 0.9;
  currentAudio = audio;

  audio.play().catch(() => {
    // Fallback: browser speech synthesis in the right locale.
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = BROWSER_LOCALE[lang];
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* silent — audio just won't play */
    }
  });
}
