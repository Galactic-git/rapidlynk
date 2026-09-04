import { Link } from 'react-router-dom';

const footerLinks = [
  {
    icon: '⇪',
    title: 'Push in your terminal',
    subtitle: 'rapidlynk push',
    to: '/learn',
  },
  {
    icon: '⬇',
    title: 'Pull with secret key',
    subtitle: 'rapidlynk pull <id>:<key>',
    to: '/learn',
  },
  {
    icon: '>_',
    title: 'Download RapidLynk',
    subtitle: 'Windows, macOS, Linux',
    to: '/download',
  },
  {
    icon: '📖',
    title: 'Read the guide',
    subtitle: 'Architecture & Security',
    to: '/about',
  },
  {
    icon: '🐙',
    title: 'Explore the codebase',
    subtitle: 'Open Source MIT',
    href: 'https://github.com/Galactic-git/rapidlynk',
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-black pt-12 pb-16">
      <div className="container-shell space-y-10">
        {/* 5-column retro terminal grid - directly inspired by Croc screenshot */}
        <div className="grid grid-cols-1 divide-y divide-zinc-800 border border-zinc-800 bg-zinc-950/60 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-5">
          {footerLinks.map((item) =>
            item.to ? (
              <Link
                key={item.title}
                to={item.to}
                className="group flex flex-col p-5 transition hover:bg-zinc-900/60 hover:border-pink-500/30"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-pink-400">
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="font-semibold text-white group-hover:text-pink-300">
                    {item.title}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[11px] text-zinc-500 group-hover:text-zinc-400">
                  {item.subtitle}
                </p>
              </Link>
            ) : (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col p-5 transition hover:bg-zinc-900/60 hover:border-purple-500/30"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-purple-400">
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="font-semibold text-white group-hover:text-purple-300">
                    {item.title}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[11px] text-zinc-500 group-hover:text-zinc-400">
                  {item.subtitle}
                </p>
              </a>
            )
          )}
        </div>

        {/* Bottom copyright and metadata */}
        <div className="flex flex-col items-center justify-between gap-4 font-mono text-xs text-zinc-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
            <span>
              RapidLynk · Zero-knowledge encrypted project sharing · Powered by AWS Lambda & S3
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Galactic-git/rapidlynk"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400"
            >
              github
            </a>
            <a
              href="https://www.npmjs.com/package/rapidlynk"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400"
            >
              npm
            </a>
            <Link to="/about" className="hover:text-white">
              architecture
            </Link>
            <Link to="/contribute" className="hover:text-white">
              license
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
