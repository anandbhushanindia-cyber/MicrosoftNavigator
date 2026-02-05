/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      fontFamily: {
        display: ['"SF Pro Display"', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        text: ['"SF Pro Text"', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
      },
      colors: {
        // Ink shades (dark backgrounds)
        ink: {
          950: '#0A0E1A',
          900: '#10162A',
          800: '#141C33',
          700: '#1A2342',
          600: '#202A52',
        },
        // Mist shades (light text)
        mist: {
          DEFAULT: '#E6EAF5',
          100: '#F5F7FA',
          200: '#E9EEF9',
          300: '#D4DBEB',
          400: '#B8C4DD',
        },
        // Aurora (primary blue)
        aurora: {
          DEFAULT: '#7BA7FF',
          50: '#F0F5FF',
          100: '#E0EBFF',
          200: '#C7DAFF',
          300: '#A3C1FF',
          400: '#7BA7FF',
          500: '#5B8FFF',
          600: '#3B75FF',
          700: '#1F5FED',
          800: '#1649C7',
          900: '#0F3699',
        },
        // Glow (secondary light blue)
        glow: {
          DEFAULT: '#B8D0FF',
          50: '#F5F9FF',
          100: '#EBF3FF',
          200: '#D6E7FF',
          300: '#B8D0FF',
          400: '#94B8FF',
          500: '#6F9FFF',
        },
        // Accent colors
        accent: {
          purple: '#A78BFA',
          pink: '#F472B6',
          orange: '#FB923C',
          green: '#4ADE80',
          cyan: '#22D3EE',
        }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      boxShadow: {
        'glass': '0 20px 80px -40px rgba(15, 23, 42, 0.75)',
        'glass-lg': '0 30px 100px -50px rgba(15, 23, 42, 0.85)',
        'aurora': '0 0 20px rgba(123, 167, 255, 0.3), 0 0 40px rgba(123, 167, 255, 0.2)',
        'glow': '0 0 30px rgba(184, 208, 255, 0.4)',
        'inner-glass': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '28px',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'fade-in': 'fadeIn 0.6s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-aurora': 'linear-gradient(135deg, #7BA7FF 0%, #B8D0FF 100%)',
        'gradient-dark': 'linear-gradient(135deg, rgba(20, 28, 51, 0.8), rgba(16, 22, 42, 0.6))',
      },
    },
  },
  plugins: [],
}