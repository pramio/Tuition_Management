import { useEffect, useMemo, useState, useRef } from 'react';
import api from '../../utils/api';
import { toastSuccess, toastError } from '../../utils/notify';

export default function Attendance() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [batchId, setBatchId] = useState('');
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [attendanceData, setAttendanceData] = useState({}); // { [studentId]: { status, forgotBook, fine? } }
  const [loading, setLoading] = useState(false);

  // Polling reference
  const pollRef = useRef(null);
  const canFetch = useMemo(() => Boolean(batchId && date), [batchId, date]);

  // Load batches
  useEffect(() => {
    api.get('/batches')
      .then(({ data }) => setBatches(data || []))
      .catch(() => toastError('Failed to load batches'));
  }, []);

  // Update student list when batch changes
  useEffect(() => {
    if (!batchId) {
      setStudents([]);
      setAttendanceData({});
      setEditingId(null);
      return;
    }
    const b = (batches || []).find((x) => x._id === batchId);
    setStudents(b?.students || []);
    setEditingId(null);
    setAttendanceData({});
  }, [batchId, batches]);

  // Fetch attendance
  const fetchAttendance = async () => {
    if (!canFetch) return;
    try {
      setLoading(true);
      const { data } = await api.get('/attendance/by-batch', {
        params: { batch: batchId, date },
      });
      const map = {};
      (data || []).forEach((rec) => {
        const sid = typeof rec.student === 'object' ? rec.student._id : rec.student;
        map[sid] = { status: rec.status, forgotBook: !!rec.forgotBook, fine: rec.fine };
      });
      setAttendanceData(map);
    } catch (e) {
      toastError('Failed to fetch attendance');
      setAttendanceData({});
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch whenever date or batch changes
  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId, date]);

  // Polling for near-real-time
  useEffect(() => {
    if (!canFetch) return;
    pollRef.current && clearInterval(pollRef.current);
    pollRef.current = setInterval(fetchAttendance, 15000);
    return () => {
      pollRef.current && clearInterval(pollRef.current);
    };
  }, [canFetch]);

  // Save/Update attendance
  const mark = async (studentId, status, forgotBook) => {
    if (!batchId) return toastError('Please select a batch first');
    try {
      await api.post('/attendance/mark', {
        date,
        batch: batchId,
        student: studentId,
        status,
        forgotBook,
      });
      toastSuccess('Attendance updated');
      // Optimistic update
      setAttendanceData((prev) => ({
        ...prev,
        [studentId]: { status, forgotBook },
      }));
      setEditingId(null);
      // Refresh from server (to get fine, etc.)
      fetchAttendance();
    } catch {
      toastError('Failed to update');
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-700';
      case 'Absent':
        return 'bg-orange-100 text-orange-700';
      case 'Leave':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Attendance</h1>

      <div className="card mb-4">
        <div className="card-body flex flex-wrap gap-3">
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            className="select"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-body divide-y">
          {loading && (
            <div className="text-center text-slate-500 py-4">Loading attendance…</div>
          )}
          {!loading && students.map((s) => {
            const record = attendanceData[s._id] || {};
            const isEditing = editingId === s._id;

            return (
              <div key={s._id} className="py-3 flex items-center justify-between">
                <div>{s.name}</div>
                <div className="flex gap-2 items-center">
                  {/* If attendance already exists and not editing → show status + edit */}
                  {record.status && !isEditing ? (
                    <>
                      <span className={`px-2 py-1 rounded font-medium ${getStatusClasses(record.status)}`}>
                        {record.status}{record.forgotBook ? ' + Book' : ''}
                      </span>
                      {typeof record.fine === 'number' && record.fine > 0 && (
                        <span className="text-slate-500 text-sm">Fine: ₹{record.fine}</span>
                      )}
                      <button
                        onClick={() => setEditingId(s._id)}
                        className="btn btn-icon"
                        title="Edit"
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Only allow marking if no record OR editing */}
                      {(!record.status || isEditing) && (
                        <>
                          <button onClick={() => mark(s._id, 'Present', false)} className="btn btn-success">Present</button>
                          <button onClick={() => mark(s._id, 'Absent', false)} className="btn btn-warn">Absent ₹10</button>
                          <button onClick={() => mark(s._id, 'Leave', false)} className="btn bg-red-100 text-red-700 border border-red-200">Leave</button>
                          <button onClick={() => mark(s._id, 'Present', true)} className="btn btn-primary">Present + Book ₹5</button>
                          {isEditing && (
                            <button onClick={() => setEditingId(null)} className="btn btn-secondary">Cancel</button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {!loading && students.length === 0 && (
            <div className="text-center text-slate-500 py-6">
              Select a batch to mark attendance
            </div>
          )}
        </div>
      </div>
    </>
  );
}
