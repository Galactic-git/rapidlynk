type TerminalLine = {
  text: string;
  tone?: 'default' | 'muted' | 'success' | 'accent';
};

type TerminalDemoProps = {
  label: string;
  command: string;
  lines: TerminalLine[];
};

const toneClasses: Record<NonNullable<TerminalLine['tone']>, string> = {
  default: 'text-zinc-200',
  muted: 'text-zinc-500',
  success: 'text-emerald-400',
  accent: 'text-pink-400',
};

export function TerminalDemo({ label, command, lines }: TerminalDemoProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#07070a] shadow-card">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-pink-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="font-mono text-xs text-zinc-400">{label}</span>
      </div>
      <div className="space-y-2.5 p-4 font-mono text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-pink-300">
          <span className="select-none text-zinc-600">$</span>
          <span>{command}</span>
        </div>
        <div className="space-y-1">
          {lines.map((line) => (
            <div key={`${label}-${line.text}`} className={toneClasses[line.tone ?? 'default']}>
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
