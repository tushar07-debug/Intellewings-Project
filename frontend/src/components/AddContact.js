import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContactList.css';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone1: '',
    phone2: '',
    address: '',
  });

  const [isAdding, setIsAdding] = useState(false); // State for showing the Add Contact form

  // Fetch contacts from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/contacts')
      .then(res => setContacts(res.data))
      .catch(err => console.error('Error fetching contacts:', err));
  }, []);

  // Handle input changes for both adding and editing
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle adding new contact
  const handleAddContact = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/contacts', formData);
      setContacts([...contacts, response.data]); // Add new contact to the list
      alert('Contact added successfully!');
      setIsAdding(false); // Close the add contact form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone1: '',
        phone2: '',
        address: '',
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Error adding contact');
    }
  };

  // Start editing a contact
  const handleEdit = (contact) => {
    setEditingContact(contact._id);
    setFormData(contact); // Pre-fill the form for editing
  };

  // Save edited contact
  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/contacts/${id}`, formData);
      setContacts(contacts.map(contact => contact._id === id ? { ...contact, ...formData } : contact));
      alert('Contact updated successfully!');
      setEditingContact(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone1: '',
        phone2: '',
        address: '',
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Error updating contact');
    }
  };
  

  // Handle deleting a contact
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      setContacts(contacts.filter(contact => contact._id !== id)); // Remove deleted contact from UI
      alert('Contact deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  return (
    <div className="contact-list-container">
      <h2>Contact List</h2>
      
      {/* Button to toggle Add Contact form */}
      <button onClick={() => setIsAdding(!isAdding)}>Add Contact</button>

      {/* Show the Add Contact form if isAdding is true */}
      {isAdding && (
        <div className="contact-form">
          <h3>Add New Contact</h3>
          <form>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone1"
              placeholder="Phone 1"
              value={formData.phone1}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone2"
              placeholder="Phone 2"
              value={formData.phone2}
              onChange={handleInputChange}
            />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleAddContact}>Save</button>
          </form>
        </div>
      )}

      {/* Contact List Table */}
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone 1</th>
            <th>Phone 2</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact._id}>
              {editingContact === contact._id ? (
                <>
                  <td>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      name="phone1"
                      value={formData.phone1}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      name="phone2"
                      value={formData.phone2}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSave(contact._id)}>Save</button>
                    <button onClick={() => setEditingContact(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{`${contact.firstName} ${contact.lastName}`}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone1}</td>
                  <td>{contact.phone2}</td>
                  <td>{contact.address}</td>
                  <td>
                    <button onClick={() => handleEdit(contact)}>Edit</button>
                    <button onClick={() => handleDelete(contact._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
