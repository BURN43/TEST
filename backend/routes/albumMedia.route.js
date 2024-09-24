import express from 'express';
import fileUpload from 'express-fileupload';
import AlbumMedia from '../models/albumMedia.model.js'; // Import the model
import { v4 as uuidv4 } from 'uuid';  // Import UUID generator

const router = express.Router();
router.use(fileUpload());

// Upload media (image/video)
router.post('/upload-media', async (req, res) => {
  try {
    if (!req.files || !req.files.mediaFile) {
      console.error('No media file uploaded');
      return res.status(400).send('No media file uploaded.');
    }

    const mediaFile = req.files.mediaFile;
    let { albumId, userId } = req.body;

    console.log('AlbumId:', albumId, 'UserId:', userId, 'File Name:', mediaFile.name);

    // If no albumId is provided, create a new album ID
    if (!albumId) {
      albumId = uuidv4(); // Generate a new album ID
    }

    // Check if the album already exists
    let existingAlbum = await AlbumMedia.findOne({ albumId, userId });
    if (!existingAlbum) {
      // Create new album entry if it doesn't exist
      existingAlbum = new AlbumMedia({ albumId, userId }); 
      await existingAlbum.save();
      console.log('New album created:', existingAlbum);
    }

    // Save the file in the server's uploads folder
    const uniqueFileName = `${uuidv4()}_${mediaFile.name}`;
    mediaFile.mv(`./uploads/media/${uniqueFileName}`, async (err) => {
      if (err) {
        console.error('Error saving media file:', err);
        return res.status(500).send('Failed to save the media file.');
      }

      const mediaUrl = `http://localhost:5000/uploads/media/${uniqueFileName}`;
      const mediaType = mediaFile.mimetype.startsWith('image') ? 'image' : 'video';

      const newMedia = new AlbumMedia({ mediaUrl, mediaType, albumId, userId });
      await newMedia.save();

      console.log('Media uploaded successfully:', newMedia);
      res.send({ mediaUrl, albumId });
    });
  } catch (error) {
    console.error('Error during media upload:', error);
    res.status(500).send('Server error during media upload.');
  }
});

export default router;
