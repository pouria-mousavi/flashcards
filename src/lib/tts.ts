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

// Voice tier. The author ('azure') gets the neural cloud voice through the
// edge function; shared friends ('browser') use the device's built-in voice —
// zero server cost and no drain on the author's Azure quota. App sets this
// from the signed-in user's role.
let ttsTier: 'azure' | 'browser' = 'azure';
export function setTtsTier(tier: 'azure' | 'browser'): void {
  ttsTier = tier;
}

// Speak with the device's built-in synthesizer in the right locale, preferring
// a matching-language voice when the device ships one.
function speakBrowser(text: string, lang: TtsLang): void {
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = BROWSER_LOCALE[lang];
    const match = window.speechSynthesis.getVoices().find(v => v.lang?.toLowerCase().startsWith(lang === 'sv' ? 'sv' : 'en'));
    if (match) u.voice = match;
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  } catch {
    /* silent — audio just won't play */
  }
}

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

  // Shared friends use the free on-device voice — never the metered endpoint.
  if (ttsTier === 'browser') {
    speakBrowser(text, lang);
    return;
  }

  let url = `${TTS_ENDPOINT}?lang=${lang}&v=${TTS_VERSION}&q=${encodeURIComponent(text)}`;
  if (emphasis) url += `&emph=${encodeURIComponent(emphasis)}`;
  const audio = new Audio(url);
  // The edge function already slows neural speech ~5%; keep client at 1.0 so
  // the two don't compound into an unnaturally slow clip.
  audio.playbackRate = 1.0;
  currentAudio = audio;

  audio.play().catch(() => {
    // Fallback: the device voice if the neural endpoint is unreachable.
    speakBrowser(text, lang);
  });
}
