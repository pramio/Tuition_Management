import { Router } from 'express';
import Batch from '../models/Batch.js';
import Subject from '../models/Subject.js';
import { auth } from '../middleware/auth.js';

const r = Router();
r.use(auth);

r.get('/', async (req, res, next) => {
try {
const list = await Batch.find().populate('students');
res.json(list);
} catch (e) { next(e); }
});

r.post('/', async (req, res, next) => {
try {
const { name, classTimings } = req.body;
if (!name) return res.status(400).json({ message: 'name required' });
const b = await Batch.create({
name: name.trim(),
classTimings: {
days: classTimings?.days || [],
startTime: classTimings?.startTime || '',
endTime: classTimings?.endTime || ''
}
});
res.status(201).json(b);
} catch (e) { next(e); }
});

r.put('/:id', async (req, res, next) => {
try {
const { name, classTimings } = req.body;
const b = await Batch.findByIdAndUpdate(
req.params.id,
{
...(name != null ? { name: name.trim() } : {}),
...(classTimings != null ? {
classTimings: {
days: classTimings?.days || [],
startTime: classTimings?.startTime || '',
endTime: classTimings?.endTime || ''
}
} : {})
},
{ new: true }
);
if (!b) return res.status(404).json({ message: 'Batch not found' });
res.json(b);
} catch (e) { next(e); }
});

r.delete('/:id', async (req, res, next) => {
try {
await Batch.findByIdAndDelete(req.params.id);
await Subject.deleteMany({ batch: req.params.id });
res.json({ ok: true });
} catch (e) { next(e); }
});

export default r;

