import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

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
        setResult(null);
        
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
            const prompt = `
                I am learning English. I just heard the word or phrase: "${text}".
                
                Please act as a dictionary and provide:
                1. The corrected term (if I mispronounced it slightly).
                2. A concise definition in English.
                3. A clear example sentence.
                4. The Persian (Farsi) translation of the term.
                
                Format the output exactly like this:
                Term: [Corrected Term]
                Definition: [Definition]
                Example: [Example]
                Persian: [Persian Translation]
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const textResponse = response.text();
            
            // Parse response (Simple regex or split)
            const termMatch = textResponse.match(/Term:\s*(.*)/i);
            const defMatch = textResponse.match(/Definition:\s*(.*)/i);
            const exMatch = textResponse.match(/Example:\s*(.*)/i);
            const faMatch = textResponse.match(/Persian:\s*(.*)/i);

            const term = termMatch ? termMatch[1].trim() : text;
            const def = `
**Def**: ${defMatch ? defMatch[1].trim() : 'N/A'}
**Ex**: ${exMatch ? exMatch[1].trim() : 'N/A'}
**Farsi**: ${faMatch ? faMatch[1].trim() : 'N/A'}
            `.trim();

            setResult({ term, def });

        } catch (error) {
            console.error("Gemini Error:", error);
            alert("AI Lookup failed. check API Key or Internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
             <button onClick={onExit} style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10 }}>← Back</button>
             
             {!result && !loading && (
                 <div style={{ textAlign: 'center', marginBottom: '40px', opacity: 0.7 }}>
                     <h2 style={{ color: '#fff', margin: 0 }}>📖 Book Mode</h2>
                     <p style={{ color: '#94a3b8', marginTop: '8px' }}>Hold the mic to ask for a word.</p>
                 </div>
             )}
             
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                 {loading ? (
                     <div style={{ color: '#aaa', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                         <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                         Looking up "{transcript}"...
                     </div>
                 ) : result ? (
                     <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '24px', maxWidth: '340px', width: '100%', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                         <h3 style={{ fontSize: '2rem', margin: '0 0 16px 0', color: '#38bdf8', fontFamily: 'serif' }}>{result.term}</h3>
                         <div style={{ textAlign: 'left', color: '#e2e8f0', lineHeight: '1.6', fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                             {result.def.replace(/\*\*/g, '').replace(/Def:/, '📖').replace(/Ex:/, '💡').replace(/Farsi:/, '🇮🇷')}
                         </div>
                         
                         <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                            <button 
                                onClick={() => setResult(null)}
                                style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px', color: '#aaa', cursor: 'pointer' }}
                            >
                                Discard
                            </button>
                            <button 
                                onClick={() => { onSaveCard(result.term, result.def); setResult(null); setTranscript(''); }}
                                style={{ flex: 1, background: '#10b981', border: 'none', padding: '12px', borderRadius: '12px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Save (+Card)
                            </button>
                         </div>
                     </div>
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
