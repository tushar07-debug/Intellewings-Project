import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SearchBar.css';

const SearchBar = ({ setSearchResults }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert('Please enter a search term.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/contacts/search?query=${query}`);
      setSearchResults(res.data || []);
    } catch (error) {
      console.error('Error searching contacts:', error);
      alert('Error searching contacts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
