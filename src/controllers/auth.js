const createError = require('http-errors');
const authService = require('../services/auth');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, sessionId, accessTokenExpiresAt } =
      await authService.login({ email, password });

    // cookie'lere hem refreshToken hem sessionId koy
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // domain: process.env.COOKIE_DOMAIN, // gerekiyorsa uncomment
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('sessionId', sessionId.toString(), cookieOptions);

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || {};
    const { sessionId } = req.cookies || {};
    if (!refreshToken) throw createError(401, 'No refresh token');

    const {
      accessToken,
      refreshToken: newRefreshToken,
      sessionId: newSessionId,
    } = await authService.refresh({ sessionId, refreshToken });

    // yeni cookie'leri setle
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };
    res.cookie('refreshToken', newRefreshToken, cookieOptions);
    res.cookie('sessionId', newSessionId.toString(), cookieOptions);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || {};
    const { sessionId } = req.cookies || {};
    if (!refreshToken || !sessionId) {
      // yine de cookie'leri temizleyip 204 dönebiliriz
      res.clearCookie('refreshToken');
      res.clearCookie('sessionId');
      return res.status(204).send();
    }
    await authService.logout({ sessionId, refreshToken });

    // cookie temizle
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshSession, logout };
