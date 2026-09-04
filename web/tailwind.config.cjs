/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        abyss: '#050508',
        surface: '#0a0a0f',
        surfaceRaised: '#121218',
        surfaceBorder: '#27272a',
        borderMuted: '#1f1f23',
        purple: {
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#581c87',
          900: '#3b0764',
          950: '#1e0538',
        },
        pink: {
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glowPurple: '0 0 25px rgba(168, 85, 247, 0.25)',
        glowPink: '0 0 25px rgba(236, 72, 153, 0.25)',
        glowDual: '0 0 35px rgba(168, 85, 247, 0.2), 0 0 65px rgba(236, 72, 153, 0.15)',
        card: '0 4px 20px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'gradient-pink-purple': 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
        'gradient-purple-pink': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'grid-pattern': 'radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.12) 1px, transparent 0)',
        'grid-pattern-purple': 'radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.12) 1px, transparent 0)',
      }
    }
  },
  plugins: []
};
