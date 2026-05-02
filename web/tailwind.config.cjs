module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#07070b',
        panel: '#0f1020',
        panelSoft: '#16172b',
        border: '#262843',
        purple: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139, 92, 246, 0.18), 0 24px 80px rgba(76, 29, 149, 0.35)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(167, 139, 250, 0.16) 1px, transparent 0)',
        hero: 'radial-gradient(circle at top left, rgba(124, 58, 237, 0.24), transparent 34%), radial-gradient(circle at top right, rgba(76, 29, 149, 0.2), transparent 26%), linear-gradient(180deg, rgba(10,10,18,0.98), rgba(7,7,11,1))'
      }
    }
  },
  plugins: []
};
