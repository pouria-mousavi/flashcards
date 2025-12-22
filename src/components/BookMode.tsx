import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function BookMode({ onExit }: { onSaveCard?: (term: string, def: string) => void, onExit: () => void }) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedWord, setSavedWord] = useState<string | null>(null);
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
            handleQueue(text);
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

    const handleQueue = async (text: string) => {
        setLoading(true);
        setSavedWord(null);
        
        try {
            const { error } = await supabase.from('book_queue').insert({ 
                word: text,
                status: 'PENDING'
            });

            if (error) throw error;

            setSavedWord(text);
            setTimeout(() => setSavedWord(null), 3000); // Hide success after 3s

        } catch (error: any) {
            console.error("Queue Error:", error);
            alert("Failed to save to queue. Check internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', position: 'relative' }}>
             <button onClick={onExit} style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10 }}>← Back</button>

             <div style={{ textAlign: 'center', marginBottom: '40px', opacity: 0.7 }}>
                 <h2 style={{ color: '#fff', margin: 0 }}>📖 Book Mode (Queue)</h2>
                 <p style={{ color: '#94a3b8', marginTop: '8px' }}>Hold mic to save words for later processing.</p>
             </div>
             
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                 {loading ? (
                     <div style={{ color: '#aaa', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                         <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                         Saving "{transcript}"...
                     </div>
                 ) : savedWord ? (
                     <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: '24px', maxWidth: '340px', width: '100%', textAlign: 'center', border: '1px solid #10b981' }}
                     >
                         <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: '#10b981' }}>Saved!</h3>
                         <p style={{ color: '#fff', fontSize: '1.2rem' }}>"{savedWord}"</p>
                         <small style={{ color: '#94a3b8' }}>Added to manual processing queue.</small>
                     </motion.div>
                 ) : null}
             </div>

             {/* BIG MIC BUTTON */}
             <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
             <motion.button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
                onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                    scale: isRecording ? 1.1 : 1,
                    boxShadow: isRecording ? '0 0 30px #ef4444' : '0 10px 30px rgba(0,0,0,0.5)'
                }}
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: isRecording ? '#ef4444' : '#3b82f6',
                    border: '4px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '2.5rem',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                }}
             >
                 🎤
             </motion.button>
        </div>
    );
}
