import { useNavigate } from 'react-router-dom';
import { Portfolio } from '../features/portfolio/portfolio';

export function PortfolioPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-navy text-gold">
      <Portfolio onNavigateAdmin={() => navigate('/admin')} />
    </main>
  );
}

export default PortfolioPage;
