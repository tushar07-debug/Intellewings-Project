const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');  

// Handle GET request to fetch contacts 
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

// Handle PUT request to update a contact
router.put('/:id', async (req, res) => {
  const { firstName, lastName, email, phone1, phone2, address } = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone1, phone2, address },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(updatedContact);
  } catch (err) {
    res.status(500).json({ message: 'Error updating contact', error: err });
  }
});

// Handle GET request for searching contacts
router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const contacts = await Contact.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone1: { $regex: query, $options: 'i' } },
        { phone2: { $regex: query, $options: 'i' } },
      ],
    });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).send('Error searching contacts');
  }
});

module.exports = router;
