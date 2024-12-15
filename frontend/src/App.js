import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';
import SearchBar from './components/SearchBar';

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editContact, setEditContact] = useState(null);

  // Fetch all contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Handle Edit
const handleEdit = (contact) => {
  setEditContact(contact); // Fill the form with the contact data
};

// Handle Save (after editing)
const handleSave = async (updatedContact) => {
  try {
    const response = await fetch(`http://localhost:5000/contacts/${updatedContact.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedContact),
    });

    if (!response.ok) {
      throw new Error('Error updating contact');
    }

    const updatedData = await response.json();
    setContacts(contacts.map(contact => contact.id === updatedContact.id ? updatedData : contact)); // Update the contact list
    setEditContact(null); // Clear the edit form
  } catch (error) {
    alert(error.message); // Show error message
  }
};

  // Fetch search results
  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/contacts/search?query=${searchQuery}`
      );
      setContacts(response.data);
    } catch (error) {
      console.error('Error searching contacts:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setContacts(contacts.filter((contact) => contact._id !== id));
        alert('Contact deleted successfully');
      } else {
        alert('Error deleting contact');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting contact');
    }
  };
  
  // Fetch all contacts initially
  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    } else {
      fetchContacts();
    }
  }, [searchQuery]);

  return (
    <div className="App">
      <header className="App-header">
      <h1 style={{ textAlign: 'center' }}>Contact Book</h1>
        <SearchBar setSearchQuery={setSearchQuery} />
      </header>
      <div className="content">
        <div className="add-contact">
          <AddContact fetchContacts={fetchContacts} />
        </div>
        {/* <div className="contact-list">
          <ContactList contacts={contacts} fetchContacts={fetchContacts} />
        </div> */}
      </div>
    </div>
  );
}

export default App;
