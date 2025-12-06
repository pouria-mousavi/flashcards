import { useState, useRef } from 'react';

interface Props {
  onAdd: (front: string, back: string) => void;
  onCancel: () => void;
}

export default function AddCard({ onAdd, onCancel }: Props) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isListening, setIsListening] = useState<'front' | 'back' | null>(null);

  const recognitionRef = useRef<any>(null);

  const startListening = (field: 'front' | 'back') => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Default to English, maybe auto-detect or user pref later

    recognition.onstart = () => setIsListening(field);
    recognition.onend = () => setIsListening(null);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (field === 'front') {
        setFront(prev => prev ? `${prev} ${transcript}` : transcript);
      } else {
        setBack(prev => prev ? `${prev} ${transcript}` : transcript);
      }
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      onAdd(front, back);
      setFront('');
      setBack('');
    }
  };

  return (
    <div className="flex-center full-screen" style={{ flexDirection: 'column', background: 'var(--bg-color)', zIndex: 10 }}>
      {/* Header */}
      <div style={{ 
          width: '100%', 
          padding: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '600px'
      }}>
          <h2 style={{ margin: 0 }}>Add Card</h2>
          <button onClick={onCancel} style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <InputGroup 
            label="Front (Word)" 
            value={front} 
            onChange={setFront} 
            listening={isListening === 'front'}
            onMic={() => startListening('front')}
          />

          <InputGroup 
            label="Back (Meaning)" 
            value={back} 
            onChange={setBack} 
            listening={isListening === 'back'}
            onMic={() => startListening('back')}
          />

          <button 
            type="submit"
            disabled={!front || !back}
            style={{
                marginTop: '20px',
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--accent)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                opacity: (!front || !back) ? 0.5 : 1
            }}
          >
              Save Card
          </button>
      </form>
    </div>
  );
}

function InputGroup({ label, value, onChange, listening, onMic }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <textarea 
                    value={value} 
                    onChange={e => onChange(e.target.value)}
                    style={{
                        width: '100%',
                        height: '100px',
                        padding: '16px',
                        paddingRight: '60px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'var(--card-bg)',
                        color: 'white',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        resize: 'none',
                        boxSizing: 'border-box'
                    }}
                    placeholder="Type or speak..."
                />
                <button
                    type="button"
                    onClick={onMic}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        bottom: '12px',
                        fontSize: '1.5rem',
                        background: listening ? 'var(--danger)' : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                >
                    {listening ? '⏹' : '🎤'}
                </button>
            </div>
        </div>
    )
}
