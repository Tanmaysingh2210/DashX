import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import {
  generateAccessToken,
  generateRefreshToken
} from '../utils/token.js';

export const register = async (req, res) => {
  try {
    const { email, password, timezone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User exists' });

    const passwordHash = await hashPassword(password);

    await User.create({
      email,
      passwordHash,
      settings: { timezone }
    });

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.sendStatus(403);
  }

  try {
    const tokens = await RefreshToken.find({ userId: payload.userId });

    let matchedToken = null;
    for (const token of tokens) {
      if (await bcrypt.compare(refreshToken, token.tokenHash)) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken) return res.sendStatus(403);

    // 🔥 ROTATION: delete old token
    await matchedToken.deleteOne();

    const newRefreshToken = generateRefreshToken(payload.userId);
    const newHash = await bcrypt.hash(newRefreshToken, 10);

    await RefreshToken.create({
      userId: payload.userId,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json({
      accessToken: generateAccessToken(payload.userId),
      refreshToken: newRefreshToken
    });
  } catch (err) {
    res.status(500).json({ message: 'Token refresh failed', error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(204);

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.sendStatus(204); // token expired/invalid, treat as already logged out
    }

    const tokens = await RefreshToken.find({ userId: payload.userId });
    for (const token of tokens) {
      if (await bcrypt.compare(refreshToken, token.tokenHash)) {
        await token.deleteOne();
        break;
      }
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};
