import { Router } from 'express';
import Student from '../models/Student.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import { auth } from '../middleware/auth.js';
import { nextCycle } from '../utils/date.js';
import { buildReceiptPDF } from '../services/pdf/receiptPdf.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendSMS } from '../services/notifications/sms.js';

const r = Router();
r.use(auth);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create or get current cycle invoice
r.post('/create-cycle', async (req, res, next) => {
  try {
    const { studentId, baseAmount, refDate } = req.body;
    const student = await Student.findById(studentId).populate('batch');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const { start, end } = nextCycle(student.admissionDate, refDate ? new Date(refDate) : new Date());

    const finesAgg = await Attendance.aggregate([
      { $match: { student: student._id, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, fines: { $sum: '$fine' } } }
    ]);
    const fines = finesAgg[0]?.fines || 0;

    const total = (baseAmount || 0) + fines;
    const existing = await Fee.findOne({ student: student._id, cycleStart: start, cycleEnd: end });
    const fee = existing || await Fee.create({
      student: student._id, cycleStart: start, cycleEnd: end,
      baseAmount, fines, total, paid: false
    });
    res.json(fee);
  } catch (e) {
    next(e);
  }
});

// Pay and generate receipt + SMS
r.post('/pay', async (req, res, next) => {
  try {
    const { feeId, discount = 0, notify = true } = req.body;
    const fee = await Fee.findById(feeId).populate({ path: 'student', populate: { path: 'batch' } });
    if (!fee) return res.status(404).json({ message: 'Fee not found' });

    fee.discount = discount;
    fee.total = Math.max(0, (fee.baseAmount || 0) + (fee.fines || 0) - (discount || 0));
    fee.paid = true;
    fee.paidAt = new Date();
    fee.receiptNumber = 'RCPT-' + (fee._id.toString().slice(-6)).toUpperCase();
    await fee.save();

    const logoPath = path.join(__dirname, '../../assets/logo.png');
    const signaturePath = path.join(__dirname, '../../assets/sign.png'); // Added signature path
    
    const pdfBuf = await buildReceiptPDF({
      receipt: fee.toObject(),
      student: fee.student,
      logoPath,
      signaturePath, // Added signature parameter
      brandName: process.env.BRAND_NAME || 'SciencePlus Tuition'
    });

    if (notify && fee.student.parentContact) {
      const msg = [
        `${process.env.BRAND_NAME || 'SciencePlus Tuition'}: Fee received for ${fee.student.name}.`,
        `Cycle ${new Date(fee.cycleStart).toLocaleDateString()} → ${new Date(fee.cycleEnd).toLocaleDateString()}.`,
        `Total ₹${fee.total} (Base ₹${fee.baseAmount}${fee.fines ? `, Fines ₹${fee.fines}` : ''}${fee.discount ? `, Discount ₹${fee.discount}` : ''}).`,
        `Receipt ${fee.receiptNumber}.`
      ].join(' ');
      try { await sendSMS({ to: fee.student.parentContact, body: msg }); } catch {}
    }

    res.json({ ok: true, receiptNumber: fee.receiptNumber, pdf: pdfBuf.toString('base64') });
  } catch (e) {
    next(e);
  }
});

r.get('/pending', async (req, res, next) => {
  try {
    const list = await Fee.find({ paid: false }).populate('student');
    res.json(list);
  } catch (e) {
    next(e);
  }
});

export default r;
