import React from 'react';

function Stat({ title, value, tone, onClick }) {
  const tones = { sky: 'from-sky-500', emerald: 'from-emerald-500', amber: 'from-amber-500' };
  const colorClass = tones[tone] || tones.sky;

  return (
    <div className="card cursor-pointer" onClick={onClick}>
      <div className="card-body">
        <div className="label flex items-center justify-between">
          <span>{title}</span>
          {onClick && (
            <button
              type="button"
              className="text-sm text-sky-600 hover:underline"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
              View all
            </button>
          )}
        </div>
        <div
          className={`mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colorClass} to-sky-300`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export default Stat;
