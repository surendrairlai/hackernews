import { useEffect, useState } from 'react';
import Header from './components/Header';
import { ErrorState, LoadMoreButton } from './components/LoadingError';
import { SkeletonCard, StoryCard } from './components/StoryCard';
import { STORIES_PER_PAGE, INITIAL_STORIES_COUNT } from './config/constants';
import './index.css';
import { fetchValidStories, fetchStoryIds, Story } from './services/hnAPI';

/**
 * Main application component
 * Manages state for view (top/new), layout (grid/list), theme, and stories
 */
function App() {

  const [view, setView] = useState<'top' | 'new'>('top');
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [stories, setStories] = useState<Story[]>([]);
  const [storyIds, setStoryIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_STORIES_COUNT);
  const [isMobile, setIsMobile] = useState(false);

  /**
   * Fetches story IDs and loads the first page of stories
   * Filters out deleted and dead stories
   */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await fetchStoryIds(view);
      setStoryIds(ids);
      const idsToLoad = ids.slice(0, INITIAL_STORIES_COUNT);
      const validStories = await fetchValidStories(idsToLoad);
      setStories(validStories);
      setDisplayCount(INITIAL_STORIES_COUNT);
    } catch (err) {
      setError('Failed to load stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reload stories when view changes (top/new)
  useEffect(() => {
    loadData();
  }, [view]);

  // Apply dark mode class to document root for Tailwind dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Detect mobile screen size and force list layout on mobile
  // Uses Tailwind's md breakpoint (768px)
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Loads the next page of stories
   * Appends new stories to existing list for infinite scroll effect
   */
  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      setError(null);
      const idsToLoad = storyIds.slice(displayCount, displayCount + STORIES_PER_PAGE);
      const validStories = await fetchValidStories(idsToLoad);
      setStories(prev => [...prev, ...validStories]);
      setDisplayCount(prev => prev + STORIES_PER_PAGE);
    } catch (err) {
      setError('Failed to load more stories. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleViewChange = (newView: 'top' | 'new') => {
    if (newView !== view) {
      setView(newView);
      setStories([]);
      setDisplayCount(INITIAL_STORIES_COUNT);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }

  const hasMore = displayCount < storyIds.length;
  // Force list layout on mobile for better UX, use selected layout on desktop
  const effectiveLayout = isMobile ? 'list' : layout;
  const isGrid = effectiveLayout === 'grid';

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-bg-pageDark bg-bg-pageLight">
      <Header
        view={view}
        onViewChange={handleViewChange}
        layout={layout}
        onLayoutChange={setLayout}
        theme={theme}
        onThemeChange={toggleTheme}
      />

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold mb-2 text-accent">
            {view === 'top' ? 'Top Stories' : 'Latest News'}
          </h2>
          <p className="font-serif text-lg italic dark:text-text-mutedDark text-text-mutedLight">
            {view === 'top' ? 'The most popular stories on Hacker News' : 'Fresh stories from the developer community'}
          </p>
        </div>

        {error && <ErrorState message={error} theme={theme} />}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className={isGrid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {stories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  rank={index + 1}
                  layout={effectiveLayout}
                />
              ))}
            </div>

            {hasMore && (
              <LoadMoreButton handleLoadMore={handleLoadMore} loading={loadingMore} theme={theme} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
