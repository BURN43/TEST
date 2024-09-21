import Settings from '../models/settings.model.js';  // assuming you have a Settings model

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
    const { userId } = req.params;
    const updatedSettings = await Settings.findOneAndUpdate({ userId }, req.body, {
      new: true,  // Return the updated settings
      upsert: true,  // Create the document if it doesn't exist
    });
    res.status(200).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
