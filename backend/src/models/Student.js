import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    dob: Date,
    parentContact: String, // E.164 format, e.g., +91...
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    admissionDate: { type: Date, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
