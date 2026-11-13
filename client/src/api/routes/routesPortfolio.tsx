import { Portfolio } from '../../features/portfolio/portfolio';

interface RoutesPortfolioProps {
  onNavigateAdmin?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function RoutesPortfolio({ onNavigateAdmin, darkMode, onToggleDarkMode }: RoutesPortfolioProps) {
  return (
    <div className={darkMode ? 'dark bg-zinc-950 text-zinc-100 min-h-screen' : 'bg-white text-zinc-900 min-h-screen'}>
      <Portfolio
        onNavigateAdmin={onNavigateAdmin}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
    </div>
  );
}

export default RoutesPortfolio;

