import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toastError } from '../../utils/notify';
import FeesTab from './FeesTab';
import AttendanceTab from './AttendanceTab';
import SubjectsTab from './SubjectsTab';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [tab, setTab] = useState('fees');

  const load = async () => {
    try {
      const { data } = await api.get('/students');
      const s = (data || []).find((x) => x._id === id);
      if (!s) {
        toastError('Not found');
        return navigate('/students');
      }
      setStudent(s);
    } catch {
      toastError('Failed to load');
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!student) return null;

  // Compute total due if fees info is available
  const totalDue = student.feesDue || student.totalDue || 0;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {student.name}
            {totalDue > 0 && (
              <span className="ml-4 text-lg font-medium text-red-600">
                Total Due: ₹{totalDue}
              </span>
            )}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/students/${id}/edit`)}
            className="btn btn-primary"
          >
            Edit
          </button>
          <Link to="/students" className="btn btn-ghost">
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Info title="Phone" value={student.phone || '-'} />
        <Info title="Parent" value={student.parentContact || '-'} />
        <Info title="Batch" value={student.batch?.name || '-'} />
        <Info
          title="DOB"
          value={student.dob ? new Date(student.dob).toLocaleDateString() : '-'}
        />
        <Info
          title="Admission"
          value={
            student.admissionDate
              ? new Date(student.admissionDate).toLocaleDateString()
              : '-'
          }
        />
      </div>

      <div className="card">
        <div className="border-b flex">
          <TabButton active={tab === 'fees'} onClick={() => setTab('fees')}>
            Fees
          </TabButton>
          <TabButton
            active={tab === 'attendance'}
            onClick={() => setTab('attendance')}
          >
            Attendance
          </TabButton>
          <TabButton
            active={tab === 'subjects'}
            onClick={() => setTab('subjects')}
          >
            Subjects
          </TabButton>
        </div>
        <div className="card-body">
          {tab === 'fees' && <FeesTab student={student} />}
          {tab === 'attendance' && <AttendanceTab student={student} />}
          {tab === 'subjects' && <SubjectsTab student={student} />}
        </div>
      </div>
    </>
  );
}

function Info({ title, value }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="label">{title}</div>
        <div className="mt-1 font-medium">{value}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 ${
        active
          ? 'text-sky-700 border-b-2 border-sky-600'
          : 'text-slate-600'
      }`}
    >
      {children}
    </button>
  );
}
