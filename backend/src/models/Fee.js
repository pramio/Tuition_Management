import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    cycleStart: { type: Date, required: true },
    cycleEnd: { type: Date, required: true },
    baseAmount: { type: Number, required: true },
    fines: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    paidAt: Date,
    receiptNumber: String
  },
  { timestamps: true }
);

export default mongoose.model('Fee', feeSchema);
