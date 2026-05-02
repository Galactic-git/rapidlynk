import { PropsWithChildren } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-abyss">
      <div className="absolute inset-0 bg-hero" />
      <div className="absolute inset-0 bg-grid bg-[length:32px_32px] opacity-30" />
      <div className="relative z-10">
        <Header />
        <main className="min-h-[calc(100vh-10rem)]">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
