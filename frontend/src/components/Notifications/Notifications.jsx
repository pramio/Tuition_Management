import { useState } from 'react';
import api from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/notify';

export default function Notifications() {
  const [to, setTo] = useState('');
  const [body, setBody] = useState('');

  const sendSMS = async ()=>{ try { await api.post('/notifications/sms', { to, body }); toastSuccess('SMS sent'); } catch { toastError('SMS failed'); } };
  const sendWA  = async ()=>{ try { await api.post('/notifications/whatsapp', { to, body }); toastSuccess('WhatsApp sent'); } catch { toastError('WhatsApp failed'); } };

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Notifications</h1>
      <div className="card">
        <div className="card-body space-y-3">
          <input className="input w-full" placeholder="Parent phone (e.g., +91...)" value={to} onChange={e=>setTo(e.target.value)} />
          <textarea className="input w-full min-h-28" placeholder="Message..." value={body} onChange={e=>setBody(e.target.value)} />
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={sendSMS}>Send SMS</button>
            <button className="btn btn-success" onClick={sendWA}>Send WhatsApp</button>
          </div>
        </div>
      </div>
    </>
  );
}
