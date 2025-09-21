const express = require('express');
const contactsRouter = require('./routes/contacts');

function setupServer() {
  const app = express();

  app.use(express.json());

  // Routers
  app.use('/api/contacts', contactsRouter);

  // Alternatif route
  app.use('/contacts', contactsRouter);

  // Health check
  app.get('/', (req, res) => {
    res.send('API is running');
  });

  // 404 handler - JSON dönsün
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = setupServer;
