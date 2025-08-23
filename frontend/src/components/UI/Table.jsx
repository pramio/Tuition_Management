import React from "react";

export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="w-full text-left">
        <thead className="bg-slate-100">
          <tr>{columns.map(col => (
            <th key={col.key} className="px-4 py-2 text-sm font-medium text-slate-600">{col.header}</th>
          ))}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-6 text-center text-slate-400">No data</td></tr>
          ) : data.map((row, idx) => (
            <tr key={row.id || idx} className="border-t even:bg-slate-50 hover:bg-slate-100">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-2 text-sm">{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
