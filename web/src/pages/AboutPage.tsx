import { PageHero } from '../components/PageHero';
import { TerminalDemo } from '../components/TerminalDemo';

const tradeoffs = [
  { feature: 'Encryption', secret: 'AES-GCM', channel: 'Not currently' },
  { feature: 'Reusable', secret: 'No', channel: 'Yes' },
  { feature: 'Speed', secret: 'Medium', channel: 'Fast' },
  { feature: 'Use case', secret: 'Secure sharing', channel: 'Team workflows' }
];

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="How RapidLynk works"
        description="RapidLynk is a developer-first CLI for instant file transfer — with built-in encryption for secrets and ultra-fast channels for teams."
      />

      <section className="pb-10">
        <div className="container-shell">
          <div className="card-surface p-8">
            <h2 className="text-2xl font-semibold text-white">🔐 How RapidLynk Works</h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
              RapidLynk is a CLI-first file and data transfer tool designed for speed, simplicity, and secure sharing.
              It supports two core workflows: one-time secure sharing with secrets and reusable channels for team
              workflows. Each mode is optimized for a different use case.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container-shell grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="card-surface p-8">
            <h2 className="text-2xl font-semibold text-white">🔒 One-Time Sharing (Encrypted by Default)</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              When you run `rapidlynk push`, RapidLynk performs a secure end-to-end pipeline. Files are bundled,
              encrypted locally, uploaded as ciphertext, and returned as a secret in the format
              `&lt;file-id&gt;:&lt;encryption-key&gt;`.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white">1. 📦 Bundling</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Files are compressed into a single archive to reduce size and preserve structure before transfer.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">2. 🔒 Encryption (AES-GCM)</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  RapidLynk uses AES-GCM for confidentiality, integrity, and authentication. A random symmetric key is
                  generated, data is encrypted locally on the user machine, and the key is never sent to the server.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">3. ☁️ Upload</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The server stores only ciphertext. Without the full secret, it cannot decrypt the uploaded payload.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">🔑 Why this is secure</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Only someone with the full secret can access the data. Even if the server is compromised, the payload
                  remains unreadable. This is end-to-end encryption.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <TerminalDemo
              label="secret push"
              command="rapidlynk push"
              lines={[
                { text: '📦 Bundling project...', tone: 'muted' },
                { text: '🔒 Encrypting...', tone: 'muted' },
                { text: '☁️ Uploading...', tone: 'muted' },
                { text: '✅ Share this secret:', tone: 'success' },
                {
                  text: '98c3095f67f5072152c4f141e1900f17:qyj-sRJa3tgZj-QqUmrOBCpANKe3N4hbXzLXSCKSH4g=',
                  tone: 'accent'
                }
              ]}
            />
            <TerminalDemo
              label="secret pull"
              command="rapidlynk pull <secret>"
              lines={[
                { text: '🔑 Validating secret...', tone: 'muted' },
                { text: '📥 Downloading...', tone: 'muted' },
                { text: '🔓 Decrypting...', tone: 'muted' },
                { text: '📂 Extracting files...', tone: 'muted' },
                { text: '✅ Project restored successfully', tone: 'success' }
              ]}
            />
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <TerminalDemo
              label="channel push"
              command="rapidlynk push -c my-team"
              lines={[
                { text: '📦 Bundling project...', tone: 'muted' },
                { text: '☁️ Uploading to channel \"my-team\"...', tone: 'muted' },
                { text: '✅ Available to all channel members', tone: 'success' }
              ]}
            />
            <TerminalDemo
              label="channel pull"
              command="rapidlynk pull -c my-team"
              lines={[
                { text: '📥 Fetching latest from \"my-team\"...', tone: 'muted' },
                { text: '📂 Restored successfully', tone: 'success' }
              ]}
            />
          </div>

          <div className="card-surface p-8">
            <h2 className="text-2xl font-semibold text-white">📡 Channels (Fast, Reusable Sharing)</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Channels are designed for team workflows and repeated sharing. Data is uploaded to a named channel, the
              channel acts like a shared stream, and users can pull the latest data at any time.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Channels do not use AES-GCM encryption currently. That tradeoff is deliberate: channels prioritize speed,
              reusability, and collaboration over one-time secure transfer semantics.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.04] text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Feature</th>
                    <th className="px-4 py-3 font-medium">One-time secret</th>
                    <th className="px-4 py-3 font-medium">Channel</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeoffs.map((row) => (
                    <tr key={row.feature} className="border-t border-white/10 text-slate-300">
                      <td className="px-4 py-3 text-white">{row.feature}</td>
                      <td className="px-4 py-3">{row.secret}</td>
                      <td className="px-4 py-3">{row.channel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <div className="card-surface p-8">
            <h2 className="text-2xl font-semibold text-white">🧠 When to use what</h2>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white">🔐 Use `rapidlynk push`</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  <li>Sharing sensitive data</li>
                  <li>Sending credentials or private files</li>
                  <li>One-time transfers</li>
                  <li>Security is critical</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">📡 Use `rapidlynk push -c &lt;channel&gt;`</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  <li>Working with a team</li>
                  <li>Sharing builds or assets repeatedly</li>
                  <li>CI/CD workflows</li>
                  <li>Speed matters more than secrecy</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card-surface p-8">
            <h2 className="text-2xl font-semibold text-white">🚀 Why channels don’t have encryption yet</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Encryption in channels introduces key management complexity, multi-user access problems, and performance
              overhead. Questions like who owns the key, how multiple users decrypt, and how rotation works are still
              product-level design problems.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The current focus is fast, simple, frictionless sharing. Future channel evolution can support shared
              encryption keys, access control, and per-user decryption.
            </p>
            <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-950/40 p-5">
              <h3 className="text-lg font-semibold text-white">🧠 Design Philosophy</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Choose between security and speed, explicitly. RapidLynk does not force one model onto every workflow.
                It gives both.
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-lg font-semibold text-white">⚡ Summary</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                `rapidlynk push` is secure, encrypted, one-time sharing. `rapidlynk push -c` is fast, reusable,
                team-based sharing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
