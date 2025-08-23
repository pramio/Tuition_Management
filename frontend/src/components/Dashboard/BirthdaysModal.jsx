import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaUser, FaSms } from "react-icons/fa";
import dayjs from 'dayjs';

function parseDate(dateStr) {
  const formats = ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'];
  for (const f of formats) {
    const d = dayjs(dateStr, f, true);
    if (d.isValid()) return d;
  }
  return null;
}

function formatBirthday(dateStr) {
  const d = parseDate(dateStr);
  return d ? d.format('MMM D, YYYY') : '-';
}

function calcAge(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return '';
  const today = dayjs();
  let age = today.year() - d.year();
  if (today.month() < d.month() || (today.month() === d.month() && today.date() < d.date())) age--;
  return age;
}

function BirthdaysModal({ open, onClose, birthdays }) {
  const navigate = useNavigate();
  const list = Array.isArray(birthdays) ? birthdays : [];

  useEffect(() => {
    if (open) console.log('Birthdays data:', list);
  }, [open, list]);

  const goProfile = (id) => { onClose(); navigate(`/students/${id}`); };

  const goWhatsApp = ({ name, phone }) => {
    if (!phone) return alert('No phone for WhatsApp');
    const msg = encodeURIComponent(`🎂 Happy Birthday, ${name}! From SciencePlus Tuition.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const sendSMS = ({ name, phone }) => {
    if (!phone) return alert('No phone for SMS');
    // TODO: call your backend /send-sms endpoint
    alert(`(Demo) SMS queued to ${phone}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-indigo-50">
          <h3 className="text-xl font-bold text-indigo-800">🎉 Birthdays Today</h3>
          <button className="text-2xl text-indigo-500 hover:text-indigo-700" onClick={onClose}>×</button>
        </div>

        <div className="p-6">
          {list.length === 0 ? (
            <div className="py-12 text-center text-indigo-400">No birthdays today 😊</div>
          ) : (
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Birthday</th>
                    <th className="px-6 py-3">Age</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((s) => (
                    <tr key={s._id || s.id} className="hover:bg-indigo-50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                          {s.name?.[0] || 'U'}
                        </span>
                        {s.name}
                      </td>
                      <td className="px-6 py-4">{formatBirthday(s.birthday)}</td>
                      <td className="px-6 py-4">{calcAge(s.birthday) || <span className="text-red-500">--</span>}</td>
                      <td className="px-6 py-4 flex gap-4">
                        <button className="text-sky-600 hover:text-sky-800 flex items-center gap-1"
                                onClick={() => goProfile(s._id || s.id)}>
                          <FaUser /> Profile
                        </button>
                        <button className="text-green-600 hover:text-green-800 flex items-center gap-1"
                                onClick={() => goWhatsApp(s)}>
                          <FaWhatsapp /> WhatsApp
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                onClick={() => sendSMS(s)}>
                          <FaSms /> SMS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-4 bg-indigo-50">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default BirthdaysModal;
