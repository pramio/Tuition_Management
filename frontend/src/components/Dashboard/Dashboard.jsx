import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

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

function StudentsModal({ open, onClose }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api.get('/students')
      .then(({ data }) => setStudents(Array.isArray(data) ? data : (data?.items || [])))
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = students.filter(s => {
    const hay = `${s.name || ''} ${s.email || ''} ${s.phone || ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const goProfile = (id) => {
    onClose();
    navigate(`/students/${id}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-semibold">All Students</h3>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
        </div>

        <div className="p-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, phone"
            className="w-full border rounded px-3 py-2 mb-3"
          />

          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No students found</div>
          ) : (
            <div className="max-h-[60vh] overflow-auto border rounded">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2">Batch</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s._id || s.id} className="border-t hover:bg-slate-50">
                      <td className="px-3 py-2">{s.name}</td>
                      <td className="px-3 py-2">{s.email || '-'}</td>
                      <td className="px-3 py-2">{s.phone || '-'}</td>
                      <td className="px-3 py-2">{s.batch?.name || s.batchName || '-'}</td>
                      <td className="px-3 py-2">
                        <button
                          className="text-sky-600 hover:underline"
                          onClick={() => goProfile(s._id || s.id)}
                        >
                          Open profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeBatches: 0,
    pendingFees: 0,
    upcomingBirthdays: [],
  });
  const [openStudents, setOpenStudents] = useState(false);

  useEffect(() => {
    api
      .get('/dashboard')
      .then(({ data }) => setStats(data || {}))
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <img src="/logo.png" className="w-10 h-10" />
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat
          title="Total Students"
          value={stats.totalStudents || 0}
          tone="sky"
          onClick={() => setOpenStudents(true)}
        />
        <Stat title="Active Batches" value={stats.activeBatches || 0} tone="emerald" />
        <Stat title="Pending Fees" value={stats.pendingFees || 0} tone="amber" />
        <Stat title="Birthdays Today" value={(stats.upcomingBirthdays || []).length} tone="sky" />
      </div>

      <StudentsModal open={openStudents} onClose={() => setOpenStudents(false)} />
    </>
  );
}
