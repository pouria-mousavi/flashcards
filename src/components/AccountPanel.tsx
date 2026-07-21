import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { changePassword, signOut, adminListUsers, adminDeleteUser, adminConfig, displayName } from '../lib/auth';
import type { Role, AdminUser } from '../lib/auth';

interface Props {
  role: Role;
  onClose: () => void;
}

const field: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
  fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass" style={{ borderRadius: 'var(--radius)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ margin: 0, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-sv)' }}>{title}</p>
      {children}
    </div>
  );
}

export default function AccountPanel({ role, onClose }: Props) {
  const [pw, setPw] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [cfg, setCfg] = useState<{ code?: string; max?: number; count?: number } | null>(null);
  const [adminErr, setAdminErr] = useState<string | null>(null);

  useEffect(() => {
    if (!role.isAdmin) return;
    adminListUsers().then(r => { if (r.users) setUsers(r.users); else if (r.error) setAdminErr(r.error); });
    adminConfig().then(r => { if (!r.error) setCfg(r); });
  }, [role.isAdmin]);

  const doChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null); setPwErr(null);
    if (pw.length < 6) { setPwErr('Password must be at least 6 characters.'); return; }
    setPwBusy(true);
    const { error } = await changePassword(pw);
    setPwBusy(false);
    if (error) setPwErr(error.message);
    else { setPwMsg('Password updated.'); setPw(''); }
  };

  const doDelete = async (u: AdminUser) => {
    if (!confirm(`Remove ${displayName(u.email)}? Their progress is permanently deleted.`)) return;
    const { error } = await adminDeleteUser(u.user_id);
    if (error) { setAdminErr(error); return; }
    setUsers(prev => prev?.filter(x => x.user_id !== u.user_id) ?? null);
    if (cfg?.count != null) setCfg({ ...cfg, count: cfg.count - 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ background: 'var(--grad-sv)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Account</span>
        </h2>
        <button onClick={onClose} className="pressable glass" aria-label="Close account"
          style={{ width: '36px', height: '36px', borderRadius: '999px', color: 'var(--text-secondary)', fontSize: '1rem', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <Section title="Signed in as">
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 650, color: 'var(--text-primary)' }}>
              {displayName(role.email)} {role.isAdmin && <span style={{ fontSize: '0.7rem', color: 'var(--accent-sv)', fontWeight: 700 }}>· owner</span>}
            </p>
            <button onClick={() => signOut()} className="pressable"
              style={{ padding: '11px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.88rem', background: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid var(--border)' }}>
              Sign out
            </button>
          </Section>

          <Section title="Change password">
            <form onSubmit={doChangePw} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input className="glass" style={field} type="password" autoComplete="new-password" placeholder="New password"
                value={pw} onChange={e => setPw(e.target.value)} />
              {pwErr && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--danger)' }}>{pwErr}</p>}
              {pwMsg && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--success)' }}>{pwMsg}</p>}
              <button type="submit" disabled={pwBusy} className="pressable"
                style={{ padding: '11px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.88rem', background: 'var(--grad-sv)', color: 'var(--cta-ink-sv)', border: 'none', opacity: pwBusy ? 0.6 : 1 }}>
                {pwBusy ? 'Saving…' : 'Update password'}
              </button>
            </form>
          </Section>

          {role.isAdmin && (
            <Section title={`Members${cfg ? ` · ${cfg.count}/${cfg.max}` : ''}`}>
              {cfg?.code && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Invite code (share this so friends can sign up):</span>
                  <code style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-sv)', background: 'var(--accent-sv-soft)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', userSelect: 'all' }}>{cfg.code}</code>
                </div>
              )}
              {adminErr && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--danger)' }}>{adminErr}</p>}
              {users === null ? (
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Loading…</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {users.map(u => (
                    <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {displayName(u.email)}{u.is_admin && <span style={{ fontSize: '0.68rem', color: 'var(--accent-sv)', fontWeight: 700 }}> · owner</span>}
                      </span>
                      {!u.is_admin && (
                        <button onClick={() => doDelete(u)} className="pressable"
                          style={{ flexShrink: 0, marginLeft: '10px', padding: '5px 10px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 600, color: 'var(--danger)', background: 'var(--danger-soft)', border: 'none' }}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}
        </div>
      </div>
    </motion.div>
  );
}
