import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Layout/Navbar.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';

import StudentsList from './components/Students/StudentsList.jsx';
import StudentForm from './components/Students/StudentForm.jsx';
import StudentProfile from './components/Students/StudentProfile.jsx';

import BatchesList from './components/Batches/BatchesList.jsx';
import BatchForm from './components/Batches/BatchForm.jsx';
import BatchDetails from './components/Batches/BatchDetails.jsx';

import Attendance from './components/Attendance/Attendance.jsx';
import Fees from './components/Fees/Fees.jsx';

import Exams from './components/Exams/Exams.jsx';
import MarksForm from './components/Exams/MarksForm.jsx';
import ReportCardView from './components/Exams/ReportCardView.jsx';

import Notifications from './components/Notifications/Notifications.jsx';
import Login from './pages/Login.jsx';

function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Navbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Private({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Private><Layout><Dashboard /></Layout></Private>} />

        <Route path="/students" element={<Private><Layout><StudentsList /></Layout></Private>} />
        <Route path="/students/new" element={<Private><Layout><StudentForm /></Layout></Private>} />
        <Route path="/students/:id" element={<Private><Layout><StudentProfile /></Layout></Private>} />
        <Route path="/students/:id/edit" element={<Private><Layout><StudentForm /></Layout></Private>} />

        <Route path="/batches" element={<Private><Layout><BatchesList /></Layout></Private>} />
        <Route path="/batches/new" element={<Private><Layout><BatchForm /></Layout></Private>} />
        <Route path="/batches/:id" element={<Private><Layout><BatchDetails /></Layout></Private>} />
        <Route path="/batches/:id/edit" element={<Private><Layout><BatchForm /></Layout></Private>} />

        <Route path="/attendance" element={<Private><Layout><Attendance /></Layout></Private>} />
        <Route path="/fees" element={<Private><Layout><Fees /></Layout></Private>} />

        <Route path="/exams" element={<Private><Layout><Exams /></Layout></Private>} />
        <Route path="/exams/marks/:studentId" element={<Private><Layout><MarksForm /></Layout></Private>} />
        <Route path="/exams/report/:examId" element={<Private><Layout><ReportCardView /></Layout></Private>} />

        <Route path="/notifications" element={<Private><Layout><Notifications /></Layout></Private>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
