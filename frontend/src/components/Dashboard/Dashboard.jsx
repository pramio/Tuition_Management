import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

import Stat from './Stat'; // Import from same folder
import StudentsModal from './StudentsModal';
import BatchesModal from './BatchesModal';
import BirthdaysModal from './BirthdaysModal';
import PendingFeesModal from './PendingFeesModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeBatches: 0,
    pendingFees: 0,
    upcomingBirthdays: [],
  });
  const [openStudents, setOpenStudents] = useState(false);
  const [openBatches, setOpenBatches] = useState(false);
  const [openBirthdays, setOpenBirthdays] = useState(false);
  const [openPendingFees, setOpenPendingFees] = useState(false);

  useEffect(() => {
    api
      .get('/dashboard')
      .then(({ data }) => setStats(data || {}))
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <img src="/logo.png" className="w-10 h-10" />
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat
          title="Total Students"
          value={stats.totalStudents || 0}
          tone="sky"
          onClick={() => navigate('/students')}
        />
        <Stat
          title="Active Batches"
          value={stats.activeBatches || 0}
          tone="emerald"
          onClick={() => navigate('/batches')}
        />
        <Stat
          title="Pending Fees"
          value={stats.pendingFees || 0}
          tone="amber"
          onClick={() => setOpenPendingFees(true)}
        />
        <Stat
          title="Birthdays Today"
          value={(stats.upcomingBirthdays || []).length}
          tone="sky"
          onClick={() => setOpenBirthdays(true)}
        />
      </div>

      <StudentsModal open={openStudents} onClose={() => setOpenStudents(false)} />
      <BatchesModal open={openBatches} onClose={() => setOpenBatches(false)} />
      <BirthdaysModal open={openBirthdays} onClose={() => setOpenBirthdays(false)} birthdays={stats.upcomingBirthdays || []} />
      <PendingFeesModal open={openPendingFees} onClose={() => setOpenPendingFees(false)} />
    </>
  );
}
