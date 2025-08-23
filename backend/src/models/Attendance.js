import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
    forgotBook: { type: Boolean, default: false },
    fine: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Prevent duplicate attendance for same student+date
attendanceSchema.index({ date: 1, student: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
