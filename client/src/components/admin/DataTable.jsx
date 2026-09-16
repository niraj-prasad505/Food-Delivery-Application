// src/components/admin/DataTable.jsx
import EmptyState from "./EmptyState";

/**
 * Generic table used by every admin page's list view.
 */
export default function DataTable({
  columns,
  rows,
  emptyTitle = "Nothing here yet",
  emptyText,
}) {
  if (!rows || rows.length === 0) {
    return <EmptyState title={emptyTitle} text={emptyText} />;
  }

  const primaryCol =
    columns.find((c) => c.primary) || columns[0];

  const restCols = columns.filter(
    (c) => c.key !== primaryCol.key
  );

  const cell = (col, row) =>
    col.render ? col.render(row) : row[col.key];

  return (
    <div>
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-[12px] uppercase tracking-wide text-gray-400 font-semibold px-3.5 py-2.5 border-b border-gray-100 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden flex flex-col gap-3">
        {rows.map((row, rowIndex) => (
          <div
            key={row._id || row.id || rowIndex}
            className="border border-gray-100 rounded-xl p-3.5"
          >
            <div className="mb-2 font-semibold text-gray-900">
              {cell(primaryCol, row)}
            </div>

            <div className="flex flex-col gap-2">
              {restCols
                .filter((col) => col.key !== "actions")
                .map((col) => (
                  <div
                    key={col.key}
                    className="flex items-center justify-between gap-3 text-[13px]"
                  >
                    <span className="text-gray-400 font-medium">
                      {col.label}
                    </span>

                    <span className="text-gray-700 text-right">
                      {cell(col, row)}
                    </span>
                  </div>
                ))}
            </div>

            {restCols.some(
              (c) => c.key === "actions"
            ) && (
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-dashed border-gray-100">
                {cell(
                  restCols.find(
                    (c) => c.key === "actions"
                  ),
                  row
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}