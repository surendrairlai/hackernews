import { getHostname, Story, timeAgo } from '../services/hnAPI';

const HN = 'https://news.ycombinator.com';

export const StoryCard = ({ story, rank, layout = 'list' }: { story: Story; rank: number; layout?: 'grid' | 'list' }) => {
  const isGrid = layout === 'grid';
  const commentsUrl = `${HN}/item?id=${story.id}`;
  const hostname = getHostname(story.url);

  return (
    <div className={`rounded-2xl border transition-all duration-300 dark:bg-bg-dark dark:border-border-dark bg-bg-light border-border-light ${
      isGrid ? 'h-full hover:-translate-y-1 hover:shadow-2xl p-4 sm:p-6 lg:p-8 flex flex-col gap-4' 
             : 'hover:translate-x-1 hover:shadow-xl p-4 sm:p-6 grid grid-cols-[auto_1fr] sm:grid-cols-[60px_1fr_auto] gap-4 sm:gap-6 items-start sm:items-center'
    }`}>
      <div className="font-display font-bold opacity-30 text-accent text-2xl sm:text-3xl lg:text-4xl text-center">{rank}</div>

      <div className={`min-w-0 flex flex-col ${isGrid ? 'flex-1' : 'col-span-2 sm:col-span-1'}`}>
        <h2 className="font-serif font-bold leading-tight text-lg sm:text-xl lg:text-2xl mb-2">
          <a href={story.url || commentsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-hover transition-colors break-words dark:text-gray-300 text-gray-800">
            {story.title}
          </a>
        </h2>

        {hostname && (
          <a href={story.url} target="_blank" rel="noopener noreferrer" className={`inline-block w-fit font-mono text-xs px-2 py-1 rounded-md hover:-translate-y-0.5 transition-all bg-accent-muted text-link ${isGrid ? 'mb-4' : 'mb-2'}`}>
            {hostname}
          </a>
        )}

        <div className={`flex flex-wrap items-center font-mono dark:text-text-mutedDark text-text-mutedLight gap-3 ${isGrid ? 'text-xs sm:text-sm mt-auto' : 'text-xs'}`}>
          <span className="flex items-center gap-1">
            <span className="text-accent">▲</span> {story.score} <span className="hidden sm:inline ml-1">points</span>
          </span>
          <a href={`${HN}/user?id=${story.by}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
            <span className="hidden sm:inline">by </span>{story.by}
          </a>
          <span className="px-2 py-1 rounded-md dark:bg-discuss-bgDark bg-discuss-bgLight">🕐 {timeAgo(story.time)}</span>
          <a href={commentsUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded-md hover:text-link transition-all dark:bg-discuss-bgDark bg-discuss-bgLight dark:hover:bg-discuss-hoverDark hover:bg-discuss-hoverLight">
            💬 {story.descendants || 'discuss'}
          </a>
        </div>
      </div>

      {!isGrid && story.descendants > 0 && (
        <a href={commentsUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 hover:text-link transition-colors font-mono text-xs dark:text-text-mutedDark text-text-mutedLight">
          💬 {story.descendants} comments
        </a>
      )}
    </div>
  );
};
