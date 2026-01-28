# Hacker News Redesign

A modern, responsive redesign of Hacker News built with React, TypeScript, and Tailwind CSS. This application provides an improved user experience with dark/light theme support, flexible layout options, and smooth interactions.

## 🚀 Features

- **🌓 Dark/Light Theme Toggle** 
- **📐 Grid/List Layout Toggle**
- **📰 Top/New Stories** 
- **📱 Fully Responsive** 
- **🔄 Auto-refresh** - Data refreshes every 60 seconds
- **💾 Smart Caching** - React Query caches API responses
- **⚡ Fast Performance** 
- **🧪 E2E Testing** 

## 🛠️ Tech Stack

- **React 18** 
- **TypeScript**
- **Tailwind CSS 3** 
- **Vite** 
- **React Query (TanStack Query)** - Server state management & caching
- **Playwright** 
- **Hacker News Firebase API** 

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🏃 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hackernews

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Testing

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed
```

## 📁 Project Structure

```
hackernews/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navigation header with toggles
│   │   ├── StoryCard.tsx       # Story display component (grid/list/skeleton)
│   │   └── LoadingError.tsx    # Error states and load more button
│   ├── config/
│   │   └── constants.ts        # App constants (API URL, pagination, time intervals)
│   ├── hooks/
│   │   └── useStories.ts       # React Query hooks for data fetching
│   ├── services/
│   │   └── hnAPI.ts            # Hacker News API service functions
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point with QueryClientProvider
│   └── index.css               # Global styles and Tailwind imports
├── tests/
│   └── app.spec.js             # Playwright E2E tests
├── public/
│   └── favicon.svg             # Hacker News favicon
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── playwright.config.js        # Playwright test configuration
└── package.json                # Dependencies and scripts
```

## 🏗️ Architecture

### Component Hierarchy

```
App
├── Header
│   ├── View Toggle (Top/New)
│   ├── Layout Toggle (Grid/List) - Hidden on mobile
│   └── Theme Toggle (Dark/Light)
└── Main Content
    ├── Story List/Grid
    │   └── StoryCard (multiple)
    └── Load More Button
```

### Data Flow with React Query

1. **Initial Load**
   - User opens the app
   - `useStoryIds` hook fetches story IDs (cached for 30 seconds)
   - `useStoriesData` hook fetches story details in parallel
   - Stories are displayed in the selected layout

2. **Caching & Auto-refresh**
   - Data is cached and considered fresh for 30 seconds
   - Auto-refresh every 60 seconds keeps data up-to-date
   - Switching views uses cached data if available (instant!)

3. **View Change**
   - User clicks "Top Stories" or "New Stories"
   - If cached data exists and is fresh, displays instantly
   - Otherwise fetches new story IDs
   - Display count resets

4. **Load More**
   - User clicks "Load More" button
   - App loads next 30 stories from remaining IDs
   - New stories are appended to existing list


### API Integration

The app uses the official [Hacker News Firebase API](https://github.com/HackerNews/API):

- **Base URL**: `https://hacker-news.firebaseio.com/v0`
- **Endpoints**:
  - `/topstories.json` - Returns array of top story IDs
  - `/newstories.json` - Returns array of new story IDs
  - `/item/{id}.json` - Returns story details

### Key Features Implementation

#### React Query Integration
- `useStoryIds` - Fetches and caches story ID lists
- `useStoriesData` - Fetches and caches story details
- `staleTime: 30s` - Data considered fresh for 30 seconds
- `refetchInterval: 60s` - Auto-refresh every minute
- `gcTime: 30min` - Cached data kept for 30 minutes

#### Theme Toggle
- Uses Tailwind's dark mode with class strategy
- Toggles `dark` class on `document.documentElement`

#### Layout Toggle
- Grid: Responsive 1/2/3 column layout (mobile/tablet/desktop)
- List: Single column vertical layout
- Layout toggle hidden on mobile (always uses list)

#### Mobile Optimization
- Automatically detects mobile screen size (< 768px)
- Forces list layout on mobile for better UX
- Layout toggle button hidden on mobile devices

#### Pagination
- Loads 15 stories initially, then 30 per page
- "Load More" button appears when more stories are available
- Parallel fetching of story details for performance
- Filters out deleted and dead stories

## 🎨 Styling

The application uses Tailwind CSS with a custom color scheme:

- **Dark Theme**: Dark backgrounds with light text
- **Light Theme**: Light backgrounds with dark text
- **Accent Colors**: Used for active states and highlights
- **Responsive Breakpoints**: Mobile-first approach

## 🧪 Testing

The project includes comprehensive Playwright tests covering:

- ✅ Story loading and display
- ✅ Theme switching
- ✅ Layout switching
- ✅ View switching (Top/New stories)
- ✅ Responsive behavior (desktop/mobile)

Run tests with:
```bash
npm test
```

### Playwright Configuration
- Tests run against `http://localhost:3000`
- Automatically starts dev server if not running
- Captures videos and traces on failure


## Assumptions

- The official Hacker News API is read-only; posting comments or voting is out of scope.
- The application focuses on content discovery and readability, not full interaction.
- Story discussions and comments link out to news.ycombinator.com.
- Pagination is implemented as incremental loading ("Load More") to keep UX predictable and avoid excessive API requests.
- Story IDs are fetched first, followed by batched item requests, as required by the Hacker News API design
- Deleted and dead stories are filtered out and not displayed
- Grid/List layout is a user preference, while mobile devices are forced to list view for readability
- End-to-end tests use the live Hacker News API, which may introduce some flakiness; API mocking would be used in a production setup

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run Playwright tests
