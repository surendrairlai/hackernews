# Hacker News Redesign

A modern, responsive Hacker News client built with React, TypeScript, and Tailwind CSS.

## Features

| Feature | Description |
|---------|-------------|
| 🌓 Dark/Light Theme | Toggle between themes with smooth transitions |
| 📐 Grid/List Layout | Choose your preferred view (hidden on mobile) |
| 📰 Top/New Stories | Switch between popular and recent stories |
| 📱 Responsive Design | Optimized for mobile, tablet, and desktop |
| ♾️ Infinite Scroll | Stories load automatically using IntersectionObserver |
| 🔄 Auto-refresh | Data updates every 60 seconds in background |
| 💾 Smart Caching | React Query caches data for 5 minutes |

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI library with hooks |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| React Query | 5.x | Data fetching, caching, synchronization |
| react-intersection-observer | 10.x | Infinite scroll detection |
| Vite | 5.x | Fast build tool |
| Playwright | 1.x | E2E testing |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run E2E tests
npm test
```

## Project Structure

```
src/
├── App.tsx                  # Main component - state management, layout
├── main.tsx                 # Entry point - React Query provider setup
├── index.css                # Global styles, Tailwind imports
│
├── components/
│   ├── Header.tsx           # Fixed navbar with view/layout/theme toggles
│   ├── StoryCard.tsx        # Story display - supports grid/list layouts
│   └── LoadingError.tsx     # ErrorState, LoadMoreButton, SkeletonCard
│
├── hooks/
│   ├── useStories.ts        # useStoryIds, useFetchStories (React Query)
│   └── useTheme.ts          # Theme state with dark class toggle
│
├── services/
│   └── hnAPI.ts             # API functions, Story interface, utilities
│
└── config/
    └── constants.ts         # API_BASE_URL, pagination settings, time intervals
```

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                               │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │ useStoryIds │───▶│ useFetchStories │───▶│ stories state │    │
│  │ (top/new)   │    │ (batch fetch)    │    │               │    │
│  └─────────────┘    └──────────────┘    └─────────────────┘       │
│         │                                        │              │
│         ▼                                        ▼              │
│  ┌─────────────┐                         ┌─────────────┐       │
│  │ React Query │                         │ StoryCard   │       │
│  │ Cache       │                         │ (render)    │       │
│  └─────────────┘                         └─────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── Header
│   ├── Logo (gradient text)
│   ├── BtnGroup: View Toggle (Top/New)
│   ├── BtnGroup: Layout Toggle (Grid/List) [hidden on mobile]
│   └── Theme Toggle Button (☀️/🌙)
│
└── Main
    ├── Page Title & Description
    ├── ErrorState (conditional)
    ├── SkeletonCard × 12 (while loading)
    └── Stories Container
        ├── StoryCard × n
        └── LoadMoreButton (with IntersectionObserver ref)
```

## State Management

| State | Type | Purpose |
|-------|------|---------|
| `view` | `'top' \| 'new'` | Current story feed |
| `layout` | `'grid' \| 'list'` | Display layout |
| `displayCount` | `number` | How many stories to show |
| `stories` | `Story[]` | Accumulated fetched stories |
| `theme` | `'dark' \| 'light'` | Current theme |

## React Query Configuration

```typescript
// Query Client (main.tsx)
{
  refetchOnWindowFocus: false,  // Don't refetch when tab focused
  retry: 2,                      // Retry failed requests twice
}

// Query Config (useStories.ts)
{
  staleTime: 5 * 60 * 1000,      // Data fresh for 5 minutes
  gcTime: 30 * 60 * 1000,        // Keep in cache for 30 minutes
  refetchInterval: 60 * 1000,    // Auto-refresh every 60 seconds
}
```

## API Reference

Base URL: `https://hacker-news.firebaseio.com/v0`

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/topstories.json` | GET | Array of top 500 story IDs |
| `/newstories.json` | GET | Array of newest 500 story IDs |
| `/item/{id}.json` | GET | Story object |

### Story Object

```typescript
interface Story {
  id: number;
  title: string;
  url?: string;        // External link (may be missing for Ask HN)
  score: number;       // Upvotes
  by: string;          // Author username
  time: number;        // Unix timestamp
  descendants: number; // Comment count
  deleted?: boolean;   // Filtered out
  dead?: boolean;      // Filtered out
}
```

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Mobile | < 768px | List layout only, "Top"/"New" short labels |
| Tablet (md) | ≥ 768px | Grid/List toggle visible, 2-column grid |
| Desktop (lg) | ≥ 1024px | Full button text, 3-column grid |

## Key Implementation Details

### Infinite Scroll
- Uses `react-intersection-observer` with `threshold: 0.1` and `rootMargin: '100px'`
- LoadMoreButton has ref attached for detection
- Triggers when button enters viewport, loads next batch

### Incremental Loading
- Only fetches NEW story IDs, not all from start
- `idsToFetch = storyIds.slice(stories.length, displayCount)`
- Appends to existing stories array

### Theme Toggle
- Adds/removes `dark` class on `document.documentElement`
- Tailwind's `dark:` variants handle all styling
- Persists during session (not in localStorage)

### View Change Reset
- Switching Top/New clears stories array
- Resets displayCount to initial value
- Prevents mixing stories from different feeds

## Pagination Settings

```typescript
// config/constants.ts
INITIAL_STORIES_COUNT: 15  // First load
STORIES_PER_PAGE: 10       // Each "load more"
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Playwright E2E tests |
| `npm run test:headed` | Run tests with browser visible |

## Assumptions & Decisions

1. **React Query over manual fetching** - Provides caching, deduplication, background refresh
2. **IntersectionObserver over scroll events** - More performant, native browser API
3. **Tailwind dark mode (class strategy)** - Easy toggle, no flash on load
4. **Fixed header** - Always accessible navigation
5. **List layout on mobile** - Better UX for small screens
6. **No localStorage for theme** - Keeps code simple, defaults to dark
7. **Filter deleted/dead stories** - Cleaner user experience


