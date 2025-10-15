const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../db/models/user');
const Session = require('../db/models/session');

const ACCESS_EXPIRES_MS = 15 * 60 * 1000; // 15 dakika
const REFRESH_EXPIRES_MS = 30 * 24 * 60 * 60 * 1000; // 30 gün

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(
    'ACCESS_TOKEN_SECRET ve REFRESH_TOKEN_SECRET .env içinde tanımlı olmalı'
  );
}

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw createError(409, 'Email in use');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  return user;
};

const generateAccessToken = (payload) => {
  // JWT içerisine user id koyuyoruz
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Email or password is wrong');

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw createError(401, 'Email or password is wrong');

  // sil eski oturumlar
  await Session.deleteMany({ userId: user._id });

  // tokenler oluştur
  const accessToken = generateAccessToken({
    _id: user._id.toString(),
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    _id: user._id.toString(),
    email: user.email,
  });

  const accessTokenValidUntil = new Date(Date.now() + ACCESS_EXPIRES_MS);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_EXPIRES_MS);

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken,
    refreshToken,
    sessionId: session._id,
    accessTokenExpiresAt: accessTokenValidUntil,
  };
};

const refresh = async ({ sessionId, refreshToken }) => {
  // tercihen sessionId ile doğrula, yoksa refreshToken ile ara
  const session = sessionId
    ? await Session.findOne({ _id: sessionId, refreshToken })
    : await Session.findOne({ refreshToken });

  if (!session) throw createError(401, 'Invalid session or refresh token');

  if (new Date() > session.refreshTokenValidUntil) {
    // sil
    await Session.deleteOne({ _id: session._id });
    throw createError(401, 'Refresh token expired');
  }

  // sil eski oturum
  await Session.deleteOne({ _id: session._id });

  // yeni token üret
  const payload = { _id: session.userId.toString() };
  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);
  const accessTokenValidUntil = new Date(Date.now() + ACCESS_EXPIRES_MS);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_EXPIRES_MS);

  const newSession = await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    sessionId: newSession._id,
  };
};

const logout = async ({ sessionId, refreshToken }) => {
  // sessionId ve refresh token'a göre sil
  const criteria = { _id: sessionId, refreshToken };
  await Session.deleteOne(criteria);
  return;
};

module.exports = { register, login, refresh, logout };
