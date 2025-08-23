import { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import dayjs from 'dayjs';
import { toastError } from '../../utils/notify';

export default function AttendanceTab({ student }) {
  const [rows, setRows] = useState([]);
  const [month, setMonth] = useState(()=>dayjs().format('YYYY-MM'));

  useEffect(()=>{
    const from = dayjs(month+'-01'); const to = from.add(1,'month');
    api.get(`/attendance?student=${student._id}&from=${from.toISOString()}&to=${to.toISOString()}`)
      .then(({data})=>setRows(data||[]))
      .catch(()=>setRows([]));
  },[month, student?._id]);

  const totalFine = useMemo(()=>rows.reduce((s,r)=>s+(r.fine||0),0),[rows]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="label">Month</label>
        <input type="month" className="input" value={month} onChange={e=>setMonth(e.target.value)} />
        <div className="ml-auto text-sm text-slate-600">Monthly fine: <span className="font-semibold text-red-600">₹{totalFine}</span></div>
      </div>
      <div className="card">
        <div className="card-body overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="table-th">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Forgot Book</th>
                <th className="p-3 text-left">Fine</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r._id} className="border-t border-slate-100">
                  <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{r.forgotBook?'Yes':'No'}</td>
                  <td className="p-3">₹{r.fine||0}</td>
                </tr>
              ))}
              {rows.length===0 && <tr><td className="p-4 text-center text-slate-500" colSpan={4}>No attendance for this period</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
