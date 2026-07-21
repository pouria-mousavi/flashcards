import { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn, signupWithCode } from '../lib/auth';

type Mode = 'login' | 'signup';

const field: React.CSSProperties = {
  width: '100%',
  padding: '13px 15px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.95rem',
  color: 'var(--text-primary)',
  outline: 'none',
  marginBottom: '10px',
};

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setNotice(null);
    if (!username.trim() || !password) { setError('Enter your username and password.'); return; }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { error: sErr } = await signupWithCode(username, password, code);
        if (sErr) { setError(sErr); setBusy(false); return; }
        // Account created — sign straight in.
        const { error: iErr } = await signIn(username, password);
        if (iErr) {
          setNotice('Account created! You can log in now.');
          setMode('login'); setBusy(false); return;
        }
        // onAuthStateChange in App takes over from here.
      } else {
        const { error: iErr } = await signIn(username, password);
        if (iErr) { setError(iErr.message === 'Invalid login credentials' ? 'Wrong username or password.' : iErr.message); setBusy(false); return; }
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="flex-center full-screen" style={{ flexDirection: 'column', padding: '24px', height: '100dvh' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '380px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{
            margin: 0, fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em',
            background: 'var(--grad-sv)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Svenska
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Welcome back — log in to keep learning.' : 'Pick any username — no email needed.'}
          </p>
        </div>

        <form onSubmit={submit} className="glass" style={{ borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--card-shadow)' }}>
          <input className="glass" style={field} type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Username"
            value={username} onChange={e => setUsername(e.target.value)} />
          <input className="glass" style={field} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} />
          {mode === 'signup' && (
            <input className="glass" style={field} type="text" placeholder="Invite code"
              value={code} onChange={e => setCode(e.target.value)} />
          )}

          {error && <p style={{ margin: '2px 0 10px', fontSize: '0.82rem', color: 'var(--danger)', fontWeight: 500 }}>{error}</p>}
          {notice && <p style={{ margin: '2px 0 10px', fontSize: '0.82rem', color: 'var(--success)', fontWeight: 500 }}>{notice}</p>}

          <button type="submit" disabled={busy} className="pressable"
            style={{
              width: '100%', padding: '15px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.95rem',
              background: 'var(--grad-sv)', color: 'var(--cta-ink-sv)', border: 'none', opacity: busy ? 0.6 : 1,
            }}>
            {busy ? 'Please wait…' : (mode === 'login' ? 'Log in' : 'Create account')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setNotice(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-sv)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
