const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user');
const Session = require('../models/session');

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const auth = req.get('Authorization') || '';
    const [type, token] = auth.split(' ');

    if (type !== 'Bearer' || !token) throw createError(401, 'Not authorized');

    let decoded;
    try {
      decoded = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createError(401, 'Access token expired');
      }
      throw createError(401, 'Invalid access token');
    }

    // token verisiyle session kontrolü yapabiliriz
    const session = await Session.findOne({ accessToken: token });
    if (!session) throw createError(401, 'Invalid session');

    if (new Date() > session.accessTokenValidUntil) {
      // token database'de süresi dolmuşsa siliyoruz
      await Session.deleteOne({ _id: session._id });
      throw createError(401, 'Access token expired');
    }

    const user = await User.findById(decoded._id);
    if (!user) throw createError(401, 'User not found');

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
