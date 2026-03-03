import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useContinuousSpeech } from '../hooks/useContinuousSpeech';
import { lookupWord } from '../utils/dictionary';
import type { CollectedWord } from '../utils/dictionary';
import type { Flashcard } from '../utils/sm2';

type ReadingPhase = 'idle' | 'active' | 'enriching' | 'preview';

interface Props {
  onCardsGenerated: (cards: Partial<Flashcard>[]) => void;
  onError: (msg: string) => void;
}

const BATCH_SIZE = 15;

export default function ReadingMode({ onCardsGenerated, onError }: Props) {
  const [phase, setPhase] = useState<ReadingPhase>('idle');
  const [collectedWords, setCollectedWords] = useState<CollectedWord[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [enrichProgress, setEnrichProgress] = useState('');
  const [manualInput, setManualInput] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track in-flight lookups to avoid duplicate additions
  const pendingLookupsRef = useRef(new Set<string>());

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2000);
  }, []);

  const addWord = useCallback(async (word: string) => {
    const normalized = word.toLowerCase().replace(/[^a-z'-]/g, '').trim();
    if (!normalized || normalized.length < 2) return;

    // Check duplicate against current state and pending lookups
    if (pendingLookupsRef.current.has(normalized)) return;
    pendingLookupsRef.current.add(normalized);

    try {
      // Check duplicate against state (need to read latest)
      let isDuplicate = false;
      setCollectedWords(prev => {
        if (prev.some(w => w.word === normalized)) {
          isDuplicate = true;
          return prev;
        }
        return prev;
      });
      if (isDuplicate) {
        showToast(`"${normalized}" already added`);
        return;
      }

      const definitions = await lookupWord(normalized);

      setCollectedWords(prev => {
        // Double-check dedup after async gap
        if (prev.some(w => w.word === normalized)) {
          return prev;
        }

        if (!definitions) {
          showToast(`"${normalized}" not found (will be looked up later)`);
          return [{ word: normalized, definitions: [], timestamp: Date.now() }, ...prev];
        }

        return [{ word: normalized, definitions, timestamp: Date.now() }, ...prev];
      });
    } finally {
      pendingLookupsRef.current.delete(normalized);
    }
  }, [showToast]);

  const removeWord = useCallback((word: string) => {
    setCollectedWords(prev => prev.filter(w => w.word !== word));
  }, []);

  const { isListening, currentInterim, start: startListening, stop: stopListening, isSupported } =
    useContinuousSpeech({ onWord: addWord, pauseDelay: 2000 });

  const handleStart = () => {
    setPhase('active');
    startListening();
  };

  const handleManualAdd = () => {
    const word = manualInput.trim();
    if (word) {
      addWord(word);
      setManualInput('');
    }
  };

  const handleFinish = async () => {
    stopListening();

    if (collectedWords.length === 0) return;

    setPhase('enriching');
    const words = collectedWords.map(w => w.word);

    try {
      const allCards: Partial<Flashcard>[] = [];
      const batches: string[][] = [];

      for (let i = 0; i < words.length; i += BATCH_SIZE) {
        batches.push(words.slice(i, i + BATCH_SIZE));
      }

      for (let i = 0; i < batches.length; i++) {
        setEnrichProgress(
          batches.length > 1
            ? `Processing batch ${i + 1} of ${batches.length}...`
            : `Processing ${words.length} words...`
        );

        const { data, error: fnError } = await supabase.functions.invoke('generate-flashcards', {
          body: { words: batches[i] }
        });

        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);

        if (data?.cards && Array.isArray(data.cards)) {
          const processed = data.cards.map((json: any) => ({
            front: json.front,
            back: json.back,
            pronunciation: json.pronunciation,
            tone: json.tone,
            synonyms: Array.isArray(json.synonyms) ? json.synonyms.join(', ') : json.synonyms,
            word_forms: json.word_forms,
            examples: json.examples,
            other_meanings: json.other_meanings,
          }));
          allCards.push(...processed);
        }
      }

      onCardsGenerated(allCards);
      setPhase('preview');
    } catch (err: any) {
      onError('Enrichment failed: ' + (err.message || 'Unknown error'));
      setPhase('active');
    }
  };

  // ─── IDLE PHASE ───
  if (phase === 'idle') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '40px 0',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          background: 'rgba(99, 102, 241, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)"
               strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
            Reading Mode
          </h3>
          <p style={{
            margin: 0,
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            maxWidth: '340px',
          }}>
            Look up words while you read. Say any English word and get its meaning instantly.
            When you're done, all words will be turned into flashcards.
          </p>
        </div>

        <button
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 'var(--radius)',
            background: 'var(--accent)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
          }}
        >
          Start Reading Session
        </button>
      </div>
    );
  }

  // ─── ENRICHING PHASE ───
  if (phase === 'enriching') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '60px 0',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'addcard-spin 0.8s linear infinite',
        }} />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {enrichProgress || `Processing ${collectedWords.length} words with Claude...`}
        </span>
      </div>
    );
  }

  // ─── PREVIEW PHASE ───
  if (phase === 'preview') {
    return null;
  }

  // ─── ACTIVE PHASE ───
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minHeight: '400px',
    }}>
      {/* Listening indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        background: isListening
          ? 'rgba(99, 102, 241, 0.1)'
          : 'rgba(255,255,255,0.04)',
        borderRadius: '16px',
        border: `1px solid ${isListening ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.08)'}`,
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: isListening ? 'var(--accent)' : 'var(--text-muted)',
          animation: isListening ? 'reading-pulse 1.5s ease-in-out infinite' : 'none',
          flexShrink: 0,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {isListening ? (
            <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>
              Listening...
              {currentInterim && (
                <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
                  {' '}{currentInterim}
                </span>
              )}
            </span>
          ) : !isSupported ? (
            <span style={{ color: 'var(--warning)', fontSize: '0.85rem' }}>
              Speech not supported — type words below
            </span>
          ) : (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Mic paused
            </span>
          )}
        </div>

        {isSupported && (
          <button
            onClick={isListening ? stopListening : startListening}
            style={{
              background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              color: isListening ? '#ef4444' : 'var(--accent)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {isListening ? 'Pause' : 'Resume'}
          </button>
        )}
      </div>

      {/* Manual input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleManualAdd(); }}
          placeholder="Type a word..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'var(--card-bg)',
            color: 'white',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <button
          onClick={handleManualAdd}
          disabled={!manualInput.trim()}
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            background: manualInput.trim() ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
            color: manualInput.trim() ? 'white' : 'var(--text-muted)',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: manualInput.trim() ? 'pointer' : 'default',
          }}
        >
          +
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: '10px 16px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              borderRadius: '12px',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word count */}
      {collectedWords.length > 0 && (
        <div style={{
          color: 'var(--text-secondary)',
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {collectedWords.length} word{collectedWords.length !== 1 ? 's' : ''} collected
        </div>
      )}

      {/* Collected words list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '50vh',
      }}>
        <AnimatePresence initial={false}>
          {collectedWords.map(item => (
            <motion.div
              key={item.word}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                    {item.word}
                  </span>
                  {item.definitions[0]?.pos && (
                    <span style={{
                      padding: '2px 7px',
                      borderRadius: '6px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--accent)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}>
                      {item.definitions[0].pos}
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '0.83rem',
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.definitions[0]?.def || 'Looking up...'}
                </div>
              </div>

              <button
                onClick={() => removeWord(item.word)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fca5a5',
                  padding: '6px 10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {collectedWords.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}>
            Say a word or type it above to look it up
          </div>
        )}
      </div>

      {/* Finish button */}
      <button
        onClick={handleFinish}
        disabled={collectedWords.length === 0}
        style={{
          position: 'sticky',
          bottom: '0',
          width: '100%',
          padding: '18px',
          borderRadius: 'var(--radius)',
          background: collectedWords.length > 0 ? 'var(--success)' : 'rgba(255,255,255,0.06)',
          color: collectedWords.length > 0 ? 'white' : 'var(--text-muted)',
          fontWeight: 700,
          fontSize: '1rem',
          border: 'none',
          cursor: collectedWords.length > 0 ? 'pointer' : 'default',
          boxShadow: collectedWords.length > 0 ? '0 8px 24px rgba(16, 185, 129, 0.25)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {collectedWords.length > 0
          ? `Finish Reading (${collectedWords.length} words)`
          : 'Finish Reading'}
      </button>

      <style>{`
        @keyframes reading-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
