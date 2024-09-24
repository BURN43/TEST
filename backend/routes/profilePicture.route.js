import fs from 'fs';
import path from 'path';
import express from 'express';
import fileUpload from 'express-fileupload';
import ProfilePicture from '../models/profilePicture.model.js'; // Assuming you have a model

const router = express.Router();
router.use(fileUpload());

router.post('/upload-profile-pic', async (req, res) => {
  try {
    if (!req.files || !req.files.profilePic) {
      return res.status(400).send('No profile picture uploaded.');
    }

    const profilePic = req.files.profilePic;
    const userId = req.body.userId;
    const baseURL = 'http://localhost:5000'; // Base URL for your server

    // Find the current profile picture for the user
    const existingProfile = await ProfilePicture.findOne({ userId });

    // If an old profile picture exists, delete the file from the server
    if (existingProfile && existingProfile.profilePicUrl) {
      const oldPicPath = path.join(process.cwd(), existingProfile.profilePicUrl.replace(baseURL, ''));
      fs.unlink(oldPicPath, (err) => {
        if (err) {
          console.error('Error deleting old profile picture:', err);
        } else {
          console.log('Old profile picture deleted:', oldPicPath);
        }
      });
    }

    // Save the new profile picture on the server
    profilePic.mv(`./uploads/profiles/${profilePic.name}`, async (err) => {
      if (err) {
        console.error('Error saving profile picture:', err);
        return res.status(500).send('Failed to save the profile picture.');
      }

      const profilePicUrl = `${baseURL}/uploads/profiles/${profilePic.name}`; // Full URL

      // Save the new profile picture URL in the database
      if (existingProfile) {
        // Update the existing profile picture entry
        existingProfile.profilePicUrl = profilePicUrl;
        await existingProfile.save();
      } else {
        // Create a new profile picture entry if none exists
        const newProfile = new ProfilePicture({ userId, profilePicUrl });
        await newProfile.save();
      }

      res.send({ profilePicUrl });
    });
  } catch (error) {
    console.error('Error during profile picture upload:', error);
    res.status(500).send('Server error during profile picture upload.');
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profilePicture = await ProfilePicture.findOne({ userId });

    if (!profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found.' });
    }

    res.json({ profilePicUrl: profilePicture.profilePicUrl });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
