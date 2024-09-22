import express from 'express';
import multer from 'multer';
import { uploadProfilePicture, uploadAlbumPhoto } from '../controllers/upload.controller.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';  // Import both middleware

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Adjust the path as needed
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route for profile picture upload
router.post('/profile-picture', authMiddleware, requireRole('admin') upload.single('profilePicture'), uploadProfilePicture);

// Route for album photo upload
router.post('/album-photo', upload.single('albumPhoto'), uploadAlbumPhoto);

export default router;
