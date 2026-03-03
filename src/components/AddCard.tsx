import { useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Flashcard } from '../utils/sm2';
import CardPreview from './CardPreview';
import ReadingMode from './ReadingMode';

interface Props {
  onAdd: (card: Partial<Flashcard>) => void;
  onCancel: () => void;
}

type InputMode = 'voice' | 'list' | 'reading';

const modeLabels: Record<InputMode, string> = {
  voice: 'Voice',
  list: 'List',
  reading: 'Reading',
};

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function AddCard({ onAdd, onCancel }: Props) {
  const [mode, setMode] = useState<InputMode>('voice');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Partial<Flashcard>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startRecording = useCallback(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) setTranscript(final.trim());
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimTranscript('');
  }, []);

  // Generate flashcards via Edge Function
  const handleGenerate = async (text?: string) => {
    const input = text || inputText;
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedCards([]);

    try {
      const words = input.split(/[,\n]+/).map(w => w.trim()).filter(Boolean);

      if (words.length === 0) {
        setError('No words detected');
        setLoading(false);
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke('generate-flashcards', {
        body: { words }
      });

      if (fnError) throw fnError;
      if (data?.error) { setError(data.error); return; }

      if (data?.cards && Array.isArray(data.cards)) {
        const processed = data.cards.map((json: any) => ({
          front: json.front,
          back: json.back,
          pronunciation: json.pronunciation,
          tone: json.tone,
          synonyms: Array.isArray(json.synonyms) ? json.synonyms.join(', ') : json.synonyms,
          word_forms: json.word_forms,
          examples: json.examples,
          other_meanings: json.other_meanings
        }));
        setGeneratedCards(processed);
      }

      if (data?.errors) {
        setError(data.errors.join('\n'));
      }
    } catch (err: any) {
      console.error(err);
      setError('Error: ' + (err.message || 'Failed to generate cards'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = () => {
    const count = generatedCards.length;
    generatedCards.forEach(card => onAdd(card));
    setGeneratedCards([]);
    setInputText('');
    setTranscript('');
    setSuccessMsg(`Saved ${count} cards!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDiscard = () => {
    setGeneratedCards([]);
    setInputText('');
    setTranscript('');
  };

  const showInput = generatedCards.length === 0 && !loading;

  return (
    <div className="flex-center full-screen" style={{
      flexDirection: 'column',
      background: 'var(--bg-color)',
      zIndex: 10,
      padding: '24px',
      overflowY: 'auto'
    }}>

      {/* Header */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '800px',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Add Words</h2>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '1.5rem',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        paddingBottom: '40px'
      }}>

        {/* Mode Toggle */}
        {showInput && (
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '4px',
            gap: '4px'
          }}>
            {(['voice', 'list', 'reading'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: mode === m ? 'var(--accent)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {modeLabels[m]}
              </button>
            ))}
          </div>
        )}

        {/* ─── VOICE MODE ─── */}
        {showInput && mode === 'voice' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            padding: '20px 0'
          }}>
            {!SpeechRecognition ? (
              <div style={{
                color: 'var(--warning)',
                textAlign: 'center',
                padding: '20px',
                fontSize: '0.95rem'
              }}>
                Speech recognition is not supported in this browser. Use Chrome or Safari, or switch to List mode.
              </div>
            ) : (
              <>
                {/* Mic Button */}
                <button
                  onPointerDown={(e) => { e.preventDefault(); startRecording(); }}
                  onPointerUp={stopRecording}
                  onPointerLeave={() => { if (isRecording) stopRecording(); }}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: 'none',
                    background: isRecording
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : 'linear-gradient(135deg, var(--accent), #818cf8)',
                    color: '#fff',
                    fontSize: '2.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isRecording
                      ? '0 0 0 12px rgba(239, 68, 68, 0.2), 0 0 40px rgba(239, 68, 68, 0.3)'
                      : '0 8px 32px rgba(99, 102, 241, 0.35)',
                    transition: 'box-shadow 0.3s ease, background 0.3s ease',
                    animation: isRecording ? 'addcard-pulse 1.5s ease-in-out infinite' : 'none',
                    touchAction: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                </button>

                <p style={{
                  color: isRecording ? '#ef4444' : 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  margin: 0
                }}>
                  {isRecording ? 'Listening... release to stop' : 'Hold to speak'}
                </p>

                {/* Live transcript while recording */}
                {isRecording && (transcript || interimTranscript) && (
                  <div style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '16px',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: 'white',
                    fontSize: '1.05rem',
                    lineHeight: '1.6',
                    minHeight: '50px'
                  }}>
                    {transcript}
                    {interimTranscript && (
                      <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}> {interimTranscript}</span>
                    )}
                  </div>
                )}

                {/* Editable field after recording */}
                {transcript && !isRecording && (
                  <>
                    <label style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      alignSelf: 'flex-start',
                      marginBottom: '-12px'
                    }}>
                      Edit if needed (separate words with commas)
                    </label>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '16px',
                        fontSize: '1.1rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'var(--card-bg)',
                        color: 'white',
                        outline: 'none',
                        boxSizing: 'border-box',
                        resize: 'vertical'
                      }}
                    />
                    <button
                      onClick={() => handleGenerate(transcript)}
                      style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: 'var(--radius)',
                        background: 'var(--accent)',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '1rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      Generate Cards
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── LIST MODE ─── */}
        {showInput && mode === 'list' && (
          <form
            onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '4px' }}>
                English words (comma or newline separated)
              </label>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                disabled={loading}
                placeholder="e.g. Serendipity, Burden, Consistency..."
                style={{
                  width: '100%',
                  height: '140px',
                  padding: '18px',
                  fontSize: '1.15rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'var(--card-bg)',
                  color: 'white',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              style={{
                padding: '18px',
                borderRadius: 'var(--radius)',
                background: 'var(--accent)',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                opacity: (loading || !inputText.trim()) ? 0.6 : 1,
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              Generate Cards
            </button>
          </form>
        )}

        {/* ─── READING MODE ─── */}
        {showInput && mode === 'reading' && (
          <ReadingMode
            onCardsGenerated={(cards) => setGeneratedCards(cards)}
            onError={(msg) => setError(msg)}
          />
        )}

        {/* ─── LOADING ─── */}
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            padding: '40px 0'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'addcard-spin 0.8s linear infinite'
            }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Generating with Claude...
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#fca5a5',
            borderRadius: '16px',
            fontSize: '0.95rem',
            whiteSpace: 'pre-wrap'
          }}>
            {error}
          </div>
        )}

        {/* Success */}
        {successMsg && (
          <div style={{
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#6ee7b7',
            borderRadius: '16px',
            fontSize: '1rem',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {successMsg}
          </div>
        )}

        {/* ─── CARD PREVIEW ─── */}
        {generatedCards.length > 0 && (
          <CardPreview
            cards={generatedCards}
            onSaveAll={handleSaveAll}
            onDiscard={handleDiscard}
          />
        )}
      </div>

      <style>{`
        @keyframes addcard-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes addcard-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
