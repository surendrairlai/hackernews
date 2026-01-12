import React from 'react';
import { getHostname, Story, timeAgo } from '../services/hnAPI';

interface StoryCardProps {
  story: Story;
  rank: number;
  layout?: 'grid' | 'list';
}

/**
 * Story card component with two layout modes:
 * - Grid: Vertical card layout with full title display
 * - List: Horizontal layout with rank, content, and comments count
 */
export const StoryCard: React.FC<StoryCardProps> = ({ story, rank, layout = 'list' }) => {
  const isGrid = layout === 'grid';
  const commentsUrl = `https://news.ycombinator.com/item?id=${story.id}`;
  const hostname = getHostname(story.url);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${isGrid
          ? 'h-full hover:-translate-y-1 hover:shadow-2xl p-4 sm:p-6 lg:p-8 flex flex-col gap-4 dark:bg-bg-dark dark:border-border-dark bg-bg-light border-border-light'
          : 'hover:translate-x-1 hover:shadow-xl p-4 sm:p-6 grid grid-cols-[auto_1fr] sm:grid-cols-[60px_1fr_auto] gap-4 sm:gap-6 items-start sm:items-center dark:bg-bg-dark dark:border-border-dark bg-bg-light border-border-light'
        }`}
    >
      <div
        className={`font-display font-bold opacity-30 text-accent ${isGrid ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-2xl sm:text-3xl lg:text-4xl text-center'
          }`}
      >
        {rank}
      </div>

      <div className={`min-w-0 flex flex-col ${isGrid ? 'flex-1' : 'col-span-2 sm:col-span-1'}`}>
        {/* Story title - always shows full title */}
        <h2 className={`font-serif font-bold leading-tight ${isGrid ? 'text-base sm:text-lg lg:text-xl mb-3' : 'text-base sm:text-lg lg:text-xl mb-2'
          }`}>
          <a
            href={story.url || commentsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-hover transition-colors break-words dark:text-text-dark text-text-light"
          >
            {story.title}
          </a>
        </h2>

        {hostname && (
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block w-fit font-mono text-xs px-2 sm:px-3 py-1 rounded-md hover:-translate-y-0.5 transition-all bg-accent-muted text-link ${isGrid ? 'mb-4' : 'mb-2'
              }`}
          >
            {hostname}
          </a>
        )}

        {/* Metadata section - organized in grid layout */}
        <div
          className={`flex flex-wrap items-center font-mono dark:text-text-mutedDark text-text-mutedLight ${isGrid ? 'gap-2 sm:gap-3 text-xs sm:text-sm mt-auto' : 'gap-3 sm:gap-4 text-xs'
            }`}
        >
          <div className={`flex items-center ${isGrid ? 'gap-1' : 'gap-1'}`}>
            <span className="text-accent">▲</span>
            <span>{story.score}</span>
            <span className="hidden sm:inline ml-1">points</span>
          </div>

          <div className={`flex items-center ${isGrid ? 'gap-1' : 'gap-1'}`}>
            <span className="hidden sm:inline">by</span>
            <a
              href={`https://news.ycombinator.com/user?id=${story.by}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              {story.by}
            </a>
          </div>

          <div
            className={`flex items-center px-2 py-1 rounded-md cursor-default dark:bg-discuss-bgDark bg-discuss-bgLight ${isGrid ? 'gap-1' : 'gap-1'
              }`}
          >
            <span className={`text-link ${isGrid ? 'text-sm' : 'text-sm sm:text-base'}`}>🕐</span>
            <span>{timeAgo(story.time)}</span>
          </div>

          {isGrid ? (
            <a
              href={commentsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:text-link transition-all dark:bg-discuss-bgDark bg-discuss-bgLight dark:hover:bg-discuss-hoverDark hover:bg-discuss-hoverLight"
            >
              <span className="text-sm">💬</span>
              <span className="font-medium text-xs sm:text-sm">{story.descendants > 0 ? story.descendants : 'discuss'}</span>
            </a>
          ) : (
            <a
              href={commentsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-2 py-1 rounded-md hover:text-link transition-all group dark:bg-discuss-bgDark bg-discuss-bgLight dark:hover:bg-discuss-hoverDark hover:bg-discuss-hoverLight gap-1"
            >
              <span className={`group-hover:scale-110 transition-transform text-sm sm:text-base`}>💬</span>
              <span className="font-medium">discuss</span>
            </a>
          )}
        </div>
      </div>

      {!isGrid && story.descendants > 0 && (
        <div className="hidden sm:flex justify-end items-center">
          <a
            href={commentsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 hover:text-link transition-colors whitespace-nowrap font-mono text-xs sm:text-sm dark:text-text-mutedDark text-text-mutedLight"
          >
            <span>💬</span>
            <span>{story.descendants} comments</span>
          </a>
        </div>
      )}
    </div>
  );
};


/**
 * Loading skeleton card shown while stories are being fetched
 */
export const SkeletonCard = () => {
  return (
    <div className={`rounded-2xl p-4 sm:p-6 lg:p-8 border animate-pulse dark:bg-bg-dark dark:border-border-dark bg-bg-light border-border-light`}>
      <div className={`h-5 sm:h-6 lg:h-7 rounded w-4/5 mb-3 sm:mb-4 dark:bg-skeleton-dark bg-skeleton-light`} />
      <div className={`h-4 sm:h-5 rounded w-2/5 mb-3 sm:mb-4 dark:bg-skeleton-dark bg-skeleton-light`} />
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <div className={`h-3 sm:h-4 rounded w-16 sm:w-20 dark:bg-skeleton-dark bg-skeleton-light`} />
        <div className={`h-3 sm:h-4 rounded w-16 sm:w-20 dark:bg-skeleton-dark bg-skeleton-light`} />
        <div className={`h-3 sm:h-4 rounded w-16 sm:w-20 dark:bg-skeleton-dark bg-skeleton-light`} />
      </div>
    </div>
  );
};
