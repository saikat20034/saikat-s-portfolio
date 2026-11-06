import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './firebase/AdminAuthContext';
import Portfolio from './Portfolio';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import RequireAuth from './admin/RequireAuth';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Portfolio />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
