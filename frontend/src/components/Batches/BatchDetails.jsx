// src/components/Batches/BatchDetails.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toastSuccess, toastError } from '../../utils/notify';

export default function BatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const load = async () => {
    try {
      const { data: batches } = await api.get('/batches');
      const b = (batches || []).find(x => x._id === id);
      if (!b) { toastError('Batch not found'); return navigate('/batches'); }
      setBatch(b);
      setStudents(b.students || []);
      const { data: subs } = await api.get(`/subjects/${id}`);
      setSubjects(subs || []);
    } catch {
      toastError('Failed to load batch');
    }
  };

  useEffect(() => { load(); }, [id]);

  const onSubjectSave = async (sub) => {
    try {
      if (sub._id) {
        const { data } = await api.put(`/subjects/${sub._id}`, sub);
        setSubjects(s => s.map(x => x._id === data._id ? data : x));
        toastSuccess('Subject updated');
      } else {
        const { data } = await api.post('/subjects', { ...sub, batch: id });
        setSubjects(s => [data, ...s]);
        toastSuccess('Subject added');
      }
    } catch {
      toastError('Save failed');
    }
  };

  const delSubject = async (sid) => {
    if (!confirm('Delete this subject?')) return;
    try {
      await api.delete(`/subjects/${sid}`);
      setSubjects(s => s.filter(x => x._id !== sid));
      toastSuccess('Subject deleted');
    } catch {
      toastError('Delete failed');
    }
  };

  const timetable = useMemo(() => {
    // Group by day for display
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const map = {};
    days.forEach(d => map[d] = []);
    subjects.forEach(s => {
      const d = s.schedule?.day || '';
      if (map[d]) map[d].push(s);
    });
    // Sort by time if in HH:MM - HH:MM format (simple lexical)
    Object.values(map).forEach(arr => arr.sort((a,b) => (a.schedule?.time || '').localeCompare(b.schedule?.time || '')));
    return { days, map };
  }, [subjects]);

  if (!batch) return null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-primary">{batch.name}</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/batches/${id}/edit`)} className="px-3 py-2 bg-primary text-white rounded">Edit</button>
          <Link to="/batches" className="px-3 py-2 bg-gray-200 rounded">Back</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Days</div>
          <div className="font-medium">{(batch.classTimings?.days || []).join(', ') || '-'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Time</div>
          <div className="font-medium">
            {batch.classTimings?.startTime && batch.classTimings?.endTime
              ? `${batch.classTimings.startTime} - ${batch.classTimings.endTime}`
              : '-'}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Students</div>
          <div className="font-medium">{students.length}</div>
        </div>
      </div>

      <div className="bg-white rounded shadow mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">Subjects</div>
          <SubjectEditor onSave={onSubjectSave} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-50 text-left text-sm text-gray-600">
              <tr>
                <th className="p-3">Subject</th>
                <th className="p-3">Teacher</th>
                <th className="p-3">Day</th>
                <th className="p-3">Time</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.teacher || '-'}</td>
                  <td className="p-3">{s.schedule?.day || '-'}</td>
                  <td className="p-3">{s.schedule?.time || '-'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <SubjectEditor existing={s} onSave={onSubjectSave} />
                      <button onClick={() => delSubject(s._id)} className="px-2 py-1 bg-red-100 text-red-700 rounded inline-flex items-center gap-1">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr><td className="p-4 text-center text-gray-500" colSpan={5}>No subjects added</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <div className="p-4 border-b font-semibold">Timetable</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {timetable.days.map(day => (
            <div key={day} className="border rounded">
              <div className="px-3 py-2 bg-blue-50 font-medium">{day}</div>
              <div className="p-3 space-y-2">
                {timetable.map[day].length === 0 && <div className="text-sm text-gray-500">No classes</div>}
                {timetable.map[day].map(s => (
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

      <div className="mt-6 bg-white rounded shadow">
        <div className="p-4 border-b font-semibold">Students</div>
        <div className="p-4">
          <ul className="list-disc ml-6">
            {students.map(s => (<li key={s._id}>{s.name}</li>))}
            {students.length === 0 && <li className="text-gray-500 list-none">No students assigned</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SubjectEditor({ existing, onSave }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(existing?.name || '');
  const [teacher, setTeacher] = useState(existing?.teacher || '');
  const [day, setDay] = useState(existing?.schedule?.day || '');
  const [time, setTime] = useState(existing?.schedule?.time || '');

  const reset = () => {
    setName(existing?.name || '');
    setTeacher(existing?.teacher || '');
    setDay(existing?.schedule?.day || '');
    setTime(existing?.schedule?.time || '');
  };

  const submit = () => {
    if (!name) return toastError('Subject name is required');
    onSave({ _id: existing?._id, name, teacher, schedule: { day, time } });
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className={`px-2 py-1 rounded inline-flex items-center gap-1 ${existing ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
        <FaPlus /> {existing ? 'Edit' : 'Add Subject'}
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-4 w-full max-w-md">
            <div className="text-lg font-semibold mb-3">{existing ? 'Edit Subject' : 'Add Subject'}</div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Teacher</label>
                <input className="w-full border p-2 rounded" value={teacher} onChange={e => setTeacher(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Day</label>
                  <select className="w-full border p-2 rounded" value={day} onChange={e => setDay(e.target.value)}>
                    <option value="">Select</option>
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Time (e.g., 5:00-6:00 PM)</label>
                  <input className="w-full border p-2 rounded" value={time} onChange={e => setTime(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                <button onClick={() => { reset(); setOpen(false); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
