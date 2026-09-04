import { useState } from 'react';
import { PageHero } from '../components/PageHero';

export function DownloadPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <PageHero
        eyebrow="Download"
        title="Get RapidLynk for your Platform"
        description="Official binaries for Windows, Linux, and macOS. Zero dependencies, instant setup, and zero-knowledge encrypted transfers."
      />

      <section className="py-12 sm:py-16">
        <div className="container-shell space-y-12">
          {/* Main Windows Installer Hero Card */}
          <div className="card-terminal relative overflow-hidden border-2 border-zinc-800 p-8 sm:p-10 bg-gradient-to-r from-zinc-950 via-[#0d0c14] to-zinc-950">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <span className="badge-pink">Recommended for Windows</span>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  RapidLynk for Windows (x64)
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-zinc-400 font-mono">
                  Download the official setup wizard. Installs <code className="text-pink-400">rapidlynk.exe</code> to your local programs folder and automatically sets your system PATH.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <a
                  href="https://github.com/Galactic-git/rapidlynk/releases/latest/download/RapidLynk-Setup-latest-x64.exe"
                  className="inline-flex items-center gap-3 rounded-lg bg-white px-8 py-4 font-mono text-base font-bold text-black transition hover:bg-zinc-200 shadow-glowPink"
                >
                  <span>⬇</span>
                  <span>Download Installer</span>
                  <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-800">
                    6.05 MB
                  </span>
                </a>
                <span className="font-mono text-xs text-zinc-500">
                  Version 1.0.1 · Windows 10 / 11 64-bit
                </span>
              </div>
            </div>
          </div>

          {/* Quick NPM Box */}
          <div className="card-terminal p-6 border-zinc-800">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-pink-400">NPM PACKAGE</span>
                  <span className="badge-mono">All OS</span>
                </div>
                <h3 className="font-mono text-base font-bold text-white">
                  Install via npm or run directly with npx
                </h3>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded border border-zinc-800 bg-black px-4 py-2 font-mono text-xs text-pink-300">
                  <span className="text-zinc-500">$</span>
                  <code>npm install -g rapidlynk</code>
                  <button
                    onClick={() => copy('npm install -g rapidlynk', 'npm')}
                    className="ml-3 rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 hover:bg-zinc-700"
                  >
                    {copied === 'npm' ? 'Copied! ✓' : 'Copy'}
                  </button>
                </div>

                <div className="flex items-center gap-2 rounded border border-zinc-800 bg-black px-4 py-2 font-mono text-xs text-purple-300">
                  <span className="text-zinc-500">$</span>
                  <code>npx rapidlynk push</code>
                  <button
                    onClick={() => copy('npx rapidlynk push', 'npx')}
                    className="ml-3 rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 hover:bg-zinc-700"
                  >
                    {copied === 'npx' ? 'Copied! ✓' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Standalone Downloads & Checklist */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Standalone Binaries */}
            <div className="card-terminal p-6 sm:p-8 space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-mono text-base font-bold text-white uppercase">
                  Standalone Precompiled Binaries
                </h3>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Single standalone executables with zero installer needed.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Windows Standalone */}
                <div className="flex items-center justify-between border border-zinc-800 bg-zinc-950/60 p-3.5 rounded hover:border-pink-500/40 transition">
                  <div className="flex items-center gap-2.5">
                    <span className="text-pink-400">🪟</span>
                    <div>
                      <p className="font-semibold text-white">Windows (x64 / AMD64)</p>
                      <p className="text-[11px] text-zinc-500">rapidlynk-windows-amd64.exe</p>
                    </div>
                  </div>
                  <a
                    href="https://github.com/Galactic-git/rapidlynk/releases/latest"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1 text-[11px] text-white hover:bg-zinc-700"
                  >
                    Download ↗
                  </a>
                </div>

                {/* macOS Apple Silicon */}
                <div className="flex items-center justify-between border border-zinc-800 bg-zinc-950/60 p-3.5 rounded hover:border-purple-500/40 transition">
                  <div className="flex items-center gap-2.5">
                    <span className="text-purple-400">🍎</span>
                    <div>
                      <p className="font-semibold text-white">macOS (Apple Silicon M1/M2/M3/M4)</p>
                      <p className="text-[11px] text-zinc-500">rapidlynk-darwin-arm64</p>
                    </div>
                  </div>
                  <a
                    href="https://github.com/Galactic-git/rapidlynk/releases/latest"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1 text-[11px] text-white hover:bg-zinc-700"
                  >
                    Download ↗
                  </a>
                </div>

                {/* macOS Intel */}
                <div className="flex items-center justify-between border border-zinc-800 bg-zinc-950/60 p-3.5 rounded hover:border-purple-500/40 transition">
                  <div className="flex items-center gap-2.5">
                    <span className="text-purple-400">🍎</span>
                    <div>
                      <p className="font-semibold text-white">macOS (Intel x64)</p>
                      <p className="text-[11px] text-zinc-500">rapidlynk-darwin-amd64</p>
                    </div>
                  </div>
                  <a
                    href="https://github.com/Galactic-git/rapidlynk/releases/latest"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1 text-[11px] text-white hover:bg-zinc-700"
                  >
                    Download ↗
                  </a>
                </div>

                {/* Linux x64 */}
                <div className="flex items-center justify-between border border-zinc-800 bg-zinc-950/60 p-3.5 rounded hover:border-pink-500/40 transition">
                  <div className="flex items-center gap-2.5">
                    <span className="text-pink-400">🐧</span>
                    <div>
                      <p className="font-semibold text-white">Linux (x64 / AMD64)</p>
                      <p className="text-[11px] text-zinc-500">rapidlynk-linux-amd64</p>
                    </div>
                  </div>
                  <a
                    href="https://github.com/Galactic-git/rapidlynk/releases/latest"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1 text-[11px] text-white hover:bg-zinc-700"
                  >
                    Download ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Installation Checklist */}
            <div className="card-terminal p-6 sm:p-8 space-y-5">
              <h3 className="font-mono text-base font-bold text-white uppercase">
                Install Checklist
              </h3>
              <ul className="space-y-4 font-mono text-xs text-zinc-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-pink-400">01</span>
                  <span>Download the latest Windows x64 setup wizard.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-pink-400">02</span>
                  <span>Run setup with standard user permissions (no admin required).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-purple-400">03</span>
                  <span>Open PowerShell or terminal and verify with <code className="text-white">rapidlynk --version</code>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-purple-400">04</span>
                  <span>Start transferring with <code className="text-white">rapidlynk push</code>!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
