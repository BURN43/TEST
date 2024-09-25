import express from 'express';
import fileUpload from 'express-fileupload';
import AlbumMedia from '../models/albumMedia.model.js'; // Import the model
import { v4 as uuidv4 } from 'uuid';  // Import UUID generator
import path from 'path'; // For path operations

const router = express.Router();
router.use(fileUpload());

// Upload media (image/video)
// Upload media (image/video)
router.post('/upload-media', async (req, res) => {
  try {
    if (!req.files || !req.files.mediaFile) {
      console.error('No media file uploaded');
      return res.status(400).send('No media file uploaded.');
    }

    const mediaFile = req.files.mediaFile;
    const { albumId, userId } = req.body;

    console.log('AlbumId:', albumId, 'UserId:', userId, 'File Name:', mediaFile.name);

    // Generate a unique file name
    const uniqueFileName = `${uuidv4()}_${mediaFile.name}`;
    const uploadPath = `./uploads/media/${uniqueFileName}`;

    // Save the file to the server's uploads folder
    mediaFile.mv(uploadPath, async (err) => {
      if (err) {
        console.error('Error saving media file:', err);
        return res.status(500).send('Failed to save the media file.');
      }

      // Construct the media URL
      const mediaUrl = `http://localhost:5000/uploads/media/${uniqueFileName}`;
      const mediaType = mediaFile.mimetype.startsWith('image') ? 'image' : 'video';

      // Save media metadata in MongoDB
      const newMedia = new AlbumMedia({ mediaUrl, mediaType, albumId, userId });
      await newMedia.save();

      console.log('Media uploaded successfully:', newMedia);
      res.send({ mediaUrl, albumId });
    });
  } catch (error) {
    console.error('Error during media upload:', error.message); // Log the full error message
    res.status(500).send('Server error during media upload.');
  }
});

router.get('/:albumId/:userId', async (req, res) => {
  try {
    const { albumId, userId } = req.params;
    const media = await AlbumMedia.find({ albumId, userId });
    res.json({ media });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).send('Error fetching media');
  }
});


export default router;
