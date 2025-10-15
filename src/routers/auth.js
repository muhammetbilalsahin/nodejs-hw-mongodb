const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshSession,
  logout,
} = require('../controllers/auth');

// validation middleware kullanıyorsan burada ekle (örn. Joi)
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshSession);
router.post('/logout', logout);

module.exports = router;
