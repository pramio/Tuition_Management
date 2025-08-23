import React from "react";

export default function Badge({ color = "blue", children }) {
  const colors = {
    red:    "bg-red-500",
    green:  "bg-green-500",
    blue:   "bg-blue-500",
    amber:  "bg-amber-500",
    indigo: "bg-indigo-500"
  };
  const c = colors[color] || colors.blue;

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-white ${c}`}>
      {children}
    </span>
  );
}
