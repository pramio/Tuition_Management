import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    classTimings: {
      days: [String],   // ['Mon','Wed','Fri']
      startTime: String, // '17:00'
      endTime: String    // '18:00'
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
  },
  { timestamps: true }
);

export default mongoose.model('Batch', batchSchema);
