import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../features/admin/components/LoginForm';
import { AdminDashboard } from '../features/admin/adminDashboard';

export function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, adminEmail, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy text-gold">
        <p className="font-main text-sm uppercase tracking-widest animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <AdminDashboard
      adminEmail={adminEmail}
      onLogout={logout}
      onNavigatePortfolio={() => navigate('/vince_lawrence_baraclan')}
    />
  );
}

export default AdminPage;
