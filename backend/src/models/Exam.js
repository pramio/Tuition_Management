import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    term: String,
    marks: [
      {
        subject: String,
        max: { type: Number, default: 100 },
        scored: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Exam', examSchema);
