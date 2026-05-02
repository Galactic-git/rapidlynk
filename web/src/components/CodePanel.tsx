type CodePanelProps = {
  title: string;
  code: string[];
  footer?: string;
};

export function CodePanel({ title, code, footer }: CodePanelProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-purple-500/20 bg-[#070910] shadow-glow">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-sm font-medium text-slate-300">{title}</span>
      </div>
      <div className="px-5 py-6 font-mono text-sm leading-7 text-slate-200 sm:text-base">
        {code.map((line) => (
          <div key={line} className="flex gap-4">
            <span className="select-none text-slate-500">$</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
      {footer ? <div className="border-t border-white/10 px-5 py-3 text-sm text-slate-400">{footer}</div> : null}
    </div>
  );
}
