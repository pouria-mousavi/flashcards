import { motion } from 'framer-motion';
import type { Flashcard as IFlashcard } from '../utils/sm2';
import { useState, useEffect } from 'react';

interface Props {
  card: IFlashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onSaveNote: (cardId: string, note: string) => Promise<void>;
}

export default function Flashcard({ card, isFlipped, onFlip, onSaveNote }: Props) {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(card.user_notes || '');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null); // Use any to avoid TS errors for experimental API

  useEffect(() => {
     setNoteText(card.user_notes || '');
  }, [card.id, card.user_notes]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US'; // Default to English for notes, or let user speak freely? Best start with English for "Add example".
        
        recog.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setNoteText(prev => prev + ' ' + finalTranscript);
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
          recognition.start();
          setIsRecording(true);
      }
  };
  
  const handleSave = async (e: React.MouseEvent) => {
      e.stopPropagation();
      await onSaveNote(card.id, noteText);
      setIsNoteOpen(false);
  };
  
  if (!card) return null; // Safety check

  return (
    <div className="card-container" style={{ perspective: 1000, cursor: 'pointer' }} onClick={onFlip}>
      <motion.div
        className="card-inner"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{
          width: '90vw',
          maxWidth: '340px',
          height: '65vh',
          maxHeight: '520px',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#1E1E1E', // Darker Noji-like
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
          <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
             <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsNoteOpen(true); 
                    if (!isFlipped) onFlip(); // Flip to back if currently on front
                }} 
                style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
             >
                📝
             </button>
          </div>

          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            PERSIAN
          </span>
          <h2 style={{ 
              fontSize: (card.front?.length || 0) > 50 ? '1.5rem' : ((card.front?.length || 0) > 20 ? '2rem' : '2.5rem'), 
              textAlign: 'center', 
              margin: 0, 
              lineHeight: '1.4',
              fontFamily: 'Vazirmatn, sans-serif', // Explicitly Persian
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

        {/* BACK */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#18181b', // Slightly darker back
            color: '#fff',
            borderRadius: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            boxSizing: 'border-box',
            border: '1px solid rgba(255,255,255,0.08)',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '10px' }}>
             <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>
                ENGLISH
             </span>
             {/* Note Toggle Button */}
             <button 
                onClick={(e) => { e.stopPropagation(); setIsNoteOpen(!isNoteOpen); }}
                style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    color: isNoteOpen || card.user_notes ? 'var(--accent, #f472b6)' : '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    zIndex: 10
                }}
             >
                {isNoteOpen ? '❌ Close' : (card.user_notes ? '📝 Edit Note' : '➕ Note')}
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
                        background: (() => {
                            switch(card.tone.toLowerCase()) {
                                case 'formal': return 'rgba(99, 102, 241, 0.2)'; // Indigo
                                case 'informal': return 'rgba(236, 72, 153, 0.2)'; // Pink
                                case 'curse': return 'rgba(239, 68, 68, 0.2)'; // Red
                                default: return 'rgba(255,255,255,0.1)';
                            }
                        })(),
                        color: (() => {
                            switch(card.tone.toLowerCase()) {
                                case 'formal': return '#818cf8';
                                case 'informal': return '#f472b6'; 
                                case 'curse': return '#f87171';
                                default: return '#9ca3af';
                            }
                        })(),
                        padding: '4px 10px', 
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                        }}>
                            {card.tone.toUpperCase()}
                        </span>
                    )}
                    {card.synonyms && (
                        <span style={{ 
                            background: 'rgba(255,255,255,0.05)', 
                            color: '#9ca3af',
                            padding: '4px 10px', 
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontStyle: 'italic'
                        }}>
                            Syn: {card.synonyms}
                        </span>
                    )}
                </div>

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
                
                {/* Note Preview if exists but closed */}
                {card.user_notes && (
                     <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,200,0,0.1)', borderRadius: '8px', borderLeft: '3px solid gold' }}>
                         <small style={{ color: 'gold', display: 'block', marginBottom: '4px' }}>YOUR NOTE:</small>
                         <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#eee' }}>{card.user_notes}</div>
                     </div>
                )}
              </>
          ) : (
              // NOTE EDITOR MODE
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#f472b6' }}>Add Voice Note</h4>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Speak or type translation corrections here..."
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
                  <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={toggleRecording}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: isRecording ? '#ef4444' : '#3b82f6',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                      >
                          {isRecording ? 'Listening... (Stop)' : '🎤 Start Mic'}
                      </button>
                      
                      <button
                        onClick={handleSave}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#10b981',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                      >
                          Save Note
                      </button>
                  </div>
                  <button 
                     onClick={(e) => { e.stopPropagation(); setIsNoteOpen(false); }}
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
