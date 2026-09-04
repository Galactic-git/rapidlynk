import { NavLink } from 'react-router-dom';
import { ButtonLink } from './ButtonLink';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Download', to: '/download' },
  { label: 'Learn', to: '/learn' },
  { label: 'About', to: '/about' },
  { label: 'Contribute', to: '/contribute' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/95 backdrop-blur-md">
      {/* Top announcement bar - inspired by reference */}
      <div className="border-b border-zinc-800/60 bg-gradient-to-r from-zinc-950 via-purple-950/40 to-pink-950/30 px-4 py-1.5 text-xs text-zinc-300">
        <div className="container-shell flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-300">
              <strong className="text-white">RapidLynk v1.0.1</strong> is live — AWS Serverless backend & zero-knowledge AES-256-GCM encryption.
            </span>
          </div>
          <a
            href="https://github.com/Galactic-git/rapidlynk"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 font-mono text-[11px] text-pink-400 hover:text-pink-300 sm:inline-flex"
          >
            <span>Star on GitHub ★</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container-shell flex h-16 items-center justify-between gap-6">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-950/60 shadow-glowPurple">
            <img src="/images/logo.png" alt="RapidLynk logo" className="h-6 w-6 object-contain" />
          </span>
          <div>
            <span className="block font-mono text-sm font-bold tracking-wider text-white">
              RAPIDLYNK
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-zinc-500">
              CLI & Cloud sharing
            </span>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded px-3 py-1.5 font-mono text-xs transition ${
                  isActive
                    ? 'border border-pink-500/40 bg-pink-950/30 text-pink-300 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://www.npmjs.com/package/rapidlynk"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1 font-mono text-[11px] text-zinc-400 hover:border-pink-500/50 hover:text-pink-300 sm:flex"
            title="NPM Package"
          >
            <span className="text-pink-500">npm</span> v1.0.1
          </a>

          <a
            href="https://github.com/Galactic-git/rapidlynk"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
            title="GitHub Repository"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <ButtonLink to="/download" size="sm" variant="stark">
            Download
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
