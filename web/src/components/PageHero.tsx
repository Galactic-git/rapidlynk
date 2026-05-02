type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="pb-10 pt-16 sm:pb-14 sm:pt-20">
      <div className="container-shell">
        <div className="space-y-5">
          <span className="pill-label">{eyebrow}</span>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300">{description}</p>
        </div>
      </div>
    </section>
  );
}
