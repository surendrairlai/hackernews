// Hacker News Firebase API base URL
export const API_BASE_URL = 'https://hacker-news.firebaseio.com/v0';

// Number of stories to load per page
export const STORIES_PER_PAGE = 30;

// Number of stories to load initially
export const INITIAL_STORIES_COUNT = 15;

// Time intervals in seconds for relative time calculation
export const TIME_INTERVALS: Record<string, number> = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
};
