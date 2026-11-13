import { useState, useEffect } from 'react';
import { RoutesPortfolio } from './api/routes/routesPortfolio';
import { RoutesAdmin } from './api/routes/routesAdmin';

export default function App() {
  // Simple router supporting hash, path, or internal state
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('admin') || hash.includes('admin')) {
        return 'admin';
      }
    }
    return 'portfolio';
  });

  // Dark mode state persisted in localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baraclan_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('baraclan_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('baraclan_theme', 'light');
    }
  }, [darkMode]);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.toLowerCase().includes('admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('portfolio');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  const navigateToPortfolio = () => {
    window.location.hash = '';
    setCurrentView('portfolio');
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={darkMode ? 'dark bg-zinc-950 text-zinc-100 min-h-screen' : 'bg-white text-zinc-900 min-h-screen'}>
      {currentView === 'admin' ? (
        <RoutesAdmin
          onNavigatePortfolio={navigateToPortfolio}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      ) : (
        <RoutesPortfolio
          onNavigateAdmin={navigateToAdmin}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
  );
}
