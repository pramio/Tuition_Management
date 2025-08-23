// src/components/Fees/Fees.jsx
import { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/notify';
import dayjs from 'dayjs';
import fileDownload from 'js-file-download';
import ReceiptPreview from './ReceiptPreview';

export default function Fees() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState('');
  const [baseAmount, setBaseAmount] = useState(1000);
  const [discount, setDiscount] = useState(0);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/students')
      .then(({ data }) => setStudents(data || []))
      .catch(() => toastError('Failed to load students'));
  }, []);

  const student = useMemo(
    () => students.find(s => s._id === selected) || null,
    [students, selected]
  );

  const createCycle = async () => {
    if (!selected) return toastError('Select a student');
    setLoading(true);
    try {
      const { data } = await api.post('/fees/create-cycle', { studentId: selected, baseAmount });
      setInvoice(data);
      toastSuccess('Cycle prepared');
    } catch {
      toastError('Failed to create cycle');
    } finally {
      setLoading(false);
    }
  };

  const pay = async () => {
    if (!invoice?._id) return toastError('Create cycle first');
    setLoading(true);
    try {
      const { data } = await api.post('/fees/pay', { feeId: invoice._id, discount, notify: true });
      toastSuccess(`Payment success • ${data.receiptNumber}`);
      // Download receipt pdf
      const bin = atob(data.pdf);
      const arr = Uint8Array.from(bin, c => c.charCodeAt(0));
      fileDownload(new Blob([arr], { type: 'application/pdf' }), `${data.receiptNumber}.pdf`);
    } catch {
      toastError('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const total = useMemo(() => {
    if (!invoice) return Math.max(0, baseAmount - (discount || 0));
    const sum = (invoice.baseAmount || 0) + (invoice.fines || 0) - (discount || 0);
    return Math.max(0, sum);
  }, [invoice, baseAmount, discount]);

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Fees & Receipts</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">Collect Fees</div>
          <div className="card-body space-y-4">
            <div>
              <label className="label">Student</label>
              <select
                className="input w-full"
                value={selected}
                onChange={e => setSelected(e.target.value)}
              >
                <option value="">Select student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.batch?.name ? `• ${s.batch.name}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Base Amount (₹)</label>
                <input
                  type="number"
                  className="input w-full"
                  value={baseAmount}
                  onChange={e => setBaseAmount(+e.target.value || 0)}
                />
              </div>
              <div>
                <label className="label">Discount (₹)</label>
                <input
                  type="number"
                  className="input w-full"
                  value={discount}
                  onChange={e => setDiscount(+e.target.value || 0)}
                />
              </div>
              <div>
                <label className="label">Total</label>
                <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-semibold">
                  ₹{total}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={createCycle} className="btn btn-primary" disabled={!selected || loading}>
                Prepare Cycle
              </button>
              <button onClick={pay} className="btn btn-success" disabled={!invoice || loading}>
                Pay & Download Receipt
              </button>
              <button
                onClick={() => setInvoice(null)}
                className="btn btn-ghost"
                disabled={loading}
              >
                Reset
              </button>
            </div>

            {invoice && (
              <div className="text-sm text-slate-600">
                Cycle: {dayjs(invoice.cycleStart).format('DD MMM YYYY')} → {dayjs(invoice.cycleEnd).format('DD MMM YYYY')} •
                Base ₹{invoice.baseAmount} • Fines ₹{invoice.fines || 0}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">Receipt Preview</div>
          <div className="card-body">
            <ReceiptPreview
              centerName="SciencePlus Tuition"
              addressLine="Your address, City, State, Country"
              email="yourname@websitename.com"
              website="www.websitename.com"
              phone="+00 000 0000"
              student={student}
              invoice={invoice ? { ...invoice, discount, total } : {
                cycleStart: new Date(),
                cycleEnd: new Date(),
                baseAmount,
                fines: 0,
                discount,
                total
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
