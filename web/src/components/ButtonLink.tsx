import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonLinkProps = {
  children: ReactNode;
  to: string;
  variant?: 'primary' | 'secondary' | 'light';
  size?: 'sm' | 'md';
};

const variants = {
  primary:
    'border border-purple-400/20 bg-purple-900 text-white hover:bg-purple-800 hover:border-purple-400/30',
  secondary:
    'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/15',
  light: 'border border-white/10 bg-white text-slate-950 hover:bg-slate-200'
};

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-6 py-3.5 text-base'
};

export function ButtonLink({ children, to, variant = 'primary', size = 'md' }: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded-full font-semibold transition ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </Link>
  );
}
