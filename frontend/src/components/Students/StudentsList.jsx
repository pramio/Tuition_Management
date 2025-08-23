import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/notify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';

export default function StudentsList() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const load = () => {
    api.get('/students').then(({ data }) => setList(data || [])).catch(()=>toastError('Failed to load'));
  };
  useEffect(load, []);

  const filtered = useMemo(()=>{
    const t = q.trim().toLowerCase();
    if (!t) return list;
    return list.filter(s =>
      s.name?.toLowerCase().includes(t) ||
      s.phone?.toLowerCase().includes(t) ||
      s.parentContact?.toLowerCase().includes(t) ||
      s.batch?.name?.toLowerCase().includes(t)
    );
  },[q,list]);

  const del = async (id) => {
    if (!confirm('Delete this student?')) return;
    try { await api.delete(`/students/${id}`); setList(prev=>prev.filter(x=>x._id!==id)); toastSuccess('Deleted'); }
    catch { toastError('Delete failed'); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Students</h1>
        <button className="px-3 py-2 bg-blue-600 text-white rounded inline-flex items-center gap-2" onClick={()=>navigate('/students/new')}>
          <FaPlus /> Add Student
        </button>
      </div>

      <div className="bg-white p-3 rounded shadow mb-4 flex items-center gap-3">
        <FaSearch className="text-gray-500" />
        <input className="flex-1 outline-none" placeholder="Search by name, phone, batch..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-sky-50 text-left text-sm text-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Parent</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Admission</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s=>(
              <tr key={s._id} className="border-t border-slate-100">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.phone||'-'}</td>
                <td className="p-3">{s.parentContact||'-'}</td>
                <td className="p-3">{s.batch?.name||'-'}</td>
                <td className="p-3">{s.admissionDate?new Date(s.admissionDate).toLocaleDateString():'-'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/students/${s._id}`} className="px-2 py-1 bg-green-100 text-green-700 rounded inline-flex items-center gap-1"><FaEye/>View</Link>
                    <button onClick={()=>navigate(`/students/${s._id}/edit`)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded inline-flex items-center gap-1"><FaEdit/>Edit</button>
                    <button onClick={()=>del(s._id)} className="px-2 py-1 bg-red-100 text-red-700 rounded inline-flex items-center gap-1"><FaTrash/>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td className="p-4 text-center text-slate-500" colSpan={6}>No students found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
