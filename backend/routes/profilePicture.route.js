import express from 'express';
import fileUpload from 'express-fileupload';
import ProfilePicture from '../models/profilePicture.model.js'; // Import the model

const router = express.Router();
router.use(fileUpload());

router.post('/upload-profile-pic', async (req, res) => {
  try {
    if (!req.files || !req.files.profilePic) {
      return res.status(400).send('No profile picture uploaded.');
    }

    const profilePic = req.files.profilePic;
    const userId = req.body.userId; // Assuming you're sending userId with the request

    profilePic.mv(`./uploads/profiles/${profilePic.name}`, async (err) => {
      if (err) {
        console.error('Error saving profile picture:', err);
        return res.status(500).send('Failed to save the profile picture.');
      }

      const profilePicUrl = `/uploads/profiles/${profilePic.name}`;

      // Save the profile picture URL to the MongoDB ProfilePicture model
      const newProfilePicture = new ProfilePicture({ profilePicUrl, userId });
      await newProfilePicture.save();

      res.send({ profilePicUrl });
    });
  } catch (error) {
    console.error('Error during profile picture upload:', error);
    res.status(500).send('Server error during profile picture upload.');
  }
});

export default router;
