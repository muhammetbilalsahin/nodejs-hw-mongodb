const createHttpError = require('http-errors');
const Contact = require('../db/models/Contact.js');

// GET /contacts
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find(); // userId filtresi kaldırıldı
    res.json({ status: 200, data: contacts });
  } catch (err) {
    next(err);
  }
};

// GET /contacts/:contactId
const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) throw createHttpError(404, 'Contact not found');
    res.json({ status: 200, data: contact });
  } catch (err) {
    next(err);
  }
};

// POST /contacts
const addContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ status: 201, data: contact });
  } catch (err) {
    next(err);
  }
};

// PATCH /contacts/:contactId
const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      { new: true }
    );
    if (!contact) throw createHttpError(404, 'Contact not found');
    res.json({ status: 200, data: contact });
  } catch (err) {
    next(err);
  }
};

// DELETE /contacts/:contactId
const removeContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.contactId);
    if (!contact) throw createHttpError(404, 'Contact not found');
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getContacts,
  getContact,
  addContact,
  updateContact,
  removeContact,
};
