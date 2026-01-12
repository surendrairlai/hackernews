/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#ff6b35',
          hover: '#ff8555',
          muted: 'rgba(255, 107, 53, 0.1)',
        },
        link: {
          DEFAULT: '#70c1ff',
          hover: '#9ed7ff',
        },
        bg: {
          dark: '#151515',
          light: '#ffffff',
          pageDark: '#0a0a0a',
          pageLight: '#fafafa',
          headerDark: 'rgba(21, 21, 21, 0.9)',
          headerLight: 'rgba(255, 255, 255, 0.9)',
          buttonDark: '#1f1f1f',
          buttonLight: '#f5f5f5',
        },
        border: {
          dark: '#2a2a2a',
          light: '#e0e0e0',
        },
        text: {
          dark: '#f5f5f5',
          light: '#0a0a0a',
          mutedDark: '#a0a0a0',
          mutedLight: '#666666',
        },
        discuss: {
          bgDark: 'rgba(112, 193, 255, 0.05)',
          bgLight: 'rgba(112, 193, 255, 0.08)',
          hoverDark: 'rgba(112, 193, 255, 0.12)',
          hoverLight: 'rgba(112, 193, 255, 0.15)',
        },
        skeleton: {
          dark: '#2a2a2a',
          light: '#e0e0e0',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        serif: ['Crimson Pro', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
