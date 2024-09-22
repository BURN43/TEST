// backend/routes/upload.route.js
import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// File filter to validate image and video types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png',   // Image types
    'video/mp4', 'video/webm', 'video/avi',   // Video types
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type. Only JPEG, PNG, MP4, WebM, and AVI are allowed.');
    error.status = 400;
    return cb(error, false);
  }
  cb(null, true);
};

// Set up multer storage and file validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Adjust your file destination as needed
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
});

// Route for uploading videos
router.post('/video', upload.single('videoFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }
  const videoUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ videoUrl });
});

// Other routes for images or profile pictures
// ...

export default router;
