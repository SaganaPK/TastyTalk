import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import levenshtein from 'fast-levenshtein';
import './Search.css';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [userPostCounts, setUserPostCounts] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch all users + post counts
  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'talkusers'));
        const users = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllUsers(users);

        // 🔥 Fetch post counts
        const recipesSnapshot = await getDocs(collection(db, 'recipes'));
        const postCountMap = {};
        recipesSnapshot.docs.forEach((doc) => {
          const authorId = doc.data().authorId;
          if (authorId) {
            postCountMap[authorId] = (postCountMap[authorId] || 0) + 1;
          }
        });
        setUserPostCounts(postCountMap);
      } catch (error) {
        console.error('Error fetching users or posts:', error);
      }
      setLoading(false);
    };

    fetchUsersAndPosts();
  }, []);

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    const matches = allUsers.filter(user => {
      const username = user.username?.toLowerCase() || '';
      const dist = levenshtein.get(username, text);
      return dist <= 2 || username.includes(text);
    });

    setSearchResults(matches);
  };

  const usersToDisplay = searchText ? searchResults : allUsers;

  return (
    <div className="search-container">
      <h2 className="search-heading">Looking for tasty creators? 👤</h2>

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

      <div className="user-cards-grid">
        {usersToDisplay.map((user) => (
          <Link to={`/profile/${user.uid}`} key={user.id} className="user-card">
            <h3>{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</h3>
            <p>{userPostCounts[user.uid] || 0} posts shared</p>
          </Link>
        ))}
      </div>

      {!loading && usersToDisplay.length === 0 && searchText.trim() && (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Search;
