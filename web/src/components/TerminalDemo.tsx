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
  default: 'text-slate-200',
  muted: 'text-slate-500',
  success: 'text-emerald-300',
  accent: 'text-purple-200'
};

export function TerminalDemo({ label, command, lines }: TerminalDemoProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-purple-500/20 bg-[#070910] shadow-glow">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-sm font-medium text-slate-300">{label}</span>
      </div>
      <div className="space-y-3 px-5 py-6 font-mono text-sm leading-7 sm:text-base">
        <div className="flex gap-3 text-purple-200">
          <span className="select-none text-slate-500">$</span>
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
