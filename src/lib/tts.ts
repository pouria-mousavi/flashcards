// Locale-aware text-to-speech.
//
// Plays audio through the Supabase `tts` edge function, which uses Azure neural
// voices (native Swedish prosody) and falls back to Google Translate TTS if
// Azure errors. The `lang` query param selects the voice locale. Falls back to
// the browser's SpeechSynthesis if the proxy itself is unreachable.

const TTS_ENDPOINT = 'https://dgqkwzuykhmcxvajumne.supabase.co/functions/v1/tts';

// Bump this to bust stale cached clips (the endpoint caches audio for 24h, so
// clips fetched before a voice change keep replaying the old engine until this
// changes the request URL). 'v2' = Azure neural rollout; 'v3' = natural rate
// (dropped the slowdown that was flattening sentence melody).
const TTS_VERSION = 'v3';

export type TtsLang = 'en' | 'sv';

const BROWSER_LOCALE: Record<TtsLang, string> = {
  en: 'en-US',
  sv: 'sv-SE',
};

// Single shared audio element so a new play() always interrupts the previous
// clip instead of overlapping.
let currentAudio: HTMLAudioElement | null = null;

// `emphasis` (optional) is a verbatim substring of `text` that should carry the
// sentence stress (betoning). The edge function wraps it in SSML <prosody> so the
// neural voice puts the focus on that word, the way a native speaker would.
export function playTTS(text?: string | null, lang: TtsLang = 'en', emphasis?: string | null): void {
  if (!text) return;

  // Stop anything currently playing.
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  let url = `${TTS_ENDPOINT}?lang=${lang}&v=${TTS_VERSION}&q=${encodeURIComponent(text)}`;
  if (emphasis) url += `&emph=${encodeURIComponent(emphasis)}`;
  const audio = new Audio(url);
  // The edge function already slows neural speech ~5%; keep client at 1.0 so
  // the two don't compound into an unnaturally slow clip.
  audio.playbackRate = 1.0;
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
