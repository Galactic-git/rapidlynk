import { NavLink } from 'react-router-dom';
import { ButtonLink } from './ButtonLink';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Download', to: '/download' },
  // { label: 'Docs', to: '/docs' },
  { label: 'Learn', to: '/learn' },
  { label: 'About', to: '/about' },
  // { label: 'Blog', to: '/blog' },
  { label: 'Contribute', to: '/contribute' }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-abyss/90 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <NavLink to="/" className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-purple-500/25 bg-purple-950/60 shadow-glow">
            <img src="/images/logo.png" alt="RapidLynk logo" className="h-7 w-7 object-contain" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-purple-200">RapidLynk</span>
            <span className="block text-xs text-slate-400">CLI for fast transfer workflows</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-purple-950/80 text-white ring-1 ring-purple-500/40'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ButtonLink to="/download" size="sm">
          Download
        </ButtonLink>
      </div>
    </header>
  );
}
