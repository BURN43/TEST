import express from 'express';
import { updateSettings, getSettings } from '../controllers/settings.controller.js';

const router = express.Router();

// Route to get settings
router.get('/:userId', getSettings);

// Route to update settings
router.post('/:userId', updateSettings);

export default router;
