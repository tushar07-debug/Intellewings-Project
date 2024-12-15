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
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch all contacts 
  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/contacts?sortBy=${sortBy}&sortOrder=${sortOrder}&query=${searchQuery}`
      );
      setContacts(response.data.contacts); 
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Fetch contacts whenever sortBy, sortOrder, or searchQuery changes
  useEffect(() => {
    fetchContacts();
  }, [searchQuery, sortBy, sortOrder]);  


  const handleEdit = (contact) => {
    setEditContact(contact);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      if (response.status === 200) {
        setContacts(contacts.filter(contact => contact._id !== id));
        alert('Contact deleted successfully');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting contact');
    }
  };

  // Handle Sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

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
          <ContactList
            contacts={contacts}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </div> */}
      </div>
    </div>
  );
}

export default App;
