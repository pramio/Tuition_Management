import { Router } from 'express';
import dayjs from 'dayjs';
import Attendance from '../models/Attendance.js';
import { auth } from '../middleware/auth.js';

const r = Router();
r.use(auth);

// ✅ Mark or update attendance
r.post('/mark', async (req, res, next) => {
  try {
    const { date, batch, student, status, forgotBook } = req.body;
    if (!date || !batch || !student || !status) {
      return res.status(400).json({ message: 'date, batch, student, status required' });
    }

    const day = dayjs(date).startOf('day').toDate();
    let fine = 0;
    if (status === 'Absent') fine += 10;
    if (status === 'Present' && forgotBook) fine += 5;

    const doc = await Attendance.findOneAndUpdate(
      { date: day, student },
      { $set: { date: day, batch, student, status, forgotBook: !!forgotBook, fine } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('student', 'name');

    res.json(doc);
  } catch (e) {
    console.error('Mark attendance error:', e); // Added for debugging
    next(e);
  }
});

// ✅ Get attendance for a single student (history)
r.get('/', async (req, res, next) => {
  try {
    const { student, from, to } = req.query;
    if (!student) return res.status(400).json({ message: 'student required' });

    const q = { student };
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = dayjs(from).startOf('day').toDate();
      if (to) q.date.$lt = dayjs(to).add(1, 'day').startOf('day').toDate();
    }

    const list = await Attendance.find(q).sort({ date: -1 });
    res.json(list);
  } catch (e) {
    console.error('Get student attendance error:', e); // Added for debugging
    next(e);
  }
});

// ✅ Get attendance by batch + date (for frontend batch view)
r.get('/by-batch', async (req, res, next) => {
  try {
    const { batch, date } = req.query;
    if (!batch || !date) {
      return res.status(400).json({ message: 'batch and date required' });
    }

    const day = dayjs(date).startOf('day').toDate();
    const nextDay = dayjs(date).add(1, 'day').startOf('day').toDate();

    const list = await Attendance.find({
      batch,
      date: { $gte: day, $lt: nextDay }
    }).populate('student', 'name');

    res.json(list);
  } catch (e) {
    console.error('By-batch attendance error:', e); // Added for debugging
    next(e);
  }
});

export default r;
