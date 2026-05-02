import { PageHero } from '../components/PageHero';

export function DownloadPage() {
  return (
    <>
      <PageHero
        eyebrow="Download"
        title="Get RapidLynk for Windows"
        description="The current installer targets Windows x64. The setup is intentionally simple so the CLI is available with minimal friction."
      />
      <section className="pb-20">
        <div className="container-shell grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="card-surface p-8">
            <h2 className="text-2xl font-semibold text-white">RapidLynk for Windows (x64)</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Download the installer, run setup, then open a terminal and start using `rapidlynk push` and `rapidlynk pull`.
            </p>
            <div className="mt-8">
              <a
                href="/downloads/RapidLynk-Setup-latest-x64.exe"
                className="inline-flex items-center justify-center rounded-full border border-purple-400/20 bg-purple-900 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-purple-800"
              >
                Download RapidLynk for Windows (x64)
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-400">Linux and macOS packages are planned.</p>
          </div>
          <div className="card-surface p-8">
            <h3 className="text-xl font-semibold text-white">Install checklist</h3>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li>Download the latest Windows x64 installer.</li>
              <li>Run setup with standard permissions.</li>
              <li>Open PowerShell or your preferred terminal.</li>
              <li>Confirm the CLI is available and start transferring.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
