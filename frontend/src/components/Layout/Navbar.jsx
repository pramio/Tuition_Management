export default function Navbar() {
return (
<div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-100">
<div className="flex items-center gap-3">
<img src="/logo.png" alt="logo" className="w-8 h-8" />
<div className="text-lg font-semibold text-slate-800">SciencePlus Tuition</div>
</div>
<div className="text-sm text-slate-500">Admin</div>
</div>
);
}

