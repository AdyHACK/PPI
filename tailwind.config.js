/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#F5F7F1',
          secondary: '#EEF3EA',
          soft: '#EAF0E7',
          card: '#FFFFFF',
          tint: '#F0F4EC',
          cream: '#FAF9F3',
          sidebar: '#FFFFFF',
          elevated: '#FFFFFF',
          mint: '#DDEADF',
          sage: '#91A88F',
          sequence: '#F0F4EC',
          subtle: '#EEF3EA'
        },
        forest: {
          DEFAULT: '#234737',
          deep: '#193C30',
          dark: '#142F25',
          light: '#2E5E4B',
          secondary: '#315344'
        },
        botanical: {
          green: '#193C30',
          sage: '#91A88F',
          olive: '#A8B393',
          mint: '#DDEADF',
          teal: '#6B9B8B',
          cream: '#FAF9F3',
          tint: '#F0F4EC'
        },
        brand: {
          primary: '#234737',
          secondary: '#6B9B8B',
          forest: '#234737',
          botanical: '#193C30',
          sage: '#91A88F',
          olive: '#A8B393',
          teal: '#6B9B8B',
          mint: '#DDEADF',
          accent: '#91A88F'
        },
        text: {
          primary: '#193C30',
          heading2: '#315344',
          body: '#52665A',
          secondary: '#66786C',
          muted: '#718074',
          technical: '#63766A'
        },
        slate: {
          primary: '#193C30',
          secondary: '#66786C',
          muted: '#718074',
          border: '#E2E8DF',
          subtle: '#E2E8DF',
          light: '#234737'
        },
        status: {
          success: '#43866B',
          warning: '#C69B55',
          error: '#C87575',
          info: '#6B9B8B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(36, 74, 59, 0.04), 0 1px 2px rgba(36, 74, 59, 0.02)',
        'card': '0 1px 4px rgba(36, 74, 59, 0.05)',
        'card-hover': '0 6px 18px -2px rgba(36, 74, 59, 0.09)',
        'dropdown': '0 10px 25px -4px rgba(36, 74, 59, 0.12)',
        'soft': '0 2px 8px rgba(36, 74, 59, 0.06)'
      }
    },
  },
  plugins: [],
}
