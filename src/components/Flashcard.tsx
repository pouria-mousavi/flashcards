import { motion } from 'framer-motion';
import type { Flashcard as IFlashcard } from '../utils/sm2';
import { useState, useEffect } from 'react';

interface Props {
  card: IFlashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onSaveNote: (cardId: string, note: string) => Promise<void>;
  onPlayAudio: () => void;
  onDelete: () => void;
}

export default function Flashcard({ card, isFlipped, onFlip, onSaveNote, onPlayAudio, onDelete }: Props) {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(card.user_notes || '');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
     setNoteText(card.user_notes || '');
  }, [card.id, card.user_notes]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = false;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setNoteText(prev => (prev + ' ' + finalTranscript).trim());
            }
        };

        recog.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsRecording(false);
        };

        recog.onend = () => {
             setIsRecording(false);
        };

        setRecognition(recog);
    }
  }, []);

  const toggleRecording = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!recognition) {
          alert("Speech recognition not supported in this browser.");
          return;
      }

      if (isRecording) {
          recognition.stop();
          setIsRecording(false);
      } else {
          try {
            recognition.start();
            setIsRecording(true);
          } catch(err) {
              console.error(err);
              setIsRecording(false);
          }
      }
  };

  const handleSave = async (e: React.MouseEvent) => {
      e.stopPropagation();
      await onSaveNote(card.id, noteText);
      setIsNoteOpen(false);
  };

  if (!card) return null;

  const toneColor = (() => {
      const t = (card.tone || '').toLowerCase();
      if (t === 'formal') return { bg: 'rgba(99, 102, 241, 0.12)', text: '#a5b4fc' };
      if (t === 'informal') return { bg: 'rgba(245, 158, 11, 0.12)', text: '#fbbf24' };
      if (t === 'slang') return { bg: 'rgba(239, 68, 68, 0.12)', text: '#fca5a5' };
      return { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-muted)' };
  })();

  return (
    <div style={{ perspective: 1000, width: '92vw', maxWidth: '400px' }} onClick={onFlip}>
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
        style={{
          width: '100%',
          minHeight: '380px',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* FRONT (Persian) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 24px',
            border: '1px solid var(--border)',
            zIndex: 2
          }}
        >
          {(() => {
              const [persianText, englishHint] = (card.front || '').split('===HINT===');
              const textLen = persianText?.trim().length || 0;
              return (
                  <>
                    <h2 style={{
                        fontSize: textLen > 50 ? '1.3rem' : (textLen > 20 ? '1.7rem' : '2.2rem'),
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: '1.5',
                        fontFamily: 'Vazirmatn, sans-serif',
                        fontWeight: '700',
                        padding: '0 8px',
                        wordWrap: 'break-word',
                        width: '100%',
                        direction: 'rtl'
                    }}>
                        {persianText?.trim() || 'Invalid Card'}
                    </h2>

                    {englishHint && (
                        <div style={{
                            marginTop: '20px',
                            borderTop: '1px solid var(--border)',
                            paddingTop: '14px',
                            width: '85%',
                            textAlign: 'center'
                        }}>
                            <span style={{
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'var(--text-muted)',
                                fontWeight: '600'
                            }}>
                                Hint
                            </span>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)',
                                margin: '6px 0 0',
                                fontStyle: 'italic',
                                lineHeight: '1.5'
                            }}>
                                {englishHint.trim()}
                            </p>
                        </div>
                    )}
                  </>
              );
          })()}

          <p style={{
              marginTop: 'auto',
              paddingTop: '16px',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: '500',
              letterSpacing: '0.05em'
          }}>
            TAP TO REVEAL
          </p>
        </div>

        {/* BACK (English) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '380px',
            backfaceVisibility: 'hidden',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--card-shadow)',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            paddingBottom: '100px',
            border: '1px solid var(--border)',
          }}
        >
          {/* Top bar */}
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginBottom: '12px'
          }}>
             <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {card.tone && (
                    <span style={{
                        background: toneColor.bg,
                        color: toneColor.text,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                    }}>
                        {card.tone}
                    </span>
                )}
                {card.native_speaking && (
                    <span style={{
                        background: 'var(--success-soft)',
                        color: 'var(--success)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        letterSpacing: '0.04em'
                    }}>
                        NATIVE
                    </span>
                )}
             </div>
             <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                style={{
                    background: 'var(--danger-soft)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fca5a5',
                    padding: '4px 8px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                }}
             >
                 Delete
             </button>
          </div>

          {!isNoteOpen ? (
              <>
                {/* Word */}
                <h3 style={{
                    fontSize: (card.back?.length || 0) > 40 ? '1.3rem' : '1.8rem',
                    margin: '0 0 4px 0',
                    color: 'var(--text-primary)',
                    fontWeight: '800',
                    lineHeight: '1.3',
                    letterSpacing: '-0.02em'
                }}>
                    {card.back || 'No Definition'}
                </h3>

                {/* Pronunciation */}
                {card.pronunciation && (
                    <div style={{
                        fontSize: '0.9rem',
                        color: 'var(--accent)',
                        fontFamily: "'Inter', monospace",
                        marginBottom: '12px',
                        fontWeight: '500'
                    }}>
                        /{card.pronunciation}/
                    </div>
                )}

                {/* Word Forms */}
                {card.word_forms && Object.values(card.word_forms).some(v => !!v) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                        {Object.entries(card.word_forms).map(([pos, val]) => (
                            val && typeof val === 'string' && (
                                <div key={pos} style={{
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '4px'
                                }}>
                                    <span style={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.6rem',
                                        color: 'var(--text-muted)',
                                        fontWeight: '700',
                                        letterSpacing: '0.04em'
                                    }}>
                                        {pos}
                                    </span>
                                    <span>{val}</span>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0 12px' }} />

                {/* Examples */}
                {card.examples && card.examples.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                        {card.examples.slice(0, 3).map((ex, i) => (
                            <p key={i} style={{
                                margin: '0 0 8px',
                                fontSize: '0.85rem',
                                lineHeight: '1.5',
                                color: 'var(--text-secondary)',
                                paddingLeft: '10px',
                                borderLeft: '2px solid var(--border)'
                            }}>
                                {ex}
                            </p>
                        ))}
                    </div>
                )}

                {/* Other Meanings */}
                {card.other_meanings && card.other_meanings.length > 0 && (
                    <div style={{
                        marginBottom: '12px',
                        padding: '10px',
                        background: 'rgba(99, 102, 241, 0.06)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(99, 102, 241, 0.1)'
                    }}>
                        <span style={{
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'var(--text-muted)',
                            fontWeight: '700',
                            display: 'block',
                            marginBottom: '6px'
                        }}>
                            Also means
                        </span>
                        {card.other_meanings.map((m, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.82rem',
                                marginBottom: i < card.other_meanings!.length - 1 ? '4px' : 0
                            }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{m.english}</span>
                                <span style={{
                                    color: 'var(--text-muted)',
                                    fontFamily: 'Vazirmatn, sans-serif',
                                    direction: 'rtl',
                                    fontSize: '0.85rem'
                                }}>{m.persian}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* User note */}
                {card.user_notes && (
                     <div style={{
                         padding: '10px 12px',
                         background: 'rgba(245, 158, 11, 0.08)',
                         borderRadius: 'var(--radius-sm)',
                         borderLeft: '3px solid var(--warning)'
                     }}>
                         <small style={{
                             color: 'var(--warning)',
                             display: 'block',
                             marginBottom: '4px',
                             fontSize: '0.65rem',
                             fontWeight: '700',
                             textTransform: 'uppercase',
                             letterSpacing: '0.08em'
                         }}>Your Note</small>
                         <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                             {card.user_notes}
                         </div>
                     </div>
                )}

                 {/* Bottom action buttons */}
                 <div style={{
                     position: 'absolute',
                     bottom: '20px',
                     left: '0',
                     width: '100%',
                     display: 'flex',
                     justifyContent: 'center',
                     gap: '12px',
                     padding: '0 24px',
                     boxSizing: 'border-box'
                 }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onPlayAudio(); }}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--border)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        &#9834;
                    </button>

                    <button
                         onClick={(e) => { e.stopPropagation(); setIsNoteOpen(true); }}
                         style={{
                             background: card.user_notes ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.06)',
                             border: `1px solid ${card.user_notes ? 'rgba(245, 158, 11, 0.2)' : 'var(--border)'}`,
                             borderRadius: '50%',
                             width: '48px',
                             height: '48px',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             fontSize: '1.1rem',
                             cursor: 'pointer',
                             color: card.user_notes ? 'var(--warning)' : 'var(--text-secondary)'
                         }}
                    >
                        &#9998;
                    </button>
                 </div>
              </>
          ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--warning)', fontSize: '0.9rem', fontWeight: '700' }}>
                      Add Note
                  </h4>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Type or speak..."
                    style={{
                        flex: 1,
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        padding: '12px',
                        fontSize: '0.95rem',
                        resize: 'none',
                        outline: 'none',
                        marginBottom: '10px',
                        minHeight: '100px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px', height: '48px' }}>
                      <button
                        onClick={toggleRecording}
                        style={{
                            flex: 1,
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: isRecording ? 'var(--danger)' : 'var(--accent)',
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                      >
                          {isRecording ? 'Stop' : 'Record'}
                      </button>

                      <button
                        onClick={handleSave}
                        style={{
                            flex: 1,
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: 'var(--success)',
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                      >
                          Save
                      </button>
                  </div>
                  <button
                     onClick={(e) => { e.stopPropagation(); setIsNoteOpen(false); }}
                     style={{
                         background: 'transparent',
                         border: 'none',
                         color: 'var(--text-muted)',
                         marginTop: '8px',
                         cursor: 'pointer',
                         fontSize: '0.85rem',
                         fontWeight: '500'
                     }}
                  >
                      Cancel
                  </button>
              </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
