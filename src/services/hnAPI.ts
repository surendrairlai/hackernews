import { API_BASE_URL, TIME_INTERVALS } from '../config/constants';

/**
 * Story interface matching Hacker News API response
 */
export interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  deleted?: boolean;
  dead?: boolean;
}

/**
 * Fetches array of story IDs for top or new stories
 * @param type - 'top' for top stories, 'new' for new stories
 */
export const fetchStoryIds = async (type: 'top' | 'new'): Promise<number[]> => {
  const response = await fetch(`${API_BASE_URL}/${type}stories.json`);
  if (!response.ok) throw new Error('Failed to fetch stories');
  return response.json();
};

/**
 * Fetches a single story by ID
 */
export const fetchStory = async (id: number): Promise<Story> => {
  const response = await fetch(`${API_BASE_URL}/item/${id}.json`);
  if (!response.ok) throw new Error('Failed to fetch story');
  return response.json();
};

/**
 * Fetches multiple stories in parallel
 * @param ids - Array of story IDs to fetch
 */
export const fetchStories = async (ids: number[]): Promise<Story[]> => {
  return Promise.all(ids.map(id => fetchStory(id)));
};

/**
 * Fetches stories and filters out deleted and dead items
 * @param ids - Array of story IDs to fetch
 */
export const fetchValidStories = async (ids: number[]): Promise<Story[]> => {
  const fetchedStories = await fetchStories(ids);
  return fetchedStories.filter(s => s && !s.deleted && !s.dead);
};

/**
 * Extracts hostname from URL, removing 'www.' prefix
 * Returns empty string if URL is invalid or missing
 */
export const getHostname = (url?: string): string => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
};

/**
 * Converts Unix timestamp to human-readable relative time
 * Returns format like "2 hours ago" or "just now"
 */
export const timeAgo = (timestamp: number): string => {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  
  // Find the largest time unit that fits
  for (const [unit, secondsInUnit] of Object.entries(TIME_INTERVALS)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};
