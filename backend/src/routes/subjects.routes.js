import { Router } from 'express';
import Subject from '../models/Subject.js';
import { auth } from '../middleware/auth.js';

const r = Router();
r.use(auth);

r.get('/:batchId', async (req, res, next) => {
  try {
    const list = await Subject.find({ batch: req.params.batchId });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

r.post('/', async (req, res, next) => {
  try {
    const s = await Subject.create(req.body); // { batch, name, teacher, schedule }
    res.status(201).json(s);
  } catch (e) {
    next(e);
  }
});

r.put('/:id', async (req, res, next) => {
  try {
    const s = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(s);
  } catch (e) {
    next(e);
  }
});

r.delete('/:id', async (req, res, next) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default r;
