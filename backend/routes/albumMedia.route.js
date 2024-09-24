import express from 'express';
import fileUpload from 'express-fileupload';
import AlbumMedia from '../models/albumMedia.model.js'; // Import the model

const router = express.Router();
router.use(fileUpload());

// Upload media (image/video)
router.post('/upload-media', async (req, res) => {
  try {
    if (!req.files || !req.files.mediaFile) {
      return res.status(400).send('No media file uploaded.');
    }

    const mediaFile = req.files.mediaFile;
    const albumId = req.body.albumId; // Expect albumId from frontend
    const baseURL = 'http://localhost:5000'; // Base URL for your server

    // Save the file in the server's uploads folder
    mediaFile.mv(`./uploads/media/${mediaFile.name}`, async (err) => {
      if (err) {
        console.error('Error saving media file:', err);
        return res.status(500).send('Failed to save the media file.');
      }

      const mediaUrl = `${baseURL}/uploads/media/${mediaFile.name}`; // Full URL
      const mediaType = mediaFile.mimetype.startsWith('image') ? 'image' : 'video';

      // Save the media URL, type, and albumId in MongoDB
      const newMedia = new AlbumMedia({ mediaUrl, mediaType, albumId });
      await newMedia.save();

      res.send({ mediaUrl });
    });
  } catch (error) {
    console.error('Error during media upload:', error);
    res.status(500).send('Server error during media upload.');
  }
});

// Fetch media associated with albumId
router.get('/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    const mediaItems = await AlbumMedia.find({ albumId }); // Fetch media associated with albumId

    if (!mediaItems || mediaItems.length === 0) {
      return res.status(404).json({ message: 'No media found for this album.' });
    }

    res.json({ media: mediaItems });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
