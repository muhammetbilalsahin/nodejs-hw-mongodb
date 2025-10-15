const Contact = require('../db/models/Contact');

const listContacts = async (userId, { skip = 0, limit = 20 } = {}) => {
  return await Contact.find({ userId }).skip(skip).limit(limit);
};

const getContactById = async (userId, contactId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

const addContact = async (userId, contactData) => {
  return await Contact.create({ ...contactData, userId });
};

const updateContact = async (userId, contactId, data) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, data, {
    new: true,
  });
};

const removeContact = async (userId, contactId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
