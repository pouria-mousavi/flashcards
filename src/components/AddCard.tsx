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
  const [inputWord, setInputWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<Partial<Flashcard> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWord.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const anthropic = new Anthropic({
        apiKey: CLAUDE_KEY,
        dangerouslyAllowBrowser: true // Allowed for local app
      });

      const prompt = `
      Analyze the English word/phrase: "${inputWord}".
      Generate a flashcard for a Persian learner.
      
      Output strictly valid JSON with these fields:
      - front: The natural, native Persian translation (colloquial if appropriate).
      - back: The English word/phrase (standardized).
      - pronunciation: English pronunciation/IPA (e.g., "/ˈdʒɛnɪsɪs/").
      - tone: "Formal", "Informal", "Slang", or "Neutral".
      - synonyms: Array of strings (Persian synonyms).
      - word_forms: Object/Dictionary of related forms (noun, verb, adjective, etc.).
      - examples: Array of strings. Each string should be "Persian Sentence (English Translation)".

      RETURN ONLY JSON. NO MARKDOWN.
      `;

      const msg = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      });

      const content = (msg.content[0] as any).text;
      const json = JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());

      setGeneratedCard({
        front: json.front,
        back: json.back,
        pronunciation: json.pronunciation,
        tone: json.tone,
        synonyms: Array.isArray(json.synonyms) ? json.synonyms.join(', ') : json.synonyms,
        word_forms: json.word_forms,
        examples: json.examples
      });

    } catch (err: any) {
      console.error(err);
      setError("AI Generation failed. Please try again. " + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (generatedCard) {
      onAdd(generatedCard);
    }
  };

  return (
    <div className="flex-center full-screen" style={{ flexDirection: 'column', background: 'var(--bg-color)', zIndex: 10, padding: '24px' }}>
      {/* Header */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '600px', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Add New Word</h2>
          <button onClick={onCancel} style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '1.5rem', border: 'none', cursor: 'pointer', padding: '8px' }}>✕</button>
      </div>

      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Phase 1: Input and Generate */}
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '4px' }}>English Word / Phrase</label>
                <input 
                    type="text"
                    value={inputWord}
                    onChange={e => setInputWord(e.target.value)}
                    disabled={loading || !!generatedCard}
                    placeholder="e.g. Serendipity..."
                    style={{
                        width: '100%',
                        padding: '18px',
                        fontSize: '1.25rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'var(--card-bg)',
                        color: 'white',
                        outline: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        boxSizing: 'border-box'
                    }}
                    autoFocus
                />
             </div>

             {!generatedCard && (
                 <button 
                    type="submit"
                    disabled={loading || !inputWord.trim()}
                    style={{
                        padding: '18px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: (loading || !inputWord.trim()) ? 0.7 : 1,
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 20px rgba(109, 40, 217, 0.3)',
                        transition: 'transform 0.1s'
                    }}
                 >
                     {loading ? '✨ Interpreting...' : '✨ Generate Meaning'}
                 </button>
             )}
          </form>
          
          {error && (
              <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', borderRadius: '16px', fontSize: '0.95rem' }}>
                  {error}
              </div>
          )}

          {/* Phase 2: Preview and Save */}
          {generatedCard && (
              <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '20px', 
                  animation: 'fadeIn 0.5s ease-out' 
              }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                          <PreviewField label="Persian (Front)" value={generatedCard.front} />
                          <PreviewField label="English (Back)" value={generatedCard.back} />
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                          <PreviewField label="Pronunciation" value={generatedCard.pronunciation} />
                          <PreviewField label="Tone" value={generatedCard.tone} />
                      </div>

                      <PreviewField label="Synonyms" value={generatedCard.synonyms} />
                      
                      <div style={{ marginTop: '20px' }}>
                           <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Examples</label>
                           <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                               {generatedCard.examples?.map((ex, i) => (
                                   <li key={i} style={{ marginBottom: '6px' }}>{ex}</li>
                               ))}
                           </ul>
                      </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                      <button 
                        onClick={() => { setGeneratedCard(null); setInputWord(''); }}
                        style={{
                            flex: 1,
                            padding: '18px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.08)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                      >
                          Discard
                      </button>
                      
                      <button 
                        onClick={handleSave}
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
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
                            transition: 'transform 0.1s'
                        }}
                      >
                          Confirm & Save
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
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>{label}</label>
            <div style={{ color: 'white', fontSize: '1rem', fontWeight: 500 }}>{value}</div>
        </div>
    )
}
