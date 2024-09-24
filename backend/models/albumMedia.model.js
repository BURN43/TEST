import mongoose from 'mongoose';

const AlbumMediaSchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  uploadedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who owns the album
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  uploadername: { type: String },
  guestGrettingtext: { type: String },
});

const AlbumMedia = mongoose.model('AlbumMedia', AlbumMediaSchema);
export default AlbumMedia;


