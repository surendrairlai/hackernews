import { useQuery } from '@tanstack/react-query';
import { fetchStoryIds, fetchStories, Story } from '../services/hnAPI';

const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchInterval: 60 * 1000,
};

export const useStoryIds = (type: 'top' | 'new') => 
  useQuery({
    queryKey: ['storyIds', type],
    queryFn: () => fetchStoryIds(type),
    ...QUERY_CONFIG,
  });

export const useFetchStories = (ids: number[], enabled: boolean) =>
  useQuery({
    queryKey: ['stories', ids.join(',')],
    queryFn: () => fetchStories(ids),
    enabled: enabled && ids.length > 0,
    ...QUERY_CONFIG,
    select: (data: Story[]) => data.filter(s => s && !s.deleted && !s.dead),
  });
