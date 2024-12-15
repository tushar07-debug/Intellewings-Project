const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const Contact = require('./models/contact'); 


dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); 
  });

// Base API Route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Contact Book API!');
});

// Fetch contacts with pagination
// app.get('/api/contacts', async (req, res) => {
//   try {
//     const { page = 1, limit = 10, sortBy = 'firstName', sortOrder = 'asc' } = req.query;

//     const sortDirection = sortOrder === 'asc' ? 1 : -1; // Ascending or Descending
//     const contactsPerPage = parseInt(limit); // Default to 10 if not provided
//     const skip = (page - 1) * contactsPerPage; // Skip contacts based on the page number

//     // Fetch contacts from the database with pagination
//     const contacts = await Contact.find()
//       .sort({ [sortBy]: sortDirection }) // Sorting by field and direction
//       .skip(skip)  // Skip based on the page number
//       .limit(contactsPerPage);  // Limit results to contactsPerPage

//     // Get the total number of contacts for pagination calculation
//     const totalContacts = await Contact.countDocuments();

//     res.json({ contacts, totalContacts });
//   } catch (error) {
//     console.error('Error fetching contacts:', error);
//     res.status(500).json({ message: 'Error fetching contacts' });
//   }
// });


// Backend route for creating a contact (POST /api/contacts)
app.post('/api/contacts', async (req, res) => {
  const { firstName, lastName, email, phone1, phone2, address } = req.body;

  // Validate only required fields
  if (!firstName || !lastName || !email || !phone1) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create a new contact with provided data
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone1,
      phone2: phone2 || '', 
      address: address || '', 
    });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Error creating contact', error });
  }
});

// Search contacts by query (GET /search)
app.get('/search', async (req, res) => {
  const query = req.query.query; 
  try {
    const results = await Contact.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone1: { $regex: query, $options: 'i' } },
        { phone2: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(results);
  } catch (error) {
    console.error('Error searching contacts:', error);
    res.status(500).send('Server error');
  }
});

// Add logging middleware for /api/contacts route
app.use('/api/contacts', (req, res, next) => {
  console.log('Request received at /api/contacts');
  next(); 
});

// Authentication Routes
app.use('/api/auth', require('./routes/auth'));

// Contact Routes  handle all /api/contacts requests)
app.use('/api/contacts', require('./routes/contact'));

// Handle 404 Errors for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
});

app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  const contactId = req.params.id;
  const updatedData = req.body;
  try {
    const contact = await Contact.findByIdAndUpdate(contactId, updatedData, { new: true });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Error updating contact', error: err });
  }
});


// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
