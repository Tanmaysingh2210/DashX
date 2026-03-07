import User from '../models/User.js';
import {
  validateGitHubUrl,
  validateLeetCodeUrl,
  extractUsername
} from '../utils/platformValidator.js';

export const connectPlatform = async (req, res) => {
  try {
    const { platform, profileUrl } = req.body;

    if (!['github', 'leetcode'].includes(platform)) {
      return res.status(400).json({ message: 'Unsupported platform' });
    }

    if (!profileUrl) {
      return res.status(400).json({ message: 'Profile URL required' });
    }

    if (platform === 'github' && !validateGitHubUrl(profileUrl)) {
      return res.status(400).json({ message: 'Invalid GitHub profile URL' });
    }

    if (platform === 'leetcode' && !validateLeetCodeUrl(profileUrl)) {
      return res.status(400).json({ message: 'Invalid LeetCode profile URL' });
    }

    const username = extractUsername(profileUrl);

    const update = {
      [`platforms.${platform}`]: {
        username,
        profileUrl,
        connected: true,
        lastSyncedAt: null
      }
    };

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: update },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: `${platform} connected`,
      platform: user.platforms[platform]
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to connect platform', error: err.message });
  }
};

export const disconnectPlatform = async (req, res) => {
  try {
    const { platform } = req.params;

    if (!['github', 'leetcode'].includes(platform)) {
      return res.status(400).json({ message: 'Unsupported platform' });
    }

    await User.findByIdAndUpdate(req.userId, {
      $set: {
        [`platforms.${platform}.connected`]: false
      }
    });

    res.json({ message: `${platform} disconnected` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to disconnect platform', error: err.message });
  }
};

export const getPlatforms = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('platforms');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.platforms);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get platforms', error: err.message });
  }
};
