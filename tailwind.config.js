/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        display: ['Cinzel', 'serif'],
      },
      colors: {
        king: {
          primary: 'var(--king-primary)',
          primaryLight: 'var(--king-primary-light)',
          secondary: 'var(--king-secondary)',
          dark: '#0F172A',
          cream: '#FDFBF7',
          surface: '#FFFFFF',
          muted: '#94A3B8',
          text: '#1E293B',
          teal: '#14B8A6',
          amber: '#F59E0B',
          purple: '#A855F7',
          blue: '#6366F1',
        }
      },
      backgroundImage: {
        'king-gradient': 'linear-gradient(135deg, var(--king-primary) 0%, var(--king-primary-light) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)',
      },
      boxShadow: {
        'regal': '0 10px 40px -10px rgba(20, 184, 166, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
        'glow': '0 0 20px -5px var(--king-primary)',
      },
      animation: {
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'reverse-spin': 'spin 15s linear infinite reverse',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    }
  },
  plugins: [],
}