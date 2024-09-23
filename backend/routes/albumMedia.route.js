import express from 'express';
import fileUpload from 'express-fileupload';
import AlbumMedia from '../models/albumMedia.model.js'; // Import the model

const router = express.Router();
router.use(fileUpload());

router.post('/upload-media', async (req, res) => {
  try {
    if (!req.files || !req.files.mediaFile) {
      return res.status(400).send('No media file uploaded.');
    }

    const mediaFile = req.files.mediaFile;
    const albumId = req.body.albumId; // Assuming you're sending albumId with the request

    mediaFile.mv(`./uploads/media/${mediaFile.name}`, async (err) => {
      if (err) {
        console.error('Error saving media file:', err);
        return res.status(500).send('Failed to save the media file.');
      }

      const mediaUrl = `/uploads/media/${mediaFile.name}`;
      const mediaType = mediaFile.mimetype.startsWith('image') ? 'image' : 'video';

      // Save the media URL and type to the MongoDB AlbumMedia model
      const newMedia = new AlbumMedia({ mediaUrl, mediaType, albumId });
      await newMedia.save();

      res.send({ mediaUrl });
    });
  } catch (error) {
    console.error('Error during media upload:', error);
    res.status(500).send('Server error during media upload.');
  }
});

export default router;
