import { ReactNode, useMemo, useState } from 'react';
import { PageHero } from '../components/PageHero';
import { TerminalDemo } from '../components/TerminalDemo';

type LearnItem = {
  id: string;
  label: string;
  title: string;
  content: ReactNode;
};

function InlinePanel({ children }: { children: ReactNode }) {
  return <div className="border-l border-purple-500/20 pl-5 text-slate-300">{children}</div>;
}

export function LearnPage() {
  const items = useMemo<LearnItem[]>(
    () => [
      {
        id: 'overview',
        label: 'Overview',
        title: 'Use Cases of RapidLynk',
        content: (
          <div className="space-y-5">
            <p>
              RapidLynk is built for developers who need fast, simple, and sometimes secure data sharing from the
              terminal.
            </p>
            <p>
              It gives you two modes: <span className="text-white">secure one-time sharing</span> through secrets and{' '}
              <span className="text-white">fast reusable sharing</span> through channels.
            </p>
            <InlinePanel>
              <p>
                <span className="text-white">Secure Mode</span> → encrypted, one-time sharing with `rapidlynk push`
              </p>
              <p className="mt-2">
                <span className="text-white">Channel Mode</span> → fast, reusable team sharing with `rapidlynk push -c`
              </p>
            </InlinePanel>
          </div>
        )
      },
      {
        id: 'manager-share',
        label: '1. Manager Share',
        title: '🧑‍💼 Share a Project with Your Manager',
        content: (
          <div className="space-y-5">
            <p>
              You’ve finished a feature and want to send it quickly without pushing to Git, setting up access, or
              uploading to Drive.
            </p>
            <TerminalDemo
              label="one-time secure share"
              command="rapidlynk push"
              lines={[
                { text: '📦 Bundling project...', tone: 'muted' },
                { text: '🔒 Encrypting...', tone: 'muted' },
                { text: '☁️ Uploading...', tone: 'muted' },
                { text: '✅ Share this secret:', tone: 'success' },
                { text: '98c3...f17:qyj-sRJa3tgZj-QqUmrOBCpANKe3N4hbXzLXSCKSH4g=', tone: 'accent' }
              ]}
            />
            <p>Send the secret to your manager.</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>No repo setup</li>
              <li>No permissions needed</li>
              <li>Fully encrypted</li>
              <li>Works instantly</li>
            </ul>
          </div>
        )
      },
      {
        id: 'own-machines',
        label: '2. Own Machines',
        title: '👨‍💻 Share Code Between Your Own Machines',
        content: (
          <div className="space-y-5">
            <p>
              Move work between laptop and office PC, or between local and remote machines, without forcing a Git
              commit.
            </p>
            <div className="space-y-4">
              <TerminalDemo
                label="send from one machine"
                command="rapidlynk push"
                lines={[
                  { text: '📦 Bundling project...', tone: 'muted' },
                  { text: '🔒 Encrypting...', tone: 'muted' },
                  { text: '☁️ Uploading...', tone: 'muted' }
                ]}
              />
              <TerminalDemo
                label="restore on another machine"
                command="rapidlynk pull <secret>"
                lines={[
                  { text: '📥 Downloading...', tone: 'muted' },
                  { text: '🔓 Decrypting...', tone: 'muted' },
                  { text: '📂 Extracting files...', tone: 'muted' }
                ]}
              />
            </div>
            <ul className="list-disc space-y-2 pl-5">
              <li>No Git commits needed</li>
              <li>No USB drives</li>
              <li>No cloud login</li>
            </ul>
          </div>
        )
      },
      {
        id: 'sensitive-files',
        label: '3. Sensitive Files',
        title: '🔐 Share Sensitive Files Securely',
        content: (
          <div className="space-y-5">
            <p>
              Use `rapidlynk push` for `.env` files, credentials, and private configuration that should never travel in
              plaintext.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Uses AES-GCM encryption</li>
              <li>Server never sees raw data</li>
              <li>Only the secret holder can decrypt</li>
            </ul>
          </div>
        )
      },
      {
        id: 'channels',
        label: '4. Channels',
        title: '📡 Team Collaboration with Channels',
        content: (
          <div className="space-y-5">
            <p>
              Channels are for repeated sharing. Publish to a named team stream and let teammates pull the latest
              payload when they need it.
            </p>
            <div className="space-y-4">
              <TerminalDemo
                label="team publish"
                command="rapidlynk push -c frontend-team"
                lines={[
                  { text: '📦 Bundling project...', tone: 'muted' },
                  { text: '☁️ Uploading to channel "frontend-team"...', tone: 'muted' },
                  { text: '✅ Available to all channel members', tone: 'success' }
                ]}
              />
              <TerminalDemo
                label="team pull"
                command="rapidlynk pull -c frontend-team"
                lines={[
                  { text: '📥 Fetching latest from "frontend-team"...', tone: 'muted' },
                  { text: '📂 Restored successfully', tone: 'success' }
                ]}
              />
            </div>
            <InlinePanel>
              <p>Channels do not use encryption currently.</p>
              <p className="mt-2">Best for builds, assets, and other non-sensitive data.</p>
            </InlinePanel>
          </div>
        )
      },
      {
        id: 'cicd',
        label: '5. CI/CD Sharing',
        title: '⚡ CI/CD or Build Sharing',
        content: (
          <div className="space-y-5">
            <p>
              After building a project, publish artifacts to a shared channel and let other systems pull the latest
              build.
            </p>
            <div className="space-y-4">
              <TerminalDemo
                label="publish build"
                command="rapidlynk push -c builds"
                lines={[
                  { text: '📦 Bundling project...', tone: 'muted' },
                  { text: '☁️ Uploading to channel "builds"...', tone: 'muted' }
                ]}
              />
              <TerminalDemo
                label="consume build"
                command="rapidlynk pull -c builds"
                lines={[
                  { text: '📥 Fetching latest from "builds"...', tone: 'muted' },
                  { text: '📂 Restored successfully', tone: 'success' }
                ]}
              />
            </div>
          </div>
        )
      },
      {
        id: 'debug-sharing',
        label: '6. Debug Sharing',
        title: '🧪 Quick Debug Sharing',
        content: (
          <div className="space-y-5">
            <p>
              Package the failing project state with `rapidlynk push`, send the secret, and let a teammate pull the same
              bundle to reproduce the issue.
            </p>
          </div>
        )
      },
      {
        id: 'aes-gcm',
        label: 'AES-GCM Encryption',
        title: '🔐 AES-GCM Encryption',
        content: (
          <div className="space-y-6">
            <p>
              RapidLynk uses AES-GCM, a modern encryption standard used in HTTPS, TLS, and secure messaging systems.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Encryption Flow</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>Generate a random key unique per upload</li>
                  <li>Bundle files into an archive</li>
                  <li>Encrypt locally using AES-GCM before upload</li>
                  <li>Upload encrypted data only</li>
                  <li>Return `&lt;file-id&gt;:&lt;encryption-key&gt;`</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Decryption Flow</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>Split the secret into ID and key</li>
                  <li>Download encrypted data</li>
                  <li>Decrypt locally using AES-GCM</li>
                  <li>Extract files</li>
                </ol>
              </div>
            </div>
            <InlinePanel>
              <p>Confidentiality: data cannot be read without the key.</p>
              <p className="mt-2">Integrity: tampering is detected during decryption.</p>
              <p className="mt-2">Authentication: the payload is validated as trusted data.</p>
            </InlinePanel>
            <div>
              <h3 className="text-lg font-semibold text-white">Security Model</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Encryption happens on the client</li>
                <li>The key is never sent to the server</li>
                <li>The server stores only encrypted data</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        id: 'mode-selection',
        label: 'When to Use What',
        title: '🧠 When to Use What',
        content: (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.04] text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Feature</th>
                    <th className="px-4 py-3 font-medium">One-time (`push`)</th>
                    <th className="px-4 py-3 font-medium">Channel (`-c`)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10"><td className="px-4 py-3 text-white">Encryption</td><td className="px-4 py-3">AES-GCM</td><td className="px-4 py-3">No</td></tr>
                  <tr className="border-t border-white/10"><td className="px-4 py-3 text-white">Security</td><td className="px-4 py-3">High</td><td className="px-4 py-3">Medium</td></tr>
                  <tr className="border-t border-white/10"><td className="px-4 py-3 text-white">Speed</td><td className="px-4 py-3">Medium</td><td className="px-4 py-3">Fast</td></tr>
                  <tr className="border-t border-white/10"><td className="px-4 py-3 text-white">Reusability</td><td className="px-4 py-3">No</td><td className="px-4 py-3">Yes</td></tr>
                </tbody>
              </table>
            </div>
            <div className="space-y-4">
              <p><span className="text-white">Use `rapidlynk push`</span> when data is sensitive, sharing is one-time, and security matters.</p>
              <p><span className="text-white">Use `rapidlynk push -c`</span> when working with a team, sharing repeatedly, and speed matters more.</p>
            </div>
          </div>
        )
      },
      {
        id: 'positioning',
        label: 'Positioning',
        title: '🚀 Positioning',
        content: (
          <div className="space-y-5">
            <p className="text-lg leading-8 text-white">
              “RapidLynk lets you instantly share data from the terminal — securely when it matters, and fast when it
              doesn’t.”
            </p>
          </div>
        )
      }
    ],
    []
  );

  const [activeId, setActiveId] = useState(items[0].id);
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <>
      <PageHero
        eyebrow="Learn"
        title="Use Cases of RapidLynk"
        description="RapidLynk is built for developers who need fast, simple, and sometimes secure data sharing from the terminal."
      />

      <section className="pb-20">
        <div className="container-shell grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:self-start">
            <div className="border-r border-white/10 pr-4">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Learn Sections</p>
              <nav className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className={`block w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                      activeId === item.id
                        ? 'bg-white/[0.05] text-white'
                        : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold text-white">{activeItem.title}</h2>
              </div>
              <div className="space-y-5 text-sm leading-7 text-slate-300 sm:text-base">{activeItem.content}</div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
