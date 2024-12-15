import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SearchBar.css';  

const SearchBar = () => {
  const [query, setQuery] = useState(''); // For search query
  const [searchResults, setSearchResults] = useState([]); // For search results

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value;
    setQuery(query);
    
    if (query.trim()) {
      // Perform the search if there's a query
      searchContacts(query);
    } else {
      // Clear search results if no query is entered
      setSearchResults([]);
    }
  };

  // Function to search contacts
  const searchContacts = (query) => {
    axios.get(`http://localhost:5000/api/contacts/search?query=${query}`)
      .then(response => {
        setSearchResults(response.data); 
      })
      .catch(error => {
        console.error('Error searching contacts:', error);
      });
  };

  return (
    <div className="searchbar-container">
      
      <input
        className="searchbar-input"
        type="text"
        placeholder="Search contacts"
        value={query}
        onChange={handleSearch}
      />

      
      <div className="search-results-container">
        <ul className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map(contact => (
              <li key={contact._id}>
                {contact.firstName} {contact.lastName}
              </li>
            ))
          ) : (
            <div className="no-results">
              {query ? "No results found" : "Start typing to search for contacts"}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
