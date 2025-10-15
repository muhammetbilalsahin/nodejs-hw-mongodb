require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const contactsRouter = require('./routers/contacts'); // tek tanım
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');
// const authenticate = require('./middlewares/authenticate'); // varsa aç

function setupServer() {
  const app = express();

  // Middleware'ler
  app.use(express.json());
  app.use(cookieParser());

  // Router'lar
  // Eğer authenticate yoksa direkt kullan
  app.use('/contacts', contactsRouter);
  // Eğer authenticate varsa: app.use('/contacts', authenticate, contactsRouter);

  // Health check
  app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
  });

  // 404 ve global error handler
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = setupServer;
