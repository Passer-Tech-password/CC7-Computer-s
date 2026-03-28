"use client";

import { useMemo } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T>({
  rows,
  columns,
  emptyLabel = "No records found."
}: {
  rows: T[];
  columns: Array<DataTableColumn<T>>;
  emptyLabel?: string;
}) {
  const colCount = columns.length;
  const headers = useMemo(() => columns.map((c) => c.header), [columns]);

  return (
    <div className="overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-sm dark:border-light/10 dark:bg-dark">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-dark/5 dark:bg-light/5">
            <tr>
              {headers.map((h, idx) => (
                <th
                  key={`${h}-${idx}`}
                  className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-dark/70 dark:text-light/70"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/10 dark:divide-light/10">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-8 text-center text-sm font-semibold text-dark/60 dark:text-light/60">
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-dark/5 dark:hover:bg-light/5 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={["px-4 py-3 text-sm", col.className ?? ""].join(" ")}>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

