import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e8efff',
          200: '#cddcff',
          300: '#a5c0ff',
          400: '#7aa0ff',
          500: '#567fff',
          600: '#3f63f2',
          700: '#304dd1',
          800: '#2a42a6',
          900: '#273c86',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
