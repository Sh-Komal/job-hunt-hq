import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // null for Google-only users
  image: { type: String, default: '' },
  provider: { type: String, default: 'credentials' }, // 'credentials' or 'google'
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
