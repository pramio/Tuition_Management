import { NavLink } from 'react-router-dom';
import { FaChartPie, FaUserGraduate, FaUsers, FaClipboardCheck, FaRupeeSign, FaFileSignature, FaBell } from 'react-icons/fa';

const nav = [
  { to: '/', label: 'Dashboard', icon: FaChartPie },
  { to: '/students', label: 'Students', icon: FaUserGraduate },
  { to: '/batches', label: 'Batches', icon: FaUsers },
  { to: '/attendance', label: 'Attendance', icon: FaClipboardCheck },
  { to: '/fees', label: 'Fees', icon: FaRupeeSign },
  { to: '/exams', label: 'Exams', icon: FaFileSignature },
  { to: '/notifications', label: 'Notifications', icon: FaBell },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100">
      <div className="px-5 py-4 text-slate-800 font-semibold">Navigation</div>
      <nav className="flex flex-col">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-5 py-3 flex items-center gap-3 hover:bg-sky-50 ${
                isActive ? 'bg-sky-100 text-sky-800' : 'text-slate-700'
              }`
            }
          >
            <Icon className="text-sky-600" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
