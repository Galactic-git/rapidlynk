type ComparisonTableProps = {
  columns: string[];
  rows: { feature: string; values: string[] }[];
};

export function ComparisonTable({ columns, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/[0.04] text-slate-300">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-t border-white/10 text-slate-300">
              <td className="px-4 py-3 text-white">{row.feature}</td>
              {row.values.map((val, i) => (
                <td key={i} className="px-4 py-3">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
