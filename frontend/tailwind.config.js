/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // User Swatch 1: ICE SILVER (#DDE3E8)
        silver: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E9EFF4',
          300: '#DDE3E8', // USER SWATCH "ICE SILVER"
          400: '#C2CBD2',
          500: '#9DA9B4',
          600: '#667584',
          700: '#475461',
          800: '#2E3842',
          900: '#1A2127',
        },
        // User Swatch 2: DEEP AUBERGINE (#3A0F34)
        aubergine: {
          50: '#FBF5FA',
          100: '#F4E5F2',
          200: '#E6C4E1',
          300: '#D297CB',
          400: '#AA4C9F',
          500: '#7B2271',
          600: '#55174E',
          700: '#3A0F34', // USER SWATCH "DEEP AUBERGINE"
          800: '#290A25',
          850: '#1F071C',
          900: '#160413',
          950: '#0E030D', // DEEP AUBERGINE VOID
        },
        // User Swatch 3: MARIGOLD (#EAAA00)
        marigold: {
          50: '#FFFDF0',
          100: '#FFF9D6',
          200: '#FFF1A8',
          300: '#FFE26B',
          400: '#FFD12E',
          500: '#EAAA00', // USER SWATCH "MARIGOLD"
          600: '#C79000',
          700: '#9E7200',
          800: '#755400',
          900: '#4D3700',
        },
        // Primary brand maps to Marigold for energetic, human warmth
        brand: {
          50: '#FFFDF0',
          100: '#FFF9D6',
          200: '#FFF1A8',
          300: '#FFE26B',
          400: '#FFD12E',
          500: '#EAAA00', // USER SWATCH "MARIGOLD"
          600: '#C79000',
          700: '#9E7200',
          800: '#755400',
          900: '#4D3700',
        },
        accent: {
          300: '#D297CB',
          400: '#AA4C9F',
          500: '#7B2271',
          600: '#3A0F34', // USER SWATCH "DEEP AUBERGINE"
        },
        obsidian: {
          950: '#050608',
          900: '#08090C', // PURE LUXURY OBSIDIAN CANVAS
          850: '#0D0F14', // LIFTED SURFACE
          800: '#12151D', // ELEVATED CARDS
          750: '#171B26', // CHIPS / INPUTS
          700: '#1F2433', // BORDER SUBTLE
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
