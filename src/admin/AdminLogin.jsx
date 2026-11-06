import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../firebase/AdminAuthContext';
import { isFirebaseConfigured } from '../firebase/config';

export default function AdminLogin() {
  const { login, user } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blueprint flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="w-9 h-9 grid place-items-center border border-brass-500 text-brass-500 font-mono text-sm">
            MI
          </span>
          <span className="font-mono text-xs tracking-widest uppercase text-muted">
            Admin Access
          </span>
        </div>

        <form
          onSubmit={onSubmit}
          className="border border-ink-700 bg-ink-800/60 p-7 space-y-5"
        >
          {!isFirebaseConfigured && (
            <p className="text-xs font-mono text-brass-400 border border-brass-500/30 p-3 leading-relaxed">
              Firebase isn&apos;t configured yet. Add your project keys to a
              <code className="mx-1 text-brass-500">.env</code> file — see
              <code className="mx-1 text-brass-500">README.md</code> for setup steps.
            </p>
          )}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ink-900 border border-ink-600 px-4 py-3 text-paper focus-ring"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ink-900 border border-ink-600 px-4 py-3 text-paper focus-ring"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-mono">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brass-500 text-ink-900 font-semibold px-6 py-3 hover:bg-brass-400 transition-colors focus-ring disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6 font-mono">
          <a href="/" className="hover:text-brass-500 transition-colors">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
