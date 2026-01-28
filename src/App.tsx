import { useEffect, useState, useMemo } from 'react';
import Header from './components/Header';
import { ErrorState, LoadMoreButton } from './components/LoadingError';
import { SkeletonCard, StoryCard } from './components/StoryCard';
import { STORIES_PER_PAGE, INITIAL_STORIES_COUNT } from './config/constants';
import './index.css';
import { useStoryIds, useStoriesData } from './hooks/useStories';

function App() {
  const [view, setView] = useState<'top' | 'new'>('top');
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [displayCount, setDisplayCount] = useState(INITIAL_STORIES_COUNT);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch story IDs using React Query (cached!)
  const { 
    data: storyIds = [], 
    isLoading: idsLoading, 
    error: idsError 
  } = useStoryIds(view);

  // Get only the IDs we need for current page
  const idsToFetch = useMemo(
    () => storyIds.slice(0, displayCount),
    [storyIds, displayCount]
  );

  // Fetch stories using React Query (cached!)
  const { 
    data: stories = [], 
    isLoading: storiesLoading,
    isFetching: storiesFetching,
    error: storiesError 
  } = useStoriesData(idsToFetch, storyIds.length > 0);

  const loading = idsLoading || storiesLoading;
  const loadingMore = storiesFetching && !storiesLoading;
  const error = idsError || storiesError;

  // Reset display count when view changes
  useEffect(() => {
    setDisplayCount(INITIAL_STORIES_COUNT);
  }, [view]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + STORIES_PER_PAGE);
  };

  const handleViewChange = (newView: 'top' | 'new') => {
    if (newView !== view) {
      setView(newView);
      setDisplayCount(INITIAL_STORIES_COUNT);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const hasMore = displayCount < storyIds.length;
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

        {error && <ErrorState message="Failed to load stories. Please try again." theme={theme} />}

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
