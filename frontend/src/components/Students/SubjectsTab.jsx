import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function SubjectsTab({ student }) {
  const batchId = student.batch?._id;
  const [rows, setRows] = useState([]);

  useEffect(()=>{ if (!batchId) return setRows([]); api.get(`/subjects/${batchId}`).then(({data})=>setRows(data||[])); },[batchId]);

  if (!batchId) return <div className="text-sm text-slate-600">Student is not assigned to a batch.</div>;

  return (
    <div className="card">
      <div className="card-body overflow-x-auto">
        <table className="min-w-full">
          <thead><tr className="table-th"><th className="p-3 text-left">Subject</th><th className="p-3 text-left">Teacher</th><th className="p-3 text-left">Schedule</th></tr></thead>
          <tbody>
            {rows.map(s=>(
              <tr key={s._id} className="border-t border-slate-100">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.teacher||'-'}</td>
                <td className="p-3">{s.schedule?`${s.schedule.day} ${s.schedule.time}`:'-'}</td>
              </tr>
            ))}
            {rows.length===0 && <tr><td colSpan={3} className="p-4 text-center text-slate-500">No subjects added</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
