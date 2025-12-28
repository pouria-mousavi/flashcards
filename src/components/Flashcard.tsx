import { motion } from 'framer-motion';
import type { Flashcard as IFlashcard } from '../utils/sm2';
import { useState, useEffect } from 'react';

interface Props {
  card: IFlashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onSaveNote: (cardId: string, note: string) => Promise<void>;
  onPlayAudio: () => void; // Pass this down from StudySession to keep logic there
}

export default function Flashcard({ card, isFlipped, onFlip, onSaveNote, onPlayAudio }: Props) {
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
        recog.interimResults = false; // Fix: Only accept final results to avoid weird partials
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

  return (
    <div className="card-container" style={{ perspective: 1000 }} onClick={onFlip}>
      <motion.div
        className="card-inner"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{
          width: '90vw',
          maxWidth: '400px', // Increased from 340px
          height: '70vh', // Increased from 65vh
          maxHeight: '650px', // Increased from 520px
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* FRONT (Persian) */}
        <div
          style={{
            position: 'absolute',
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
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {/* Removed Front Note Button as requested */}
          
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            PERSIAN
          </span>
          <h2 style={{ 
              fontSize: (card.front?.length || 0) > 50 ? '1.5rem' : ((card.front?.length || 0) > 20 ? '2rem' : '2.5rem'), 
              textAlign: 'center', 
              margin: 0, 
              lineHeight: '1.4',
              fontFamily: 'Vazirmatn, sans-serif', 
              padding: '0 20px',
              wordWrap: 'break-word',
              width: '100%'
          }}>
            {card.front || 'Invalid Card'}
          </h2>
          <p style={{ marginTop: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
            Tap to flip
          </p>
        </div>

        {/* BACK (English) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#18181b', 
            color: '#fff',
            borderRadius: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            paddingBottom: '120px', // Increased from 100px for safety
            boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.08)',
            overflowY: 'auto'
             // Removed redundant position: relative (already absolute from top)
             // Wait, it WAS absolute. But I see 'position: absolute' at the top of the style object usually.
             // Let's just check the view output.
           }}
          // onClick={(e) => e.stopPropagation()} // Removed so user can flip back
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '10px' }}>
             <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>
                ENGLISH
             </span>
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

                {/* Word Forms Section (V17) */}
                {card.word_forms && Object.values(card.word_forms).some(v => !!v) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                        {Object.entries(card.word_forms).map(([pos, val]) => (
                            val && (
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
                    <ul style={{ paddingLeft: '16px', margin: 0, listStyle: 'circle' }}>
                        {card.examples.map((ex, i) => (
                        <li key={i} style={{ marginBottom: '12px', fontSize: '0.9rem', lineHeight: '1.5', color: '#d1d5db' }}>{ex}</li>
                        ))}
                    </ul>
                    </div>
                )}
                
                {card.user_notes && (
                     <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,200,0,0.1)', borderRadius: '8px', borderLeft: '3px solid gold' }}>
                         <small style={{ color: 'gold', display: 'block', marginBottom: '4px' }}>YOUR NOTE:</small>
                         <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#eee' }}>{card.user_notes}</div>
                     </div>
                )}

                 {/* FOOTER BUTTONS (Speaker + Note) */}
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
              // NOTE EDITOR MODE
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
