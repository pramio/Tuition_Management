// src/components/Batches/Timetable.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import { toastError } from '../../utils/notify';

export default function Timetable() {
  const { id } = useParams(); // batchId
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (!id) return;
    api.get(`/subjects/${id}`)
      .then(({ data }) => setSubjects(data || []))
      .catch(() => toastError('Failed to load subjects'));
  }, [id]);

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const grouped = useMemo(() => {
    const m = {}; days.forEach(d => m[d] = []);
    subjects.forEach(s => { const d = s.schedule?.day; if (m[d]) m[d].push(s); });
    Object.values(m).forEach(arr => arr.sort((a,b) => (a.schedule?.time || '').localeCompare(b.schedule?.time || '')));
    return m;
  }, [subjects]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-primary mb-4">Timetable</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {days.map(day => (
          <div key={day} className="border rounded">
            <div className="px-3 py-2 bg-blue-50 font-medium">{day}</div>
            <div className="p-3 space-y-2">
              {grouped[day].length === 0 && <div className="text-sm text-gray-500">No classes</div>}
              {grouped[day].map(s => (
                <div key={s._id} className="border rounded px-3 py-2">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-600">{s.teacher || '-'}</div>
                  <div className="text-sm text-gray-600">{s.schedule?.time || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
