import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette Le Quai Ouest
        'bleu-baie': '#1a3a4a',
        'blanc-ecume': '#f8f6f0',
        'granit': '#6b7b8d',
        'ardoise': '#2d3a45',
        'cognac': '#c47d3b',
        'or-chaud': '#d4a843',
        'sable': '#e8dcc8',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
