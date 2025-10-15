const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContact,
  addContact,
  updateContact,
  removeContact,
} = require('../controllers/contacts');

// Tüm rotalar
router.get('/', getContacts);
router.get('/:contactId', getContact);
router.post('/', addContact);
router.patch('/:contactId', updateContact);
router.delete('/:contactId', removeContact);

module.exports = router;
