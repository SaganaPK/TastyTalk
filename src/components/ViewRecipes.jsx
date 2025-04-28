import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import levenshtein from 'fast-levenshtein'; // 🔥 Import levenshtein
import './ViewRecipes.css';

const ViewRecipes = () => {
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuickRecipes = async () => {
      try {
        const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const recipesList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((recipe) => recipe.imageUrl === ''); // 🔥 Only quick recipes

        setQuickRecipes(recipesList);
        setFilteredRecipes(recipesList); // Show all initially
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuickRecipes();
  }, []);

  // 🔥 Live typo tolerant search
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

      const titleDist = levenshtein.get(title, text);
      const ingredientsDist = levenshtein.get(ingredients, text);

      return (
        title.includes(text) ||
        ingredients.includes(text) ||
        titleDist <= 2 ||
        ingredientsDist <= 2
      );
    });

    setFilteredRecipes(filtered);
  };

  if (loading) return <p>Loading Quick Recipes...</p>;

  return (
    <div className="view-recipes-container">
      <h2 className="view-recipes-heading">Quick Recipes 🍽️</h2>

      {/* 🔥 Search box */}
      <div className="search-form">
        <input
          type="text"
          placeholder="Search recipes by title or ingredients..."
          value={searchText}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="quick-recipe-card">
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <ul>
                {recipe.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p>No matching quick recipes found.</p>
      )}
    </div>
  );
};

export default ViewRecipes;
