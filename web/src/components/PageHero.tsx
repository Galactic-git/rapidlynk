type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-zinc-800/80 pb-10 pt-12 sm:pb-14 sm:pt-16 bg-gradient-to-b from-zinc-950 to-black">
      <div className="container-shell space-y-4">
        <span className="badge-pink">{eyebrow}</span>
        <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl font-mono text-xs leading-relaxed text-zinc-400 sm:text-sm">
          {description}
        </p>
      </div>
    </section>
  );
}
