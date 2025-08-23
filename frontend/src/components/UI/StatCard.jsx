import React from "react";

export default function StatCard({ title, value = 0, tone = "sky", onClick }) {
  const tones = {
    sky:     "from-sky-500",
    emerald: "from-emerald-500",
    amber:   "from-amber-500",
    indigo:  "from-indigo-500"
  };
  return (
    <div onClick={onClick} className="card cursor-pointer hover:scale-[1.03] transition">
      <div className="card-body">
        <span className="text-sm text-slate-500">{title}</span>
        <div className={`mt-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${tones[tone]} to-sky-300`}>
          {value}
        </div>
      </div>
    </div>
  );
}
