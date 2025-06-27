import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import levenshtein from 'fast-levenshtein';
import './TastyDiscoveries.css';

const TastyDiscoveries = () => {
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuickRecipes = async () => {
      try {
        // Fetch quick recipes
        const q1 = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
        const snapshot1 = await getDocs(q1);
        const quick = snapshot1.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(r => r.imageUrl === '');

        // Fetch AI recipes
        const q2 = query(collection(db, 'AI-recipes'), orderBy('createdAt', 'desc'));
        const snapshot2 = await getDocs(q2);
        const ai = snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const combined = [...quick, ...ai].sort((a, b) => {
          const timeA = a.createdAt?.toDate?.() || new Date();
          const timeB = b.createdAt?.toDate?.() || new Date();
          return timeB - timeA;
        });

        // Fetch usernames
        const userSnap = await getDocs(collection(db, 'talkusers'));
        const userMap = {};
        userSnap.forEach(doc => {
          userMap[doc.id] = doc.data().username;
        });

        setQuickRecipes(combined);
        setFilteredRecipes(combined);
        setUsernames(userMap);
      } catch (err) {
        console.error('❌ Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuickRecipes();
  }, []);

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    if (!text.trim()) {
      setFilteredRecipes(quickRecipes);
      return;
    }

    const filtered = quickRecipes.filter(recipe => {
      const title = recipe.title?.toLowerCase() || '';
      const ingredients = recipe.ingredients?.join(' ').toLowerCase() || '';
      console.log("🧠 Recipe Username Debug:", recipe.title, recipe.authorUsername);

      return (
        title.includes(text) ||
        ingredients.includes(text) ||
        levenshtein.get(title, text) <= 2 ||
        levenshtein.get(ingredients, text) <= 2
      );
    });

    setFilteredRecipes(filtered);
  };

  if (loading) return <p>Loading Quick Recipes...</p>;

  return (
    <div className="discover-container">
      <h2 className="discover-heading">Dive Into Taste 🍽️</h2>

      {/* 🔍 Search */}
      <div className="search-form">
        <input
          type="text"
          placeholder="Type your flavor, we’ll find the dish..."
          value={searchText}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {/* 🧱 Grid of Recipe Tiles */}
      <div className="recipe-tile-grid">
        {filteredRecipes.map(recipe => {
          const username =
            recipe.authorUsername && recipe.authorUsername.trim() !== ''
              ? recipe.authorUsername
              : recipe.isAI
                ? 'ChefBot'
                : usernames[recipe.authorId] || 'Unknown'; const likeCount = recipe.likes?.length || 0;

          return (
            <div
              key={recipe.id}
              className="recipe-tile"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <h4>{recipe.title}</h4>
              <p className="tile-author">by {username}</p>
              <p className="tile-likes">❤️ {likeCount} Likes</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TastyDiscoveries;
