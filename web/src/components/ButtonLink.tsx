import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonLinkProps = {
  children: ReactNode;
  to: string;
  variant?: 'primary' | 'secondary' | 'stark' | 'pink' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const variants = {
  primary:
    'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium shadow-glowPink hover:opacity-95 border border-pink-400/30',
  stark:
    'bg-white text-black font-semibold hover:bg-zinc-200 border border-white',
  secondary:
    'border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/80',
  pink:
    'bg-pink-500 text-black font-semibold hover:bg-pink-400 shadow-glowPink',
  purple:
    'bg-purple-600 text-white font-semibold hover:bg-purple-500 shadow-glowPurple border border-purple-400/30',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export function ButtonLink({
  children,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
