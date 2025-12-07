import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Anonymous', trim: true }
}, { timestamps: true });

export default mongoose.model('Post', PostSchema);
