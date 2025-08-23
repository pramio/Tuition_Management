import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

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

export default StudentsModal;
