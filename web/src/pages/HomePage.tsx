import { useState } from 'react';
import { ButtonLink } from '../components/ButtonLink';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<'files' | 'cli'>('files');
  const [sendMode, setSendMode] = useState<'s3' | 'direct'>('s3');
  const [secretInput, setSecretInput] = useState(
    '7fff765f8f40865fe377b8bbb047666d:GFe5LmnPeJfkJ4bRQYAizrgl0reokQa1ILRCsMdj8yQ='
  );
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(label);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="space-y-16 pb-24 sm:space-y-20">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-12">
        <div className="container-shell space-y-8">
          {/* Eyebrow & Title - Inspired by Croc Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge-pink">
                Zero-Knowledge Encrypted
              </span>
              <span className="badge-purple">
                AWS Lambda + S3
              </span>
              <span className="badge-mono">
                CLI v1.0.1
              </span>
            </div>

            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              RAPIDLYNK IS A FREE AND OPEN-SOURCE TOOL TO
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Send files, secured <br className="hidden sm:inline" />
              end-to-end.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Encrypt your project locally with AES-256-GCM and transfer directly to Amazon S3 via presigned URLs.
              Your encryption keys never touch the server.
            </p>
          </div>

          {/* Mode Switcher Tabs (Files / CLI) */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 rounded px-4 py-2 font-mono text-xs font-semibold transition ${
                activeTab === 'files'
                  ? 'border border-pink-500/50 bg-pink-950/40 text-pink-300 shadow-glowPink'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <span>⇪</span>
              <span>Interactive Transfer</span>
            </button>
            <button
              onClick={() => setActiveTab('cli')}
              className={`flex items-center gap-2 rounded px-4 py-2 font-mono text-xs font-semibold transition ${
                activeTab === 'cli'
                  ? 'border border-purple-500/50 bg-purple-950/40 text-purple-300 shadow-glowPurple'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <span>&gt;_</span>
              <span>CLI Commands</span>
            </button>
          </div>

          {/* Dual Action Panels (Send & Receive) - Direct Croc Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Box: SEND */}
            <div className="card-terminal flex flex-col justify-between p-6 sm:p-7">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded border border-pink-500/40 bg-pink-950/50 text-sm text-pink-400">
                      ⇪
                    </span>
                    <div>
                      <h2 className="font-mono text-base font-bold text-white">Send</h2>
                      <p className="font-mono text-[11px] text-zinc-400">
                        Bundle several files or full project. Share one secret.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-pink-400">
                    AES-256-GCM
                  </span>
                </div>

                {/* Sub-mode selector */}
                <div className="grid grid-cols-2 gap-2 border border-zinc-800 p-1 bg-black/60 rounded">
                  <button
                    onClick={() => setSendMode('s3')}
                    className={`rounded py-1.5 font-mono text-xs transition ${
                      sendMode === 's3'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Encrypted S3
                  </button>
                  <button
                    onClick={() => setSendMode('direct')}
                    className={`rounded py-1.5 font-mono text-xs transition ${
                      sendMode === 'direct'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Direct Channel
                  </button>
                </div>

                {/* Interactive Drag / Terminal Box */}
                <div className="relative rounded border border-dashed border-zinc-700 bg-black/80 p-6 text-center transition hover:border-pink-500/60">
                  <div className="space-y-3">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-pink-500/30 bg-pink-950/40 text-pink-400">
                      📦
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold text-white">
                        Run in any project directory:
                      </p>
                      <div className="mt-2 flex items-center justify-between rounded border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-pink-300">
                        <code>{sendMode === 's3' ? 'rapidlynk push' : 'rapidlynk push -c <channel>'}</code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              sendMode === 's3' ? 'rapidlynk push' : 'rapidlynk push -c team-channel',
                              'push'
                            )
                          }
                          className="rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-700 hover:text-white"
                        >
                          {copiedCommand === 'push' ? 'Copied! ✓' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <p className="font-mono text-[11px] text-zinc-500">
                      Bundles into .tar.gz · Encrypts locally with AES-256-GCM · Direct S3 upload
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4 font-mono text-xs text-zinc-500">
                <span>0 files queued</span>
                <span className="text-zinc-400">Instant encryption</span>
              </div>
            </div>

            {/* Right Box: RECEIVE */}
            <div className="card-terminal flex flex-col justify-between p-6 sm:p-7">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded border border-purple-500/40 bg-purple-950/50 text-sm text-purple-400">
                      ⬇
                    </span>
                    <div>
                      <h2 className="font-mono text-base font-bold text-white">Receive</h2>
                      <p className="font-mono text-[11px] text-zinc-400">
                        Enter secret token or code. Decrypt before restoring.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
                    Zero-Knowledge
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    RapidLynk Secret Code (&lt;file_id&gt;:&lt;key&gt;)
                  </label>
                  <input
                    type="text"
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                    className="input-terminal"
                    placeholder="e.g. 7fff765f8f40865fe377b8bbb047666d:GFe5Lmn..."
                  />
                  <p className="font-mono text-[11px] text-zinc-500">
                    Paste or type the secret token, then run pull to decrypt.
                  </p>
                </div>

                {/* Generated Pull Command */}
                <div className="space-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    CLI Command Preview
                  </span>
                  <div className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-purple-300">
                    <code className="truncate mr-2">rapidlynk pull {secretInput || '&lt;secret&gt;'}</code>
                    <button
                      onClick={() =>
                        copyToClipboard(`rapidlynk pull ${secretInput}`, 'pull')
                      }
                      className="shrink-0 rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                      {copiedCommand === 'pull' ? 'Copied! ✓' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4 font-mono text-xs text-zinc-500">
                <span>Decrypted locally</span>
                <span className="text-zinc-400">100% Client-Side</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download RapidLynk Banner - Direct Croc Inspiration */}
      <section>
        <div className="container-shell">
          <div className="card-terminal relative overflow-hidden border-2 border-zinc-800 p-6 sm:p-8 bg-gradient-to-r from-zinc-950 via-[#0d0c14] to-zinc-950">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-pink-400">
                  RAPIDLYNK CLI
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Download RapidLynk for Windows.
                </h2>
                <p className="font-mono text-xs text-zinc-400">
                  Includes full Windows x64 setup wizard with automatic PATH configuration.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <a
                  href="https://github.com/Galactic-git/rapidlynk/releases/latest/download/RapidLynk-Setup-latest-x64.exe"
                  className="inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3 font-mono text-sm font-bold text-black transition hover:bg-zinc-200 shadow-glowPink"
                >
                  <span>⬇</span>
                  <span>Download v1.0.1</span>
                  <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-800">
                    Windows · 64-bit
                  </span>
                </a>

                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400">
                  <span>Other builds:</span>
                  <a
                    href="https://github.com/Galactic-git/rapidlynk/releases/latest"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 underline hover:text-pink-300"
                  >
                    macOS (Apple Silicon / Intel)
                  </a>
                  <span>·</span>
                  <a
                    href="https://github.com/Galactic-git/rapidlynk/releases/latest"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 underline hover:text-purple-300"
                  >
                    Linux (x64 / ARM64)
                  </a>
                </div>
              </div>
            </div>

            {/* Quick NPM Copy Box inside the banner */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4 font-mono text-xs">
              <span className="text-zinc-400">Prefer npm / npx?</span>
              <div className="flex items-center gap-2 rounded border border-zinc-800 bg-black px-3 py-1.5 text-zinc-300">
                <span className="text-pink-500">$</span>
                <code>npm install -g rapidlynk</code>
                <button
                  onClick={() => copyToClipboard('npm install -g rapidlynk', 'npm')}
                  className="text-zinc-500 hover:text-white text-[11px]"
                >
                  {copiedCommand === 'npm' ? '✓' : 'copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notes & Updates Section - "What happens after you press Send?" */}
      <section>
        <div className="container-shell space-y-8">
          <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-4 sm:flex-row sm:items-end">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-purple-400">
                NOTES & ARCHITECTURE
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                What happens after you press Send?
              </h2>
              <p className="font-mono text-xs text-zinc-400">
                Plainspoken notes about AES-256-GCM encryption, S3 presigned transfers, and zero-knowledge security.
              </p>
            </div>
            <ButtonLink to="/about" variant="secondary" size="sm">
              Read Architecture →
            </ButtonLink>
          </div>

          {/* 3 Numbered Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="card-terminal p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-pink-500">01</span>
                <span className="badge-mono">Local</span>
              </div>
              <h3 className="font-mono text-base font-bold text-white">
                Client-side AES-256-GCM
              </h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                Your directory is bundled into a tar.gz archive and encrypted locally using a freshly generated
                256-bit AES key. The secret key never leaves your computer.
              </p>
            </div>

            <div className="card-terminal p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-purple-500">02</span>
                <span className="badge-mono">AWS S3</span>
              </div>
              <h3 className="font-mono text-base font-bold text-white">
                Direct S3 Presigned Transfer
              </h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                AWS Lambda generates a short-lived presigned upload URL. Your CLI streams the encrypted file directly
                to Amazon S3 without intermediate server bottlenecks.
              </p>
            </div>

            <div className="card-terminal p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-pink-400">03</span>
                <span className="badge-mono">Pull</span>
              </div>
              <h3 className="font-mono text-base font-bold text-white">
                Zero-Knowledge Decrypt
              </h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                The recipient passes the secret token (<code className="text-pink-300">&lt;file_id&gt;:&lt;key&gt;</code>).
                The CLI fetches the payload, decrypts it locally, and extracts the project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Release Highlights - What changed in RapidLynk v1.0.1 */}
      <section>
        <div className="container-shell space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-pink-400">
              UPDATE 03 · SEPTEMBER 2026
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              RapidLynk v1.0.1 — AWS Serverless Migration
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="card-terminal p-6 text-center space-y-3 border-pink-500/30">
              <div className="font-mono text-2xl text-pink-400">&gt;_</div>
              <h4 className="font-mono text-sm font-bold text-white uppercase">Native CLI</h4>
              <p className="font-mono text-xs text-zinc-400">
                Precompiled standalone binaries for Windows, macOS, and Linux with zero runtime dependencies.
              </p>
            </div>

            <div className="card-terminal p-6 text-center space-y-3 border-purple-500/30">
              <div className="font-mono text-2xl text-purple-400">⚡</div>
              <h4 className="font-mono text-sm font-bold text-white uppercase">AWS S3 Presigned</h4>
              <p className="font-mono text-xs text-zinc-400">
                Direct-to-S3 streaming via presigned URLs avoids relay limits and ensures maximum transfer speed.
              </p>
            </div>

            <div className="card-terminal p-6 text-center space-y-3 border-zinc-700">
              <div className="font-mono text-2xl text-white">🔒</div>
              <h4 className="font-mono text-sm font-bold text-white uppercase">Zero-Knowledge</h4>
              <p className="font-mono text-xs text-zinc-400">
                Client-side AES-256-GCM encryption ensures Amazon S3 and Lambda only ever see encrypted bytes.
              </p>
            </div>
          </div>

          {/* Social Proof & Stats Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border border-zinc-800 bg-zinc-950/60 p-4 font-mono text-xs text-zinc-400 sm:flex-row rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-white font-semibold">5.0/5</span>
              <span>from open-source developers</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Galactic-git/rapidlynk"
                target="_blank"
                rel="noreferrer"
                className="text-pink-400 hover:underline"
              >
                + star on GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/rapidlynk"
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:underline"
              >
                + view on npm
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
