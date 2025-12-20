import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BookMode({ onSaveCard, onExit }: { onSaveCard: (term: string, def: string) => void, onExit: () => void }) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [result, setResult] = useState<{ term: string, def: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const recognitionRef = useRef<any>(null);

    const startRecording = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Mic not supported");
            return;
        }
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            handleLookup(text);
        };

        recognitionRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleLookup = async (text: string) => {
        setLoading(true);
        // TODO: Integrate LLM here. For now, mocking logic.
        // User asked for "Free LLM API". 
        // We will simulate it or use a public dictionary API as fallback for V1?
        // Or actually confirm if we should prompt user for a key? 
        // For this V0 implementation, I'll put a placeholder that says "Connect Key".
        
        setTimeout(() => {
            setResult({
                term: text,
                def: `[AI Placeholder Definition]: ${text}`
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
             <button onClick={onExit} style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem' }}>← Back</button>
             
             <h2 style={{ color: '#fff', marginBottom: '40px' }}>📖 Book Mode</h2>
             
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                 {loading ? (
                     <div style={{ color: '#aaa' }}>Looking up... 🤖</div>
                 ) : result ? (
                     <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', maxWidth: '300px', width: '100%', textAlign: 'center' }}>
                         <h3 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: '#38bdf8' }}>{result.term}</h3>
                         <p style={{ color: '#ddd' }}>{result.def}</p>
                         <button 
                             onClick={() => { onSaveCard(result.term, result.def); setResult(null); setTranscript(''); }}
                             style={{ background: '#10b981', border: 'none', padding: '12px 24px', borderRadius: '8px', color: '#fff', fontWeight: 'bold', marginTop: '20px', width: '100%' }}
                         >
                             Save to Deck
                         </button>
                         <button 
                             onClick={() => setResult(null)}
                             style={{ background: 'transparent', border: 'none', color: '#aaa', marginTop: '10px' }}
                         >
                             Discard
                         </button>
                     </div>
                 ) : (
                     <div style={{ color: '#64748b' }}>Hold button to define word...</div>
                 )}
             </div>

             {/* BIG MIC BUTTON */}
             <motion.button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                whileTap={{ scale: 0.9 }}
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: isRecording ? '#ef4444' : '#3b82f6',
                    border: '4px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '3rem',
                    marginBottom: '60px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
             >
                 🎤
             </motion.button>
        </div>
    );
}
