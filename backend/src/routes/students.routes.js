import { Router } from 'express';
import Student from '../models/Student.js';
import Batch from '../models/Batch.js';
import { auth } from '../middleware/auth.js';
import { isBirthdayToday } from '../utils/date.js';

const r = Router();
r.use(auth);

r.get('/', async (req, res, next) => {
try {
const list = await Student.find().populate('batch');
res.json(list);
} catch (e) { next(e); }
});

r.post('/', async (req, res, next) => {
try {
const s = await Student.create(req.body);
if (s.batch) await Batch.findByIdAndUpdate(s.batch, { $addToSet: { students: s._id } });
res.status(201).json(s);
} catch (e) { next(e); }
});

r.put('/:id', async (req, res, next) => {
try {
const prev = await Student.findById(req.params.id);
const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (prev.batch?.toString() !== s.batch?.toString()) {
if (prev.batch) await Batch.findByIdAndUpdate(prev.batch, { $pull: { students: s._id } });
if (s.batch) await Batch.findByIdAndUpdate(s.batch, { $addToSet: { students: s._id } });
}
res.json(s);
} catch (e) { next(e); }
});

r.delete('/:id', async (req, res, next) => {
try {
const s = await Student.findByIdAndDelete(req.params.id);
if (s?.batch) await Batch.findByIdAndUpdate(s.batch, { $pull: { students: s._id } });
res.json({ ok: true });
} catch (e) { next(e); }
});

r.get('/birthdays/today', async (req, res, next) => {
try {
const all = await Student.find();
const today = all.filter((s) => s.dob && isBirthdayToday(s.dob));
res.json(today);
} catch (e) { next(e); }
});

export default r;

