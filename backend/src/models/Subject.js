import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    name: { type: String, required: true },
    teacher: String,
    schedule: { day: String, time: String } // e.g., Mon, 5:00-6:00 PM
  },
  { timestamps: true }
);

export default mongoose.model('Subject', subjectSchema);
