import mongoose from 'mongoose';

const AlbumMediaSchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const AlbumMedia = mongoose.model('AlbumMedia', AlbumMediaSchema);
export default AlbumMedia;
