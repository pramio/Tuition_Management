import { useState } from 'react';
import api from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/notify';
import fileDownload from 'js-file-download';

export default function FeesTab({ student }) {
  const [baseAmount, setBaseAmount] = useState(1000);
  const [invoice, setInvoice] = useState(null);
  const [discount, setDiscount] = useState(0);

  const createCycle = async () => {
    try {
      const { data } = await api.post('/fees/create-cycle', { studentId: student._id, baseAmount });
      setInvoice(data);
      toastSuccess('Cycle prepared');
    } catch {
      toastError('Failed to create cycle');
    }
  };

  const pay = async () => {
    if (!invoice?._id) return toastError('Create cycle first');
    try {
      const { data } = await api.post('/fees/pay', { feeId: invoice._id, discount, notify: true });
      const bin = atob(data.pdf);
      const arr = Uint8Array.from(bin, c => c.charCodeAt(0));
      fileDownload(new Blob([arr], { type: 'application/pdf' }), `${data.receiptNumber}.pdf`);
      toastSuccess(`Paid • ${data.receiptNumber}`);
    } catch {
      toastError('Payment failed');
    }
  };

  const total = Math.max(0, ((invoice?.baseAmount ?? baseAmount) + (invoice?.fines ?? 0) - (discount || 0)));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="number"
          className="border p-2 rounded w-40"
          value={baseAmount}
          onChange={e => setBaseAmount(+e.target.value || 0)}
        />
        <button onClick={createCycle} className="px-3 py-2 bg-blue-600 text-white rounded">Create Cycle</button>
      </div>

      {invoice && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <div>Cycle: {new Date(invoice.cycleStart).toLocaleDateString()} → {new Date(invoice.cycleEnd).toLocaleDateString()}</div>
          <div>Base: ₹{invoice.baseAmount} | Fines: ₹{invoice.fines || 0}</div>
          <div className="flex items-center gap-2">
            <span>Discount</span>
            <input
              type="number"
              className="border p-2 rounded w-24"
              value={discount}
              onChange={e => setDiscount(+e.target.value || 0)}
            />
          </div>
          <div className="font-semibold">Total: ₹{total}</div>
          <button onClick={pay} className="px-3 py-2 bg-green-600 text-white rounded">Pay & Download</button>
        </div>
      )}
    </div>
  );
}
