import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Header from './components/Header';
import { ErrorState, LoadMoreButton, SkeletonCard } from './components/LoadingError';
import { StoryCard } from './components/StoryCard';
import { STORIES_PER_PAGE, INITIAL_STORIES_COUNT } from './config/constants';
import { useStoryIds, useFetchStories } from './hooks/useStories';
import { useTheme } from './hooks/useTheme';
import { Story } from './services/hnAPI';

export default function App() {
  const [view, setView] = useState<'top' | 'new'>('top');
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const [displayCount, setDisplayCount] = useState(INITIAL_STORIES_COUNT);
  const [stories, setStories] = useState<Story[]>([]);

  const { theme, toggleTheme } = useTheme();
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: '100px' });

  const { data: storyIds = [], isLoading: idsLoading, error: idsError } = useStoryIds(view);
  const idsToFetch = storyIds.slice(stories.length, displayCount);
  const { data: newStories, isLoading: storiesLoading, isFetching, error: storiesError } = useFetchStories(idsToFetch, idsToFetch.length > 0);

  useEffect(() => {
    if (newStories?.length) setStories(prev => [...prev, ...newStories]);
  }, [newStories]);

  const handleViewChange = (newView: 'top' | 'new') => {
    if (newView !== view) {
      setStories([]);
      setDisplayCount(INITIAL_STORIES_COUNT);
    }
    setView(newView);
  };

  const loading = idsLoading || (storiesLoading && !stories.length);
  const loadingMore = isFetching && stories.length > 0;
  const hasMore = displayCount < storyIds.length;

  useEffect(() => {
    if (inView && hasMore && !loadingMore) setDisplayCount(prev => prev + STORIES_PER_PAGE);
  }, [inView, hasMore, loadingMore]);

  const gridClass = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
    : 'flex flex-col gap-4';

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-bg-pageDark bg-bg-pageLight">
      <Header view={view} onViewChange={handleViewChange} layout={layout} onLayoutChange={setLayout} theme={theme} onThemeChange={toggleTheme} />

      <main className="max-w-7xl mx-auto px-8 py-24 md:py-32">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold mb-2 text-accent">
            {view === 'top' ? 'Top Stories' : 'Latest News'}
          </h2>
          <p className="font-serif text-lg italic dark:text-text-mutedDark text-text-mutedLight">
            {view === 'top' ? 'The most popular stories on Hacker News' : 'Fresh stories from the developer community'}
          </p>
        </div>

        {(idsError || storiesError) && <ErrorState message="Failed to load stories. Please try again." />}

        {loading ? (
          <div className={gridClass}>
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className={gridClass}>
              {stories.map((story, i) => <StoryCard key={story.id} story={story} rank={i + 1} layout={layout} />)}
            </div>
            {hasMore && <LoadMoreButton ref={ref} onLoadMore={() => setDisplayCount(prev => prev + STORIES_PER_PAGE)} loading={loadingMore} />}
          </>
        )}
      </main>
    </div>
  );
}
