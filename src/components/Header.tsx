interface HeaderProps {
  view: 'top' | 'new';
  onViewChange: (view: 'top' | 'new') => void;
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
  theme: 'dark' | 'light';
  onThemeChange: () => void;
}

const Btn = ({ active, onClick, children, title }: { active: boolean; onClick: () => void; children: React.ReactNode; title?: string }) => (
  <button
    className={`font-mono font-medium px-3 sm:px-5 md:py-2 rounded-lg transition-all ${active ? 'bg-accent text-white' : 'bg-transparent dark:text-text-mutedDark text-text-mutedLight'}`}
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
);

const BtnGroup = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex rounded-xl p-1 border dark:bg-bg-buttonDark dark:border-border-dark bg-bg-buttonLight border-border-light ${className}`}>
    {children}
  </div>
);

export default function Header({ view, onViewChange, layout, onLayoutChange, theme, onThemeChange }: HeaderProps) {
  return (
    <header className="fixed w-full top-0 z-50 backdrop-blur-xl border-b shadow-lg dark:bg-bg-headerDark dark:border-border-dark bg-bg-headerLight border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between sm:gap-2 md:gap-4 flex-wrap">
        <h1 className="font-display text-xl md:text-3xl font-bold bg-gradient-to-r from-accent to-link bg-clip-text text-transparent">
          Hacker News
        </h1>

        <nav className="flex items-center gap-2 md:gap-4 flex-wrap justify-end">
          <BtnGroup>
            <Btn active={view === 'top'} onClick={() => onViewChange('top')}>
              <span className="hidden lg:inline text-sm uppercase tracking-wide">Top Stories</span>
              <span className="lg:hidden text-xs uppercase tracking-wide">Top</span>
            </Btn>
            <Btn active={view === 'new'} onClick={() => onViewChange('new')}>
              <span className="hidden lg:inline text-sm uppercase tracking-wide">New Stories</span>
              <span className="lg:hidden text-xs uppercase tracking-wide">New</span>
            </Btn>
          </BtnGroup>

          <BtnGroup className="hidden md:flex">
            <Btn active={layout === 'grid'} onClick={() => onLayoutChange('grid')} title="Grid View">⊞</Btn>
            <Btn active={layout === 'list'} onClick={() => onLayoutChange('list')} title="List View">☰</Btn>
          </BtnGroup>

          <button
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center text-xl sm:text-2xl transition-all hover:scale-105 dark:bg-bg-buttonDark dark:border-border-dark bg-bg-buttonLight border-border-light"
            onClick={onThemeChange}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}
