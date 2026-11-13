import { AdminDashboard } from '../../features/admin/adminDashboard';

interface RoutesAdminProps {
  onNavigatePortfolio?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function RoutesAdmin({ onNavigatePortfolio, darkMode, onToggleDarkMode }: RoutesAdminProps) {
  return (
    <div className={darkMode ? 'dark bg-zinc-950 text-zinc-100 min-h-screen' : 'bg-zinc-50 text-zinc-900 min-h-screen'}>
      <AdminDashboard
        onNavigatePortfolio={onNavigatePortfolio}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
    </div>
  );
}

export default RoutesAdmin;

