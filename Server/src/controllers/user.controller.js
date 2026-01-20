import User from '../models/User.js';
import {
  validateGitHubUrl,
  validateLeetCodeUrl,
  extractUsername
} from '../utils/platformValidator.js';

export const connectPlatform = async (req, res) => {
  const { platform, profileUrl } = req.body;

  if (!['github', 'leetcode'].includes(platform)) {
    return res.status(400).json({ message: 'Unsupported platform' });
  }

  if (!profileUrl) {
    return res.status(400).json({ message: 'Profile URL required' });
  }

  if (
    platform === 'github' &&
    !validateGitHubUrl(profileUrl)
  ) {
    return res.status(400).json({ message: 'Invalid GitHub profile URL' });
  }

  if (
    platform === 'leetcode' &&
    !validateLeetCodeUrl(profileUrl)
  ) {
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

  res.json({
    message: `${platform} connected`,
    platform: user.platforms[platform]
  });
};

export const disconnectPlatform = async (req, res) => {
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
};

export const getPlatforms = async (req, res) => {
  const user = await User.findById(req.userId).select('platforms');
  res.json(user.platforms);
};
