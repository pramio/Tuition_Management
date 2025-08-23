import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

function PendingFeesModal({ open, onClose }) {
  const navigate = useNavigate();
  const [pendingFees, setPendingFees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api.get('/fees/pending') // Assuming an endpoint for pending fees
      .then(({ data }) => setPendingFees(Array.isArray(data) ? data : (data?.items || [])))
      .finally(() => setLoading(false));
  }, [open]);

  const goFees = (id) => {
    onClose();
    navigate(`/fees/${id}`); // Adjust path as needed
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-semibold">Pending Fees</h3>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading…</div>
          ) : pendingFees.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No pending fees</div>
          ) : (
            <div className="max-h-[60vh] overflow-auto border rounded">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2">Student</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Due Date</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingFees.map((f) => (
                    <tr key={f._id || f.id} className="border-t hover:bg-slate-50">
                      <td className="px-3 py-2">{f.student?.name || '-'}</td>
                      <td className="px-3 py-2">{f.amount || '-'}</td>
                      <td className="px-3 py-2">{f.dueDate || '-'}</td>
                      <td className="px-3 py-2">
                        <button
                          className="text-sky-600 hover:underline"
                          onClick={() => goFees(f._id || f.id)}
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default PendingFeesModal;
