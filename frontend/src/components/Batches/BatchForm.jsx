import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/notify';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function normTime(t) {
  const s = String(t ?? '').trim();
  if (!s) return '';
  if (/^\d{1,2}$/.test(s)) return s.padStart(2,'0') + ':00';
  if (/^\d{1,2}:\d{1,2}$/.test(s)) {
    const [h, m] = s.split(':');
    return h.padStart(2,'0') + ':' + m.padStart(2,'0');
  }
  if (/^\d{2}:\d{2}$/.test(s)) return s;
  return s;
}

export default function BatchForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get('/batches')
      .then(({ data }) => {
        const b = (data || []).find(x => x._id === id);
        if (!b) return toastError('Batch not found');
        setName(b.name || '');
        setDays(b.classTimings?.days || []);
        setStartTime(b.classTimings?.startTime || '');
        setEndTime(b.classTimings?.endTime || '');
      })
      .catch(() => toastError('Failed to load batch'));
  }, [id, isEdit]);

  const toggleDay = (d) => {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const save = async () => {
    if (!name.trim()) return toastError('Name is required');

    const payload = {
      name: name.trim(),
      classTimings: {
        days,
        startTime: normTime(startTime),
        endTime: normTime(endTime)
      }
    };

    try {
      if (isEdit) {
        await api.put(`/batches/${id}`, payload);
        toastSuccess('Batch updated');
      } else {
        await api.post('/batches', payload);
        toastSuccess('Batch created');
      }
      navigate('/batches');
    } catch (e) {
      toastError(e?.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">{isEdit ? 'Edit' : 'Add'} Batch</h1>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="text-sm text-gray-600">Batch Name</label>
          <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-2">Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(d => (
              <button
                type="button"
                key={d}
                onClick={() => toggleDay(d)}
                className={`px-3 py-1 rounded border ${days.includes(d) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Start Time (24h e.g., 17:00)</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="HH:MM"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">End Time (24h e.g., 18:00)</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="HH:MM"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        <button onClick={() => navigate('/batches')} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
      </div>
    </div>
  );
}
