import express from 'express';
import fileUpload from 'express-fileupload';

const router = express.Router();

// Use fileUpload middleware
router.use(fileUpload());

// Route for profile picture upload
router.post('/upload-profile-pic', async (req, res) => {
  try {
    if (!req.files || !req.files.profilePic) {
      return res.status(400).send('No profile picture uploaded.');
    }

    const profilePic = req.files.profilePic;
    console.log('Profile picture received:', profilePic.name);

    profilePic.mv(`./uploads/profiles/${profilePic.name}`, (err) => {
      if (err) {
        console.error('Error saving profile picture:', err);
        return res.status(500).send('Failed to save the profile picture.');
      }
      res.send({ profilePicUrl: `/uploads/profiles/${profilePic.name}` });
    });
  } catch (error) {
    console.error('Error during profile picture upload:', error);
    res.status(500).send('Server error during profile picture upload.');
  }
});

// Route for album media (images or videos) upload
router.post('/upload-media', async (req, res) => {
  try {
    if (!req.files || !req.files.mediaFile) {
      return res.status(400).send('No media file uploaded.');
    }

    const mediaFile = req.files.mediaFile;
    console.log('Media file received:', mediaFile.name);

    mediaFile.mv(`./uploads/media/${mediaFile.name}`, (err) => {
      if (err) {
        console.error('Error saving media file:', err);
        return res.status(500).send('Failed to save the media file.');
      }
      res.send({ mediaUrl: `/uploads/media/${mediaFile.name}` });
    });
  } catch (error) {
    console.error('Error during media upload:', error);
    res.status(500).send('Server error during media upload.');
  }
});

export default router;
