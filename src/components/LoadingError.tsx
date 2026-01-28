import { forwardRef } from 'react';

export const ErrorState = ({ message }: { message: string }) => (
  <div className="border rounded-2xl p-8 text-center dark:bg-bg-dark bg-bg-light border-accent/30">
    <div className="font-display text-2xl mb-2 text-accent">Oops! Something went wrong</div>
    <div className="opacity-60">{message}</div>
  </div>
);

export const LoadMoreButton = forwardRef<HTMLDivElement, { onLoadMore: () => void; loading: boolean }>(
  ({ onLoadMore, loading }, ref) => (
    <div ref={ref} className="flex justify-center mt-12">
      <button
        className="font-mono text-sm font-semibold px-10 py-4 border-2 rounded-xl uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 dark:bg-bg-dark dark:text-text-dark dark:border-accent bg-bg-light text-text-light border-accent"
        onClick={onLoadMore}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load More Stories'}
      </button>
    </div>
  )
);

export const SkeletonCard = () => (
  <div className="rounded-2xl p-4 sm:p-6 lg:p-8 border animate-pulse dark:bg-bg-dark dark:border-border-dark bg-bg-light border-border-light">
    <div className="h-6 rounded w-4/5 mb-4 dark:bg-skeleton-dark bg-skeleton-light" />
    <div className="h-5 rounded w-2/5 mb-4 dark:bg-skeleton-dark bg-skeleton-light" />
    <div className="flex gap-4">
      {[1, 2, 3].map(i => <div key={i} className="h-4 rounded w-20 dark:bg-skeleton-dark bg-skeleton-light" />)}
    </div>
  </div>
);
