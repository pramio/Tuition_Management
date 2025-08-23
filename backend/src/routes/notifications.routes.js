import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { sendSMS } from '../services/notifications/sms.js';
import { sendWhatsApp } from '../services/notifications/whatsapp.js';

const r = Router();
r.use(auth);

r.post('/sms', async (req, res, next) => {
try {
const { to, body } = req.body;
const out = await sendSMS({ to, body });
res.json(out);
} catch (e) { next(e); }
});

r.post('/whatsapp', async (req, res, next) => {
try {
const { to, body } = req.body;
const out = await sendWhatsApp({ to, body });
res.json(out);
} catch (e) { next(e); }
});

export default r;

