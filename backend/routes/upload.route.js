// backend/routes/upload.route.js
import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.');
    error.status = 400;
    return cb(error, false);
  }
  cb(null, true);
};

// Set up multer storage and file validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// Route for uploading profile pictures
router.post('/profile', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }
  const profilePicUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ profilePicUrl });
});

// Route for uploading album pictures
router.post('/album', upload.single('albumPic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }
  const albumPicUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ albumPicUrl });
});

export default router;
