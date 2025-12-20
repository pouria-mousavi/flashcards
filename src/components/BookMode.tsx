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
    const [queue, setQueue] = useState<string[]>([]);
    const [batchResults, setBatchResults] = useState<any[] | null>(null);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
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

        } catch (error: any) {
            console.error("Gemini Error:", error);
            // If Rate Limit (429) or Network Error (fetch failed), Queue it
            if (error.message?.includes('429') || error.message?.includes('fetch') || error.message?.includes('Quota')) {
                 setQueue(prev => [...prev, text]);
                 alert(`⚠️ API Busy (429). "${text}" added to Queue!`);
            } else {
                 alert("AI Lookup failed. check API Key or Internet.");
            }
        } finally {
            setLoading(false);
        }
    };

    const processBatch = async () => {
         if (queue.length === 0) return;
         setIsBatchProcessing(true);
         
         try {
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest"});
            const prompt = `
                I have a list of words/phrases: ${JSON.stringify(queue)}.
                
                For EACH word, act as a dictionary and provide:
                1. Corrected term.
                2. Concise Definition.
                3. Example sentence.
                4. Persian translation.
                
                Return ONLY a JSON Array of objects:
                [
                  { "term": "...", "def": "...", "example": "...", "persian": "..." }
                ]
            `;
            
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(text);
            
            // Format for UI
            const formatted = data.map((item: any) => ({
                term: item.term,
                def: `📖 ${item.def}\n💡 ${item.example}\n🇮🇷 ${item.persian}`
            }));
            
            setBatchResults(formatted);
            setQueue([]); 
            
         } catch (e: any) {
             console.error("Batch Error:", e);
             alert("Batch process failed. Try again later.");
         } finally {
             setIsBatchProcessing(false);
         }
    };

    const saveAllBatch = () => {
        if (!batchResults) return;
        batchResults.forEach(r => onSaveCard(r.term, r.def));
        setBatchResults(null); 
        alert("Saved all items!");
    };

    return (
        <div style={{ padding: '20px', height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', position: 'relative' }}>
             <button onClick={onExit} style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10 }}>← Back</button>

             {/* QUEUE FLOB */}
             {queue.length > 0 && !batchResults && (
                 <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={processBatch}
                    disabled={isBatchProcessing}
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        background: isBatchProcessing ? '#94a3b8' : '#f59e0b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        zIndex: 20,
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                    }}
                 >
                     {isBatchProcessing ? "Processing..." : `📂 Process Queue (${queue.length})`}
                 </motion.button>
             )}

             {/* BATCH RESULTS MODAL */}
             {batchResults && (
                 <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 50, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <h2 style={{ color: '#fff' }}>Review Batch ({batchResults.length})</h2>
                     
                     <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                         {batchResults.map((item, idx) => (
                             <div key={idx} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', color: '#fff' }}>
                                 <h4 style={{ margin: '0 0 5px 0', color: '#38bdf8' }}>{item.term}</h4>
                                 <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#cbd5e1' }}>{item.def}</div>
                             </div>
                         ))}
                     </div>

                     <div style={{ display: 'flex', gap: '20px', marginTop: '20px', paddingBottom: '40px' }}>
                         <button 
                             onClick={() => setBatchResults(null)}
                             style={{ padding: '15px 30px', borderRadius: '12px', background: '#dc2626', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                         >
                             Discard All
                         </button>
                         <button 
                             onClick={saveAllBatch}
                             style={{ padding: '15px 30px', borderRadius: '12px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                         >
                             Confirm & Save All
                         </button>
                     </div>
                 </div>
             )}
             
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
