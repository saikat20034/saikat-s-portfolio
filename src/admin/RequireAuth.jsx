import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../firebase/AdminAuthContext';

export default function RequireAuth({ children }) {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-900 grid place-items-center">
        <p className="font-mono text-sm text-muted">Checking session…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;

  return children;
}
