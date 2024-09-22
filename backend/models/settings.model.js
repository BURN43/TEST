import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  albumTitle: { type: String, default: '' },
  eventDate: { type: Date },  // Stores the event date
  eventTime: { type: String, default: '' }, // Add this field to store event time
  greetingText: { type: String, default: '' },
  guestInfo: { type: String, default: '' },
  disableGuestUploads: { type: Boolean, default: false },
  hidePhotoChallenge: { type: Boolean, default: false },
  hideLivestream: { type: Boolean, default: false },
  disableDownloadOption: { type: Boolean, default: false },

}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
