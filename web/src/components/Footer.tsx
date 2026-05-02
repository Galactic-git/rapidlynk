import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-shell flex flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>RapidLynk CLI. Built for practical, low-friction data transfer.</p>
        <div className="flex gap-4">
          {/* <Link to="/docs" className="hover:text-white">Docs</Link> */}
          {/* <Link to="/blog" className="hover:text-white">Blog</Link> */}
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contribute" className="hover:text-white">Contribute</Link>
        </div>
      </div>
    </footer>
  );
}
