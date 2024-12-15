import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';
import SearchBar from './components/SearchBar';

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
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
        <h1>Contact Book</h1>
        <SearchBar setSearchQuery={setSearchQuery} />
      </header>
      <div className="content">
        <div className="add-contact">
          <AddContact fetchContacts={fetchContacts} />
        </div>
        <div className="contact-list">
          <ContactList contacts={contacts} fetchContacts={fetchContacts} />
        </div>
      </div>
    </div>
  );
}

export default App;
