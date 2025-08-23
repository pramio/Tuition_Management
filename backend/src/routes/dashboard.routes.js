import { Router } from 'express';
import Student from '../models/Student.js';
import Batch from '../models/Batch.js';
import Fee from '../models/Fee.js';
import { isBirthdayToday } from '../utils/date.js';
import { auth } from '../middleware/auth.js';

const r = Router();
r.use(auth);

r.get('/', async (req, res, next) => {
try {
const [totalStudents, activeBatches, pendingFees, allStudents] = await Promise.all([
Student.countDocuments({}),
Batch.countDocuments({}),
Fee.countDocuments({ paid: false }),
Student.find()
]);
const upcomingBirthdays = allStudents.filter((s) => s.dob && isBirthdayToday(s.dob));
res.json({ totalStudents, activeBatches, pendingFees, upcomingBirthdays });
} catch (e) { next(e); }
});

export default r;