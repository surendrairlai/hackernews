import { useQuery } from '@tanstack/react-query';
import { fetchStoryIds, fetchStories, Story } from '../services/hnAPI';

export const useStoryIds = (type: 'top' | 'new') => {
  return useQuery({
    queryKey: ['storyIds', type],
    queryFn: () => fetchStoryIds(type),
    staleTime: 30 * 1000,         // Data fresh for 30 seconds
    gcTime: 30 * 60 * 1000,       // Keep in cache for 30 minutes
    refetchInterval: 60 * 1000,   // Auto-refresh every 1 minute
  });
};

export const useStoriesData = (ids: number[], enabled: boolean) => {
  return useQuery({
    queryKey: ['stories', ids],
    queryFn: () => fetchStories(ids),
    enabled: enabled && ids.length > 0,
    staleTime: 30 * 1000,         // Data fresh for 30 seconds
    gcTime: 30 * 60 * 1000,       // Keep in cache for 30 minutes
    refetchInterval: 60 * 1000,   // Auto-refresh every 1 minute
    select: (data: Story[]) => data.filter(s => s && !s.deleted && !s.dead),
  });
};
