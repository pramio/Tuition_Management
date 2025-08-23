import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/notify';

const empty = { name:'', phone:'', parentContact:'', dob:'', batch:'', admissionDate:'' };

export default function StudentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(empty);

  useEffect(()=>{ api.get('/batches').then(({data})=>setBatches(data||[])); },[]);
  useEffect(()=>{
    if (!isEdit) return;
    api.get('/students').then(({data})=>{
      const s = (data||[]).find(x=>x._id===id);
      if (!s) return toastError('Not found');
      setForm({
        name: s.name||'',
        phone: s.phone||'',
        parentContact: s.parentContact||'',
        dob: s.dob ? s.dob.slice(0,10) : '',
        batch: s.batch?._id || '',
        admissionDate: s.admissionDate ? s.admissionDate.slice(0,10) : ''
      });
    }).catch(()=>toastError('Load failed'));
  },[id,isEdit]);

  const change = (k,v)=>setForm(f=>({...f,[k]:v}));

  const save = async ()=>{
    if (!form.name || !form.admissionDate) return toastError('Name and Admission Date required');
    const payload = { ...form, dob: form.dob||null, batch: form.batch||null };
    try {
      if (isEdit) { await api.put(`/students/${id}`, payload); toastSuccess('Updated'); }
      else { await api.post('/students', payload); toastSuccess('Added'); }
      navigate('/students');
    } catch { toastError('Save failed'); }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">{isEdit?'Edit':'Add'} Student</h1>
      </div>
      <div className="card">
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="label">Name</label><input className="input w-full" value={form.name} onChange={e=>change('name',e.target.value)} /></div>
          <div><label className="label">Phone</label><input className="input w-full" value={form.phone} onChange={e=>change('phone',e.target.value)} /></div>
          <div><label className="label">Parent Contact</label><input className="input w-full" value={form.parentContact} onChange={e=>change('parentContact',e.target.value)} /></div>
          <div><label className="label">Date of Birth</label><input type="date" className="input w-full" value={form.dob} onChange={e=>change('dob',e.target.value)} /></div>
          <div>
            <label className="label">Batch</label>
            <select className="select w-full" value={form.batch} onChange={e=>change('batch',e.target.value)}>
              <option value="">Unassigned</option>
              {batches.map(b=><option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div><label className="label">Admission Date</label><input type="date" className="input w-full" value={form.admissionDate} onChange={e=>change('admissionDate',e.target.value)} /></div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="btn btn-success" onClick={save}>Save</button>
        <button className="btn btn-ghost" onClick={()=>navigate('/students')}>Cancel</button>
      </div>
    </>
  );
}
