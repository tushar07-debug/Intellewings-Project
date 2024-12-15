const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Import the Contact model
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
    process.exit(1); // Exit process if MongoDB connection fails
  });

// Base API Route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Contact Book API!');
});

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
      phone2: phone2 || '', // Default to an empty string if not provided
      address: address || '', // Default to an empty string if not provided
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
  const query = req.query.query; // Access query parameter
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
  next(); // Pass control to the next middleware or route handler
});

// Authentication Routes
app.use('/api/auth', require('./routes/auth'));

// Contact Routes (This will handle all /api/contacts requests)
app.use('/api/contacts', require('./routes/contact'));

// Handle 404 Errors for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
