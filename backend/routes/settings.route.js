// backend/routes/settings.route.js
import express from 'express';
import { updateSettings, getSettings, deleteSettings } from '../controllers/settings.controller.js';

const router = express.Router();

// Route to get settings
router.get('/:userId', getSettings);

// Route to update settings
router.post('/:userId', updateSettings);

// Route to delete settings
router.delete('/:userId', deleteSettings);

export default router;