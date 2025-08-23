import React, { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-lg shadow-xl mx-2 overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-2xl text-slate-500 hover:text-slate-700">×</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
