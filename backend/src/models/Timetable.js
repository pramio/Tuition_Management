import mongoose from 'mongoose';
const timetableSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  entries: [{
    day: String, time: String, subject: String, teacher: String
  }]
}, { timestamps: true });
export default mongoose.model('Timetable', timetableSchema);
