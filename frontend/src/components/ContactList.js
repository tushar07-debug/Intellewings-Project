import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContactList.css';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch contacts when the component mounts 
  useEffect(() => {
    // Fetch all contacts (no pagination needed)
    axios.get(`http://localhost:5000/api/contacts?sortBy=${sortBy}&sortOrder=${sortOrder}`)
      .then(res => {
        if (res.status === 200) {
          setContacts(res.data.contacts); 
        } else {
          console.error('Error fetching contacts:', res.statusText);
        }
      })
      .catch(err => console.error('Error fetching contacts:', err));
  }, [sortBy, sortOrder]); 

  // Pagination controls
  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setPage(newPage); // Update the page state
  //   }
  // };

  // Delete contact handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`);
        alert('Contact deleted successfully!');
        // Refetch contacts after deletion
        axios.get(`http://localhost:5000/api/contacts?sortBy=${sortBy}&sortOrder=${sortOrder}`)
          .then(res => {
            if (res.status === 200) {
              setContacts(res.data.contacts);
            }
          })
          .catch(err => console.error('Error fetching contacts after delete:', err));
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact');
      }
    }
  };

  // Sorting handler
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="contact-list-container">
      <h2>Contact List</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('firstName')}>Full Name</th>
            <th onClick={() => handleSort('email')}>Email</th>
            <th onClick={() => handleSort('phone1')}>Phone 1</th>
            <th onClick={() => handleSort('phone2')}>Phone 2</th>
            <th onClick={() => handleSort('address')}>Address</th>
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
      {/* Pagination
      <div className="pagination-buttons">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
        <span>{`Page ${page} of ${totalPages}`}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
      </div> */}
    </div>
  );
};

export default ContactList;
