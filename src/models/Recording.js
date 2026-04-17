import mongoose from 'mongoose';

const RecordingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  audioData: { type: String, required: true }, // base64 encoded audio
  mimeType: { type: String, default: 'audio/webm' },
  duration: { type: Number, default: 0 }, // seconds
  question: { type: String, default: '' }, // optional linked question
}, { timestamps: true });

export default mongoose.models.Recording || mongoose.model('Recording', RecordingSchema);
