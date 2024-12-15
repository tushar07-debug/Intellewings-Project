const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    phone1: { type: String, required: true },
    phone2: { type: String, required: false },
    address: { type: String, required: false },
  },
  { timestamps: true } 
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
