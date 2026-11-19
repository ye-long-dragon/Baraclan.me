import { Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioPage } from './pages/PortfolioPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <div className="min-h-screen bg-navy text-gold">
      <Routes>
        <Route path="/vince_lawrence_baraclan" element={<PortfolioPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* "/" and any unknown routes redirect to /vince_lawrence_baraclan */}
        <Route path="/" element={<Navigate to="/vince_lawrence_baraclan" replace />} />
        <Route path="*" element={<Navigate to="/vince_lawrence_baraclan" replace />} />
      </Routes>
    </div>
  );
}
