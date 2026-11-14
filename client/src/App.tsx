import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import { RoutesPortfolio } from './api/routes/routesPortfolio';
import { RoutesAdmin } from './api/routes/routesAdmin';

export default function App() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={darkMode ? 'bg-zinc-950 text-zinc-100 min-h-screen' : 'bg-white text-zinc-900 min-h-screen'}>
      <Routes>
        <Route
          path="/vince_lawrence_baraclan"
          element={
            <RoutesPortfolio
              onNavigateAdmin={() => navigate('/admin')}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <RoutesAdmin
              onNavigatePortfolio={() => navigate('/vince_lawrence_baraclan')}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          }
        />
        {/* Anything else (including /) goes to the portfolio */}
        <Route path="*" element={<Navigate to="/portfolio" replace />} />
      </Routes>
    </div>
  );
}