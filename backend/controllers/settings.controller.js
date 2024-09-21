// backend/controllers/settings.controller.js
import Settings from '../models/settings.model.js';

// Get settings for a specific user
export const getSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = await Settings.findOne({ userId });
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update settings for a specific user
export const updateSettings = async (req, res) => {
  try {
    console.log('Updated settings:', req.body);
    const updatedSettings = await Settings.findOneAndUpdate({ userId: req.body.userId }, req.body, {
      new: true,
      upsert: true,
    });
    console.log('Updated settings document:', updatedSettings);
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete settings for a specific user
export const deleteSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    await Settings.findOneAndDelete({ userId });
    res.status(200).json({ message: 'Settings deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};