import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddContact.css';


const AddContact = ({ fetchContacts }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone1: '',
    phone2: '',
    address: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the form data to verify what is being sent
    console.log("Form Data being sent:", formData);

    // Check if required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone1 || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/contacts', formData);  // Ensure URL matches backend
      alert('Contact added successfully!');
      fetchContacts();  // Fetch updated contacts list
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone1: '',
        phone2: '',
        address: '',
      });
    } catch (error) {
      console.error("Error in form submission:", error.response || error); // Log the error for debugging
      alert('Error adding contact');
    }
  };

  return (
    <div className="add-contact-container">
  <h2>Add Contact</h2>
  <form onSubmit={handleSubmit}>
    <input
      name="firstName"
      placeholder="First Name"
      value={formData.firstName}
      onChange={handleChange}
      required
    />
    <input
      name="middleName"
      placeholder="Middle Name"
      value={formData.middleName}
      onChange={handleChange}
    />
    <input
      name="lastName"
      placeholder="Last Name"
      value={formData.lastName}
      onChange={handleChange}
      required
    />
    <input
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
    />
    <input
      name="phone1"
      placeholder="Phone Number 1"
      value={formData.phone1}
      onChange={handleChange}
      required
    />
    <input
      name="phone2"
      placeholder="Phone Number 2"
      value={formData.phone2}
      onChange={handleChange}
    />
    <textarea
      name="address"
      placeholder="Address"
      value={formData.address}
      onChange={handleChange}
      required
    />
    <button type="submit">Add Contact</button>
  </form>
</div>

  );
};

export default AddContact;
