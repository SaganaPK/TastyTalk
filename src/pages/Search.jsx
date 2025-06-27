import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import levenshtein from 'fast-levenshtein'; // 🔥 Import Levenshtein
import './Search.css';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch all users once when page loads
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'talkusers');
        const snapshot = await getDocs(usersRef);
        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // 🔥 When user types, handle search
  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    const matches = allUsers.filter(user => {
        const username = user.username?.toLowerCase() || '';
        const dist = levenshtein.get(username, text); // 🔥 Use .get
        return dist <= 2 || username.includes(text);
      });
      

    setSearchResults(matches);
  };

  return (
    <div className="search-container">
      <h2 className="search-heading">Looking for tasty creators? 👤</h2>

      {/* 🔥 Live Typing Search */}
      <div className="search-form">
        <input
          type="text"
          placeholder="Search foodies, chefs, or creators…"
          value={searchText}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {loading && <p>Loading users...</p>}

      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map(user => (
            <div key={user.id} className="search-user">
              <Link to={`/profile/${user.uid}`} className="search-link">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase()}
              </Link>
            </div>
          ))
        ) : (
          !loading && searchText.trim() && <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
