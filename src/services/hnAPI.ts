import { API_BASE_URL, TIME_INTERVALS } from '../config/constants';

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

export const fetchStoryIds = async (type: 'top' | 'new'): Promise<number[]> => {
  const res = await fetch(`${API_BASE_URL}/${type}stories.json`);
  if (!res.ok) throw new Error('Failed to fetch stories');
  return res.json();
};

export const fetchStory = async (id: number): Promise<Story> => {
  const res = await fetch(`${API_BASE_URL}/item/${id}.json`);
  if (!res.ok) throw new Error('Failed to fetch story');
  return res.json();
};

export const fetchStories = (ids: number[]): Promise<Story[]> => 
  Promise.all(ids.map(fetchStory));

export const getHostname = (url?: string): string => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
};

export const timeAgo = (timestamp: number): string => {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  for (const [unit, secs] of Object.entries(TIME_INTERVALS)) {
    const interval = Math.floor(seconds / secs);
    if (interval >= 1) return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};
