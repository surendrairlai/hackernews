import React from 'react';

interface HeaderProps {
  view: 'top' | 'new';
  onViewChange: (view: 'top' | 'new') => void;
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
  theme: 'dark' | 'light';
  onThemeChange: () => void;
}

/**
 * Header component with navigation controls
 * Layout toggle is hidden on mobile (forced to list layout)
 */
const Header: React.FC<HeaderProps> = ({ view, onViewChange, layout, onLayoutChange, theme, onThemeChange }) => {
  const isDark = theme === 'dark';
  
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b shadow-lg dark:bg-bg-headerDark dark:border-border-dark bg-bg-headerLight border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between gap-4 sm:gap-8 flex-wrap">
        <h1 className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-link bg-clip-text text-transparent">
          Hacker News
        </h1>

        <nav className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
          <div className="flex rounded-xl p-1 border dark:bg-bg-buttonDark dark:border-border-dark bg-bg-buttonLight border-border-light">
            <button
              className={`font-mono text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 rounded-lg transition-all uppercase tracking-wide ${
                view === 'top' 
                  ? 'bg-accent text-white' 
                  : 'bg-transparent dark:text-text-mutedDark text-text-mutedLight'
              }`}
              onClick={() => onViewChange('top')}
            >
              <span className="hidden sm:inline">Top Stories</span>
              <span className="sm:hidden">Top</span>
            </button>
            <button
              className={`font-mono text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 rounded-lg transition-all uppercase tracking-wide ${
                view === 'new' 
                  ? 'bg-accent text-white' 
                  : 'bg-transparent dark:text-text-mutedDark text-text-mutedLight'
              }`}
              onClick={() => onViewChange('new')}
            >
              <span className="hidden sm:inline">New Stories</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Layout toggle - hidden on mobile where list layout is always used */}
          <div className="hidden md:flex rounded-xl p-1 border dark:bg-bg-buttonDark dark:border-border-dark bg-bg-buttonLight border-border-light">
            <button
              className={`font-mono text-lg sm:text-xl font-medium px-3 sm:px-5 py-2 rounded-lg transition-all flex items-center justify-center ${
                layout === 'grid' 
                  ? 'bg-accent text-white' 
                  : 'bg-transparent dark:text-text-mutedDark text-text-mutedLight'
              }`}
              onClick={() => onLayoutChange('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              className={`font-mono text-lg sm:text-xl font-medium px-3 sm:px-5 py-2 rounded-lg transition-all flex items-center justify-center ${
                layout === 'list' 
                  ? 'bg-accent text-white' 
                  : 'bg-transparent dark:text-text-mutedDark text-text-mutedLight'
              }`}
              onClick={() => onLayoutChange('list')}
              title="List View"
            >
              ☰
            </button>
          </div>

          <button
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center text-xl sm:text-2xl transition-all hover:scale-105 flex-shrink-0 dark:bg-bg-buttonDark dark:border-border-dark bg-bg-buttonLight border-border-light"
            onClick={onThemeChange}
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
