// src/components/Fees/ReceiptPreview.jsx
import dayjs from 'dayjs';

export default function ReceiptPreview({
  centerName = 'SciencePlus Tuition',
  addressLine = 'Your address, City, State, Country',
  email = 'yourname@websitename.com',
  website = 'www.websitename.com',
  phone = '+00 000 0000',
  student,
  invoice
}) {
  const name = student?.name || 'Student Name';
  const batchName = student?.batch?.name || '';
  const admissionDate = student?.admissionDate ? dayjs(student.admissionDate).format('DD MMM YYYY') : '-';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Top header bar accents */}
      <div className="h-2 bg-gradient-to-r from-sky-500 via-emerald-500 to-sky-500" />

      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-start justify-between">
        {/* Logo + tagline */}
        <div className="flex items-start gap-3">
          <img src="/logo.svg" className="w-10 h-10" />
          <div>
            <div className="text-2xl font-bold tracking-wide text-slate-900">LOGO</div>
            <div className="text-xs text-slate-500">TAGLINE HERE</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-2xl font-semibold text-slate-800 tracking-wider">RECEIPT</div>

        {/* Address/Contact */}
        <div className="text-right text-xs text-slate-600 leading-5">
          <div>{addressLine}</div>
          <div>{email}</div>
          <div>{website}</div>
          <div>{phone}</div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6">
        {/* Row: MR NO / Date */}
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 mb-3">
          <div>
            <span className="text-slate-500">MR. NO.</span>
            <div className="border-b border-dotted border-slate-300 h-6" />
          </div>
          <div className="text-right">
            <span className="text-slate-500">Date</span>
            <div className="border-b border-dotted border-slate-300 h-6" />
          </div>
        </div>

        {/* Received with thanks from */}
        <LabeledLine label="Received with thanks from" value={name} />

        {/* Amount in words (placeholder – usually convert total to words) */}
        <LabeledLine label="Amount (In Word)" value="—" />

        {/* Payment method row */}
        <div className="flex items-center gap-4 text-sm text-slate-700 mb-3 flex-wrap">
          <span className="text-slate-500">By</span>
          {['Cash','Cheque','Credit Card','Money Order'].map((m) => (
            <span key={m} className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 border border-slate-400 rounded-sm" />
              {m}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-2">
            <span className="text-slate-500">No.</span>
            <span className="inline-block w-40 border-b border-dotted border-slate-300 h-6" />
          </span>
          <span className="flex items-center gap-2">
            <span className="text-slate-500">Bank</span>
            <span className="inline-block w-40 border-b border-dotted border-slate-300 h-6" />
          </span>
        </div>

        {/* Purpose and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">For the purpose of</span>
            <span className="flex-1 border-b border-dotted border-slate-300 h-6" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Contact No.</span>
            <span className="flex-1 border-b border-dotted border-slate-300 h-6" />
          </div>
        </div>

        {/* TK / Amount box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm">TK</span>
            <input
              readOnly
              value={invoice?.total ?? 0}
              className="input w-40"
            />
          </div>
          <div className="text-center text-sm">
            <div className="border-b border-dotted border-slate-300 h-8" />
            <div className="text-slate-500 mt-1">Received By</div>
          </div>
          <div className="text-center text-sm">
            <div className="border-b border-dotted border-slate-300 h-8" />
            <div className="text-slate-500 mt-1">Authorized Signature</div>
          </div>
        </div>

        {/* Line items summary (our tuition details) */}
        <div className="mt-6 card border-0 shadow-none">
          <div className="card-body p-0">
            <table className="min-w-full">
              <thead>
                <tr className="table-th">
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Batch</th>
                  <th className="p-3 text-left">Cycle</th>
                  <th className="p-3 text-right">Base (₹)</th>
                  <th className="p-3 text-right">Fines (₹)</th>
                  <th className="p-3 text-right">Discount (₹)</th>
                  <th className="p-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100">
                  <td className="p-3">{name}</td>
                  <td className="p-3">{batchName || '-'}</td>
                  <td className="p-3">
                    {invoice?.cycleStart ? dayjs(invoice.cycleStart).format('DD MMM YYYY') : '-'} →
                    {' '}
                    {invoice?.cycleEnd ? dayjs(invoice.cycleEnd).format('DD MMM YYYY') : '-'}
                  </td>
                  <td className="p-3 text-right">{invoice?.baseAmount ?? 0}</td>
                  <td className="p-3 text-right">{invoice?.fines ?? 0}</td>
                  <td className="p-3 text-right">{invoice?.discount ?? 0}</td>
                  <td className="p-3 text-right font-semibold">{invoice?.total ?? 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Right vertical accent like the image */}
      <div className="hidden md:block absolute" />
      <div className="relative">
        <div className="absolute top-0 right-0 h-full w-14 bg-slate-900/90 text-white flex-col items-center justify-center hidden md:flex">
          <div className="-rotate-90 tracking-[0.4em] font-semibold">RECEIPT</div>
        </div>
      </div>
    </div>
  );
}

function LabeledLine({ label, value }) {
  return (
    <div className="text-sm text-slate-700 mb-3">
      <span className="text-slate-500">{label}</span>
      <div className="border-b border-dotted border-slate-300 h-7 flex items-center px-2">
        <span className="text-slate-800">{value}</span>
      </div>
    </div>
  );
}
