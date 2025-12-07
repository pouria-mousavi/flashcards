import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Flashcard as IFlashcard } from '../utils/sm2';

interface Props {
  card: IFlashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ card, isFlipped, onFlip }: Props) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
        setAvailableVoices(voices);
        
        // Try to load saved preference
        const saved = localStorage.getItem('preferred_voice_uri');
        if (saved) {
            const hit = voices.find(v => v.voiceURI === saved);
            if (hit) {
                setVoice(hit);
                return;
            }
        }

        // Fallback priority
        const preferred = voices.find(v => v.name === 'Google US English') ||
                          voices.find(v => v.name === 'Samantha') ||
                          voices[0];
        if (preferred) setVoice(preferred);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleTTS = (e: React.MouseEvent) => {
      e.stopPropagation(); // Don't flip
      const u = new SpeechSynthesisUtterance(card.back);
      u.lang = 'en-US';
      if (voice) u.voice = voice;
      window.speechSynthesis.speak(u);
  };

  const cycleVoice = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (availableVoices.length === 0) return;
      
      const idx = availableVoices.findIndex(v => v === voice);
      const nextIdx = (idx + 1) % availableVoices.length;
      const nextVoice = availableVoices[nextIdx];
      
      setVoice(nextVoice);
      localStorage.setItem('preferred_voice_uri', nextVoice.voiceURI);
      
      // Announce the new voice
      const u = new SpeechSynthesisUtterance("Voice changed to " + nextVoice.name);
      u.voice = nextVoice;
      window.speechSynthesis.speak(u);
  };

  return (
    <div className="card-container" style={{ perspective: 1000, cursor: 'pointer' }} onClick={onFlip}>
      <motion.div
        className="card-inner"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{
          width: '320px',
          height: '480px',
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
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            PERSIAN
          </span>
          <h2 style={{ 
              fontSize: card.front.length > 50 ? '1.5rem' : (card.front.length > 20 ? '2rem' : '2.5rem'), 
              textAlign: 'center', 
              margin: 0, 
              lineHeight: '1.4',
              fontFamily: 'Vazirmatn, sans-serif', // Explicitly Persian
              padding: '0 20px',
              wordWrap: 'break-word',
              width: '100%'
          }}>
            {card.front}
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
          {/* Header with TTS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '10px' }}>
             <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>
                ENGLISH
             </span>
             <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                    onClick={cycleVoice}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '20px', // pill shape
                        padding: '0 12px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.8rem'
                    }}
                >
                    {voice ? voice.name.slice(0, 8) + '..' : 'Voice'} 🔁
                </button>
                <button 
                    onClick={handleTTS}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                    }}
                >
                    🔊
                </button>
             </div>
          </div>

          <h3 style={{ 
              fontSize: card.back.length > 50 ? '1.4rem' : '2rem', 
              margin: '0 0 16px 0', 
              color: '#fff', 
              fontWeight: '800',
              lineHeight: '1.3'
          }}>
            {card.back}
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
        </div>
      </motion.div>
    </div>
  );
}
