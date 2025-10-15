require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRouter = require('./routers/auth');
const contactsRouter = require('./routers/contacts');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(cookieParser());

// Router
app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

// Global error handler
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ status: err.status || 500, message: err.message });
});

app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
