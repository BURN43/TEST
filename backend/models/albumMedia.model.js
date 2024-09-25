import mongoose from 'mongoose';

const AlbumMediaSchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  albumId: { type: String, required: true }, // Changed to String for UUID
  uploadedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Still an ObjectId
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  uploadername: { type: String },
  guestGrettingtext: { type: String },
});

const AlbumMedia = mongoose.model('AlbumMedia', AlbumMediaSchema);
export default AlbumMedia;
