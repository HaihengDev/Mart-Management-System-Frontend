export function SimpleTable({ columns, rows }) {
  return (
    <div className="app-glass overflow-auto rounded-xl">
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-soft border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((value, idx) => (
                <td key={idx} className="text-main border-b px-4 py-3 text-sm">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
