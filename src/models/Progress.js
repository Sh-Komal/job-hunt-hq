import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, default: 'komal' },
  dsaDone: { type: mongoose.Schema.Types.Mixed, default: {} },
  prepDone: { type: mongoose.Schema.Types.Mixed, default: {} },
  prepNotes: { type: mongoose.Schema.Types.Mixed, default: {} },
  vaultLinks: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
