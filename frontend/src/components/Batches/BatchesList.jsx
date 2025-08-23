import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { toastSuccess, toastError } from '../../utils/notify';

export default function BatchesList() {
  const [batches, setBatches] = useState([]);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await api.get('/batches');
      setBatches(data || []);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to load batches';
      toastError(msg);
      // eslint-disable-next-line no-console
      console.error('GET /batches failed:', e);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return batches;
    return batches.filter(b =>
      b.name?.toLowerCase().includes(t) ||
      (b.classTimings?.days || []).join(' ').toLowerCase().includes(t)
    );
  }, [q, batches]);

  const del = async (id) => {
    if (!confirm('Delete this batch? All its subjects will be removed.')) return;
    try {
      await api.delete(`/batches/${id}`);
      setBatches(x => x.filter(b => b._id !== id));
      toastSuccess('Batch deleted');
    } catch (e) {
      toastError(e?.response?.data?.message || 'Delete failed');
    }
  };

  const daysStr = (b) => (b.classTimings?.days || []).join(', ') || '-';
  const timeStr = (b) => (b.classTimings?.startTime && b.classTimings?.endTime)
    ? `${b.classTimings.startTime} - ${b.classTimings.endTime}` : '-';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Batches</h1>
        <button onClick={() => navigate('/batches/new')} className="px-3 py-2 bg-blue-600 text-white rounded inline-flex items-center gap-2">
          <FaPlus /> Add Batch
        </button>
      </div>

      <div className="bg-white p-3 rounded shadow mb-4 flex items-center gap-3">
        <FaSearch className="text-gray-500" />
        <input
          className="flex-1 outline-none"
          placeholder="Search by name or days..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(b => (
          <div key={b._id} className="bg-white rounded shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{b.name}</h2>
              <span className="text-sm text-gray-500">{(b.students?.length || 0)} students</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div>Days: {daysStr(b)}</div>
              <div>Time: {timeStr(b)}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => navigate(`/batches/${b._id}`)} className="px-2 py-1 bg-green-100 text-green-700 rounded inline-flex items-center gap-1"><FaEye /> View</button>
              <button onClick={() => navigate(`/batches/${b._id}/edit`)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded inline-flex items-center gap-1"><FaEdit /> Edit</button>
              <button onClick={() => del(b._id)} className="px-2 py-1 bg-red-100 text-red-700 rounded inline-flex items-center gap-1"><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No batches found</div>
        )}
      </div>
    </div>
  );
}
