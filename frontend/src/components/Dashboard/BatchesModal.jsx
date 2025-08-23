import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

function BatchesModal({ open, onClose }) {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api.get('/batches')
      .then(({ data }) => setBatches(Array.isArray(data) ? data : (data?.items || [])))
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = batches.filter(b => {
    const hay = `${b.name || ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const goDetails = (id) => {
    onClose();
    navigate(`/batches/${id}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-semibold">All Batches</h3>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
        </div>

        <div className="p-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by batch name"
            className="w-full border rounded px-3 py-2 mb-3"
          />

          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No batches found</div>
          ) : (
            <div className="max-h-[60vh] overflow-auto border rounded">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Students</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b._id || b.id} className="border-t hover:bg-slate-50">
                      <td className="px-3 py-2">{b.name}</td>
                      <td className="px-3 py-2">{(b.students || []).length}</td>
                      <td className="px-3 py-2">
                        <button
                          className="text-sky-600 hover:underline"
                          onClick={() => goDetails(b._id || b.id)}
                        >
                          Open details
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

export default BatchesModal;
