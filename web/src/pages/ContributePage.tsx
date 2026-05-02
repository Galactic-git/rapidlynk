import { ButtonLink } from '../components/ButtonLink';
import { PageHero } from '../components/PageHero';

export function ContributePage() {
  return (
    <>
      <PageHero
        eyebrow="Contribute"
        title="Improve RapidLynk in the open"
        description="Contributions should stay practical: better docs, sharper command examples, focused fixes, and platform support where it matters."
      />
      <section className="pb-20">
        <div className="container-shell grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="card-surface p-8">
            <h2 className="text-2xl font-semibold text-white">Help improve the CLI</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Review the codebase, propose workflow improvements, and contribute focused pull requests through the
              public repository.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://github.com/Galactic-git/rapidlynk"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white px-6 py-3.5 text-base font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                View GitHub repository
              </a>
              <ButtonLink to="/about" variant="secondary">
                Review architecture
              </ButtonLink>
            </div>
          </div>
          <div className="card-surface p-8">
            <h3 className="text-xl font-semibold text-white">Good places to start</h3>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li>Report bugs and workflow friction.</li>
              <li>Improve docs and command examples.</li>
              <li>Test channel-oriented sharing workflows.</li>
              <li>Submit focused pull requests with practical changes.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
