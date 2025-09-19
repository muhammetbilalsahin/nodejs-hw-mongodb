const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contacts');

// CRUD routes
router.get('/', getContacts);
router.get('/:contactId', getContact);
router.post('/', createContact);
router.put('/:contactId', updateContact); // PUT route
router.delete('/:contactId', deleteContact); // DELETE route

module.exports = router;
