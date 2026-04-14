import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  source: { type: String },
  date: { type: String },
  status: { type: String, default: 'Applied' },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
