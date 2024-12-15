import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContactList.css';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/contacts?page=${page}`)
      .then(res => {
        if (res.status === 200) {
          setContacts(res.data);
        } else {
          console.error('Error fetching contacts:', res.statusText);
        }
      })
      .catch(err => console.error('Error fetching contacts:', err));
  }, [page]);

  // Delete contact handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`); // Correct full URL
        alert('Contact deleted successfully!');
        // Update state optimistically by filtering out the deleted contact
        setContacts(prevContacts => prevContacts.filter(contact => contact._id !== id));
      } catch (error) {
        console.error(error);
        alert('Error deleting contact');
      }
    }
  };

  return (
    <div className="contact-list-container">
  <h2>Contact List</h2>
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
          <td>{`${contact.firstName} ${contact.lastName}`}</td>
          <td>{contact.email}</td>
          <td>{contact.phone1}</td>
          <td>{contact.phone2}</td>
          <td>{contact.address}</td>
          <td>
            <button>Edit</button>
            <button onClick={() => handleDelete(contact._id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <div className="pagination-buttons">
    <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
    <button onClick={() => setPage(page + 1)}>Next</button>
  </div>
</div>

  );
};

export default ContactList;
