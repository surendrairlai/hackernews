import React from 'react';

interface ErrorStateProps {
  message: string;
  theme: 'dark' | 'light';
}

/**
 * Error state component displayed when story loading fails
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ message, theme }) => {
  return (
    <div className="border rounded-2xl p-8 text-center dark:bg-bg-dark bg-bg-light border-accent/30">
      <div className="font-display text-2xl mb-2 text-accent">
        Oops! Something went wrong
      </div>
      <div className="opacity-60">{message}</div>
    </div>
  );
};

interface LoadMoreButtonProps {
  handleLoadMore: () => void;
  loading: boolean;
  theme: 'dark' | 'light';
}

/**
 * Load more button for pagination
 * Disabled while loading to prevent duplicate requests
 */
export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ handleLoadMore, loading, theme }) => {
  return (
    <div className="flex justify-center mt-12">
      <button
        className="font-mono text-sm font-semibold px-10 py-4 border-2 rounded-xl uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-bg-dark dark:text-text-dark dark:border-accent bg-bg-light text-text-light border-accent"
        onClick={handleLoadMore}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load More Stories'}
      </button>
    </div>
  );
};
