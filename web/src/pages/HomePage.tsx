import { ButtonLink } from '../components/ButtonLink';
import { FeatureCard } from '../components/FeatureCard';
import { TerminalDemo } from '../components/TerminalDemo';

const quickLinks = [
  { label: 'Windows x64 installer', value: 'Ready from the current download page' },
  { label: 'Primary commands', value: 'rapidlynk push · rapidlynk pull' },
  { label: 'Core concept', value: 'One-time secrets and reusable channels' }
];

const featureCards = [
  {
    title: 'Push and pull directly',
    description: 'Move project payloads without leaving the terminal. The CLI stays small, explicit, and easy to script.'
  },
  {
    title: 'Transfer with channels',
    description: 'Publish to a reusable channel when the same team or environment needs the latest shared payload.'
  },
  {
    title: 'Built for practical speed',
    description: 'RapidLynk is implemented in Go for low-overhead execution and straightforward packaging.'
  }
];

export function HomePage() {
  return (
    <div className="space-y-20 pb-20 sm:space-y-24">
      <section className="relative overflow-hidden pb-6 pt-16 sm:pt-20">
        <div className="container-shell grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-8">
            <span className="pill-label">Developer-first transfer tooling</span>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-purple-500/25 bg-purple-950/50 shadow-glow sm:h-24 sm:w-24">
                  <img src="/images/logo.png" alt="RapidLynk logo" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.32em] text-purple-200">RapidLynk</p>
                  <p className="mt-1 text-sm text-slate-400">Instant file transfer for developers</p>
                </div>
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                RapidLynk keeps cross-system sharing inside the CLI.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Instantly share files and data across systems using a simple CLI. Fast enough for routine developer
                workflows, small enough to stay out of the way.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <ButtonLink to="/download">Download for Windows</ButtonLink>
              <ButtonLink to="/about" variant="secondary">
                How it works
              </ButtonLink>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {quickLinks.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-medium text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <TerminalDemo
              label="rapidlynk push"
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
              label="rapidlynk pull"
              command="rapidlynk pull"
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

      <section>
        <div className="container-shell grid gap-6 md:grid-cols-3">
          {featureCards.map((card) => (
            <FeatureCard key={card.title} title={card.title} description={card.description} />
          ))}
        </div>
      </section>

      <section>
        <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <span className="pill-label">Channels</span>
            <h2 className="section-title">Introducing Channels</h2>
            <p className="section-copy">Share data to a reusable channel instead of one-time secrets.</p>
            <div className="card-surface p-6">
              <h3 className="text-xl font-semibold text-white">A better fit for repeat collaboration</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Channels let a team publish and retrieve the latest payload from a shared name. That removes the overhead
                of passing unique secrets every time the same group needs access.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <ButtonLink to="/learn">See use cases</ButtonLink>
                <ButtonLink to="/about" variant="secondary">
                  Understand the model
                </ButtonLink>
              </div>
            </div>
          </div>
          <div className="grid gap-5">
            <TerminalDemo
              label="channel push"
              command="rapidlynk push -c my-team"
              lines={[
                { text: '📦 Bundling project...', tone: 'muted' },
                { text: '☁️ Uploading to channel "my-team"...', tone: 'muted' },
                { text: '✅ Available to all channel members', tone: 'success' }
              ]}
            />
            <TerminalDemo
              label="channel pull"
              command="rapidlynk pull -c my-team"
              lines={[
                { text: '📥 Fetching latest from "my-team"...', tone: 'muted' },
                { text: '📂 Restored successfully', tone: 'success' }
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
