import mongoose from 'mongoose';

const RecruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  type: { type: String },
  date: { type: String },
}, { timestamps: true });

export default mongoose.models.Recruiter || mongoose.model('Recruiter', RecruiterSchema);
