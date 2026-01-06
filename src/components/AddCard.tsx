import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import type { Flashcard } from '../utils/sm2';

interface Props {
  onAdd: (card: Partial<Flashcard>) => void;
  onCancel: () => void;
}

// Keys should be in .env (VITE_CLAUDE_KEY)
const CLAUDE_KEY = import.meta.env.VITE_CLAUDE_KEY;
const MODEL = "claude-sonnet-4-5-20250929";

export default function AddCard({ onAdd, onCancel }: Props) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Partial<Flashcard>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const anthropic = new Anthropic({
        apiKey: CLAUDE_KEY,
        dangerouslyAllowBrowser: true 
      });

      // Split by newline or comma
      const words = inputText.split(/[,\n]+/).map(w => w.trim()).filter(Boolean);

      if (words.length === 0) return;

      // Reset
      setGeneratedCards([]);

      // Process in chunks of 4 to avoid token limits (4 * ~500 tokens approx 2000, safe within 4096)
      const CHUNK_SIZE = 4;
      for (let i = 0; i < words.length; i += CHUNK_SIZE) {
          const chunk = words.slice(i, i + CHUNK_SIZE);
          
          try {
              const prompt = `
              Analyze the following English words/phrases: ${JSON.stringify(chunk)}.
              For EACH word, generate a flashcard for a Persian learner.
              
              Output strictly a VALID JSON ARRAY of objects. Each object must have:
              - front: The natural, native Persian translation.
              - back: The English word/phrase (standardized).
              - pronunciation: English pronunciation/IPA (e.g., "/ˈdʒɛnɪsɪs/").
              - tone: "Formal", "Informal", "Slang", or "Neutral".
              - synonyms: Array of strings (Persian synonyms).
              - word_forms: Object with keys like "noun", "verb", "adj", "adv", "past", "pp" (if applicable).
              - examples: Array of strings. "Persian Sentence (English Translation)".

              RETURN ONLY THE JSON ARRAY. NO MARKDOWN.
              `;

              const msg = await anthropic.messages.create({
                model: MODEL,
                max_tokens: 4096, 
                messages: [{ role: "user", content: prompt }]
              });

              const content = (msg.content[0] as any).text;
              const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
              const result = JSON.parse(cleanJson);
              
              const cards = Array.isArray(result) ? result : [result];

              const processed = cards.map((json: any) => ({
                front: json.front,
                back: json.back,
                pronunciation: json.pronunciation,
                tone: json.tone,
                synonyms: Array.isArray(json.synonyms) ? json.synonyms.join(', ') : json.synonyms,
                word_forms: json.word_forms,
                examples: json.examples
              }));

              setGeneratedCards(prev => [...prev, ...processed]);

          } catch (chunkError: any) {
              console.error("Chunk failed", chunkError);
              setError(prev => (prev ? prev + "\n" : "") + `Failed to generate specific words: ${chunk.join(", ")}. Reason: ${chunkError.message}`);
              // Continue to next chunk
          }
      }

    } catch (err: any) {
      console.error(err);
      setError("Critical Error: " + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = () => {
    generatedCards.forEach(card => onAdd(card));
    setGeneratedCards([]);
    setInputText('');
  };

  const handleDiscard = () => {
      setGeneratedCards([]);
      setInputText('');
  };

  return (
    <div className="flex-center full-screen" style={{ flexDirection: 'column', background: 'var(--bg-color)', zIndex: 10, padding: '24px', overflowY: 'auto' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Add New Words</h2>
          <button onClick={onCancel} style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '1.5rem', border: 'none', cursor: 'pointer', padding: '8px' }}>✕</button>
      </div>

      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
          
          {/* Input Section */}
          {generatedCards.length === 0 && (
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '4px' }}>English Words (comma or newline separated)</label>
                    <textarea 
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        disabled={loading}
                        placeholder="e.g. Serendipity, Burden, Consistency..."
                        style={{
                            width: '100%',
                            height: '120px',
                            padding: '18px',
                            fontSize: '1.25rem',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'var(--card-bg)',
                            color: 'white',
                            outline: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            boxSizing: 'border-box',
                            resize: 'none'
                        }}
                        autoFocus
                    />
                </div>

                <button 
                type="submit"
                disabled={loading || !inputText.trim()}
                style={{
                    padding: '18px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: (loading || !inputText.trim()) ? 0.7 : 1,
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 20px rgba(109, 40, 217, 0.3)',
                    transition: 'transform 0.1s'
                }}
                >
                    {loading ? '✨ Batch Processing with Claude...' : '✨ Generate All'}
                </button>
            </form>
          )}
          
          {error && (
              <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', borderRadius: '16px', fontSize: '0.95rem' }}>
                  {error}
              </div>
          )}

          {/* Preview Section */}
          {generatedCards.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.5s ease-out' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {generatedCards.map((card, idx) => (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{color: 'white', fontWeight: 700, fontSize: '1.1rem'}}>{card.back}</span>
                                <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>{card.pronunciation}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '16px' }}>
                                <PreviewField label="Persian" value={card.front} />
                                <PreviewField label="Synonyms" value={card.synonyms} />
                            </div>

                            {/* Word Forms Display */}
                            {card.word_forms && Object.keys(card.word_forms).length > 0 && (
                                <div style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '6px', display: 'block', textTransform: 'uppercase' }}>Word Forms</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {Object.entries(card.word_forms).map(([key, val]) => (
                                            <span key={key} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
                                                <span style={{color: 'var(--accent)', opacity: 0.8}}>{key}:</span> {val as string}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '6px', display: 'block', textTransform: 'uppercase' }}>Examples</label>
                                <ul style={{ margin: 0, paddingLeft: '16px', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                    {card.examples?.slice(0, 2).map((ex, i) => (
                                        <li key={i} style={{ marginBottom: '4px' }}>{ex}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '16px', position: 'sticky', bottom: '20px', background: 'var(--bg-color)', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <button 
                        onClick={handleDiscard}
                        style={{
                            flex: 1,
                            padding: '18px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.08)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                      >
                          Discard All
                      </button>
                      
                      <button 
                        onClick={handleSaveAll}
                        style={{
                            flex: 2,
                            padding: '18px',
                            borderRadius: '20px',
                            background: 'var(--success)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                        }}
                      >
                          Save {generatedCards.length} Cards
                      </button>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
}

function PreviewField({ label, value }: { label: string, value: any }) {
    if (!value) return null;
    return (
        <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>{label}</label>
            <div style={{ color: 'white', fontSize: '1rem', fontWeight: 500 }}>{value}</div>
        </div>
    )
}
