const express = require('express');
const contactsRouter = require('./routes/contacts');

function setupServer() {
  const app = express();

  app.use(express.json());

  // Router
  app.use('/api/contacts', contactsRouter);

  // Health check
  app.get('/', (req, res) => {
    res.send('API is running ✅');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = setupServer;
