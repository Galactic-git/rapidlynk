import { FeatureCard } from '../components/FeatureCard';
import { PageHero } from '../components/PageHero';
import { TerminalDemo } from '../components/TerminalDemo';
import { docsCards } from '../content/siteContent';

export function DocsPage() {
  return (
    <>
      <PageHero
        eyebrow="Docs"
        title="Focused documentation for the core workflow"
        description="The product surface stays intentionally small: installation, push, pull, and the channel-oriented transfer model."
      />
      <section className="pb-20">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            {docsCards.map((card) => (
              <FeatureCard key={card.title} title={card.title} description={card.description} />
            ))}
          </div>
          <div className="space-y-6">
            <div className="card-surface p-8">
              <h3 className="text-xl font-semibold text-white">Basic commands</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use `rapidlynk push` to send content and `rapidlynk pull` to restore it. For repeat collaboration, use
                channel flags to publish and retrieve from a reusable channel.
              </p>
            </div>
            <TerminalDemo
              label="docs example"
              command="rapidlynk push -c my-team"
              lines={[
                { text: '📦 Bundling project...', tone: 'muted' },
                { text: '☁️ Uploading to channel "my-team"...', tone: 'muted' },
                { text: '✅ Available to all channel members', tone: 'success' }
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
