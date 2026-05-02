import { ReactNode } from 'react';

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-shell">
        <div className="mb-10 space-y-4">
          <span className="pill-label">{eyebrow}</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
