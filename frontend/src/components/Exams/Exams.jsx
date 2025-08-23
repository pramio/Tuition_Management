import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaFileSignature } from 'react-icons/fa';

export default function Exams() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{ api.get('/students').then(({data})=>setStudents(data||[])); },[]);

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Exams</h1>
      <div className="card">
        <div className="card-body overflow-x-auto">
          <table className="min-w-full">
            <thead><tr className="table-th"><th className="p-3 text-left">Student</th><th className="p-3 text-left">Batch</th><th className="p-3 text-left">Action</th></tr></thead>
            <tbody>
              {students.map(s=>(
                <tr key={s._id} className="border-t border-slate-100">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.batch?.name||'-'}</td>
                  <td className="p-3">
                    <button className="btn btn-primary" onClick={()=>navigate(`/exams/marks/${s._id}`)}>
                      <FaFileSignature/> Enter Marks
                    </button>
                  </td>
                </tr>
              ))}
              {students.length===0 && <tr><td colSpan={3} className="p-4 text-center text-slate-500">No students</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
