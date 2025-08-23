import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/notify';
import fileDownload from 'js-file-download';

export default function MarksForm() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [term, setTerm] = useState('Midterm');
  const [rows, setRows] = useState([{ subject: 'Math', max: 100, scored: 0 }]);

  useEffect(() => {
    api.get('/students')
      .then(({ data }) => {
        const s = (data || []).find(x => x._id === studentId) || null;
        setStudent(s);
      })
      .catch(() => toastError('Failed to load student'));
  }, [studentId]);

  const addRow = () => setRows(r => [...r, { subject: '', max: 100, scored: 0 }]);
  const change = (i, k, v) => setRows(r => { const c = [...r]; c[i] = { ...c[i], [k]: v }; return c; });

  const save = async () => {
    try {
      const { data } = await api.post('/exams', { student: student._id, batch: student.batch?._id, term, marks: rows });
      const res = await api.post(`/exams/report/${data._id}`);
      const bin = atob(res.data.pdf);
      const arr = Uint8Array.from(bin, c => c.charCodeAt(0));
      fileDownload(new Blob([arr], { type: 'application/pdf' }), `Report-${student.name}.pdf`);
      toastSuccess('Report generated');
    } catch {
      toastError('Save failed');
    }
  };

  if (!student) return null;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold text-slate-800">Enter Marks — {student.name}</h1>
      <input className="border p-2 rounded w-64" value={term} onChange={e => setTerm(e.target.value)} />
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="border p-2 rounded" placeholder="Subject" value={r.subject} onChange={e => change(i, 'subject', e.target.value)} />
          <input type="number" className="border p-2 rounded" placeholder="Max" value={r.max} onChange={e => change(i, 'max', +e.target.value || 0)} />
          <input type="number" className="border p-2 rounded" placeholder="Scored" value={r.scored} onChange={e => change(i, 'scored', +e.target.value || 0)} />
        </div>
      ))}
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-gray-100 rounded" onClick={addRow}>Add Subject</button>
        <button className="px-3 py-2 bg-emerald-600 text-white rounded" onClick={save}>Save & Generate Report</button>
      </div>
    </div>
  );
}
