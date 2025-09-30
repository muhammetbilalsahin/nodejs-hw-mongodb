const {
  getAllContacts,
  getContactById,
  addContact,
  patchContact,
  removeContact,
} = require('../services/contacts');
const createError = require('http-errors');
const mongoose = require('mongoose'); // ObjectId kontrolü için

const getContacts = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

const getContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(404, 'Contact not found'); // Geçersiz ID
  }

  const contact = await getContactById(contactId);
  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

const createContact = async (req, res) => {
  const contact = await addContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(404, 'Contact not found'); // Geçersiz ID
  }

  const contact = await patchContact(contactId, req.body);
  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(404, 'Contact not found'); // Geçersiz ID
  }

  const contact = await removeContact(contactId);
  if (!contact) throw createError(404, 'Contact not found');

  res.status(204).json();
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
