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
  
  // Clean example helper
  const cleanExample = (ex: string) => {
      const match = ex.match(/\(([^)]+)\)$/);
      if (match) return match[1];
      return ex;
  };

  if (!card) return null;

  return (
    <div className="card-container" style={{ perspective: 1000 }} onClick={onFlip}>
      <motion.div
        className="card-inner"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{
          width: '90vw',
          maxWidth: '400px', 
          minHeight: '400px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          paddingBottom: '0px'
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
            backgroundColor: '#1E1E1E', 
            color: '#ffffff',
            borderRadius: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px',
            boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.08)',
            zIndex: 2
          }}
        >
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            PERSIAN
          </span>
          {(() => {
              const [persianTextRaw, englishHintRaw] = (card.front || '').split('===HINT===');
              const persianText = persianTextRaw?.trim() || 'Invalid Card';
              // Prefer explicit front_definition, fallback to HINT split
              const definition = card.front_definition || englishHintRaw?.trim();

              return (
                  <>
                    <h2 style={{ 
                        fontSize: (persianText.length || 0) > 50 ? '1.5rem' : ((persianText.length || 0) > 20 ? '2rem' : '2.5rem'), 
                        textAlign: 'center', 
                        margin: 0, 
                        lineHeight: '1.4',
                        fontFamily: 'Vazirmatn, sans-serif', 
                        padding: '0 20px',
                        wordWrap: 'break-word',
                        width: '100%'
                    }}>
                        {persianText}
                    </h2>

                    {definition && (
                        <div style={{
                            marginTop: '24px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '16px',
                            width: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.3)' }}>
                                Definition
                            </span>
                            <p style={{
                                fontSize: '0.95rem',
                                color: 'rgba(255,255,255,0.7)',
                                margin: 0,
                                textAlign: 'center',
                                fontFamily: '"Outfit", sans-serif',
                                fontStyle: 'italic',
                                lineHeight: '1.4'
                            }}>
                                {definition}
                            </p>
                        </div>
                    )}
                  </>
              );
          })()}
          

          <p style={{ marginTop: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
            Tap to flip
          </p>
        </div>

        {/* BACK (English) */}
        <div
          style={{
            position: 'relative', 
            width: '100%',
            minHeight: '400px', 
            backfaceVisibility: 'hidden',
            backgroundColor: '#18181b', 
            color: '#fff',
            borderRadius: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            paddingBottom: '32px',
            boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.08)',
           }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '10px' }}>
             <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>
                ENGLISH
             </span>
             {/* Delete Button */}
             <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    color: '#fca5a5',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
             >
                 🗑️ Delete
             </button>
          </div>

          {!isNoteOpen ? (
              <>
                <h3 style={{ 
                    fontSize: (card.back?.length || 0) > 50 ? '1.4rem' : '2rem', 
                    margin: '0 0 16px 0', 
                    color: '#fff', 
                    fontWeight: '800',
                    lineHeight: '1.3'
                }}>
                    {card.back || 'No Definition'}
                </h3>
                
                {card.pronunciation && (
                    <div style={{ fontSize: '1rem', color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '16px' }}>
                        {card.pronunciation}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {card.tone && (
                        <span style={{ 
                        background: 'rgba(255,255,255,0.1)',
                        color: '#9ca3af',
                        padding: '4px 10px', 
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        }}>
                            {card.tone.toUpperCase()}
                        </span>
                    )}
                </div>

                {card.word_forms && Object.values(card.word_forms).some(v => !!v) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                        {Object.entries(card.word_forms).map(([pos, val]) => (
                            val && typeof val === 'string' && (
                                <div key={pos} style={{ 
                                    background: 'rgba(255, 255, 255, 0.05)', 
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px', 
                                    padding: '6px 10px', 
                                    fontSize: '0.9rem', 
                                    color: '#e5e7eb',
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '6px'
                                }}>
                                    <span style={{ 
                                        textTransform: 'uppercase', 
                                        fontSize: '0.65rem', 
                                        color: '#9ca3af', 
                                        fontWeight: 'bold',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {pos}
                                    </span>
                                    <span style={{ fontFamily: 'monospace' }}>{val}</span>
                                </div>
                            )
                        ))}
                    </div>
                )}

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }} />

                {card.examples && card.examples.length > 0 && (
                    <div style={{ textAlign: 'left', marginTop: '16px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Examples</h4>
                    <ul style={{ paddingLeft: '16px', margin: 0, listStyle: 'circle' }}>
                        {card.examples.map((ex, i) => (
                        <li key={i} style={{ marginBottom: '12px', fontSize: '0.9rem', lineHeight: '1.5', color: '#d1d5db' }}>
                            {cleanExample(ex)}
                        </li>
                        ))}
                    </ul>
                    </div>
                )}

                {/* Other Meanings Section */}
                {(() => {
                    const meanings = card.other_meanings || card.word_forms?.other_meanings;
                    if (meanings && meanings.length > 0) {
                        return (
                            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Other Meanings</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {meanings.map((m: any, i: number) => (
                                        <div key={i} style={{ 
                                            background: 'rgba(255,255,255,0.05)', 
                                            padding: '10px', 
                                            borderRadius: '8px',
                                            fontSize: '0.9rem'
                                        }}>
                                            {typeof m === 'string' ? (
                                                <div style={{ color: '#e5e7eb' }}>{m}</div>
                                            ) : (
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                        {m.part_of_speech && (
                                                            <span style={{ 
                                                                fontSize: '0.7rem', 
                                                                background: 'rgba(255,255,255,0.1)', 
                                                                padding: '2px 6px', 
                                                                borderRadius: '4px',
                                                                color: '#9ca3af',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {m.part_of_speech}
                                                            </span>
                                                        )}
                                                        <span style={{ color: '#fff', fontWeight: '500' }}>{m.definition}</span>
                                                    </div>
                                                    {m.translation && (
                                                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>
                                                            {m.translation}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}
                
                {card.user_notes && (
                     <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,200,0,0.1)', borderRadius: '8px', borderLeft: '3px solid gold' }}>
                         <small style={{ color: 'gold', display: 'block', marginBottom: '4px' }}>YOUR NOTE:</small>
                         <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#eee' }}>{card.user_notes}</div>
                     </div>
                )}

                 <div style={{ height: '140px', flexShrink: 0, width: '100%' }} />

                 <div style={{ 
                     position: 'absolute', 
                     bottom: '20px', 
                     left: '0', 
                     width: '100%', 
                     display: 'flex', 
                     justifyContent: 'center', 
                     gap: '20px',
                     padding: '0 20px',
                     boxSizing: 'border-box'
                 }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onPlayAudio(); }}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#fff'
                        }}
                    >
                        🔊
                    </button>
                    
                    <button 
                         onClick={(e) => { e.stopPropagation(); setIsNoteOpen(true); }}
                         style={{
                             background: card.user_notes ? 'rgba(244, 114, 182, 0.2)' : 'rgba(255,255,255,0.1)',
                             border: `1px solid ${card.user_notes ? '#f472b6' : 'rgba(255,255,255,0.2)'}`,
                             borderRadius: '50%',
                             width: '60px',
                             height: '60px',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             fontSize: '1.5rem',
                             cursor: 'pointer',
                             color: card.user_notes ? '#f472b6' : '#fff'
                         }}
                    >
                        📝
                    </button>
                 </div>

              </>
          ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#f472b6' }}>Add Voice Note</h4>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Speak..."
                    style={{
                        flex: 1,
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        color: '#fff',
                        padding: '12px',
                        fontSize: '1rem',
                        resize: 'none',
                        outline: 'none',
                        marginBottom: '10px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', height: '60px' }}>
                      <button
                        onClick={toggleRecording}
                        style={{
                            flex: 1,
                            borderRadius: '12px',
                            border: 'none',
                            background: isRecording ? '#ef4444' : '#3b82f6',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                      >
                          {isRecording ? '🛑' : '🎤'}
                      </button>
                      
                      <button
                        onClick={handleSave}
                        style={{
                            flex: 1,
                            borderRadius: '12px',
                            border: 'none',
                            background: '#10b981',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                      >
                          💾
                      </button>
                  </div>
                  <button 
                     onClick={() => setIsNoteOpen(false)}
                     style={{
                         background: 'transparent', border: 'none', color: '#aaa', marginTop: '10px', cursor: 'pointer'
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
