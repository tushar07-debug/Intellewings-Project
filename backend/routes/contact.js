const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // Assuming you have a Contact model

// Handle GET request to fetch contacts (pagination example)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find().skip(skip).limit(limit);
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contacts', error: err });
  }
});

// Handle POST request to create a new contact
router.post('/', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: 'Error creating contact', error: err });
  }
});

// Handle DELETE request to delete a contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (contact) {
      res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting contact', error: err });
  }
});

module.exports = router;
