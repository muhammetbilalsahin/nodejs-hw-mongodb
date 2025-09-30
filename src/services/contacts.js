const Contact = require('../db/Contact');

const getAllContacts = () => Contact.find({});
const getContactById = (id) => Contact.findById(id);
const addContact = (data) => Contact.create(data);
const patchContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });
const removeContact = (id) => Contact.findByIdAndDelete(id);

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  patchContact,
  removeContact,
};
