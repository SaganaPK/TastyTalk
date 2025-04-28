import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import levenshtein from 'fast-levenshtein';
import './SuggestRecipe.css'; // optional styling

const SuggestRecipe = () => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const recipesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllRecipes(recipesList);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecipes();
  }, []);

  const handleSuggest = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    if (!text.trim()) {
      setSuggestedRecipes([]);
      return;
    }

    const searchIngredients = text.split(',').map(item => item.trim());

    const suggested = allRecipes.filter(recipe => {
      if (!recipe.ingredients || recipe.ingredients.length === 0) return false;

      const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());

      let matchCount = 0;

      searchIngredients.forEach(searchIng => {
        recipeIngredients.forEach(recipeIng => {
          const dist = levenshtein.get(searchIng, recipeIng);
          if (dist <= 2 || recipeIng.includes(searchIng)) {
            matchCount++;
          }
        });
      });

      return matchCount >= 2; // 🔥 Minimum 2 matched ingredients
    });

    setSuggestedRecipes(suggested);
  };

  if (loading) return <p>Loading Recipes...</p>;

  return (
    <div className="suggest-recipe-container">
      <h2 className="suggest-recipe-heading">Suggest Recipes 🍳</h2>

      {/* 🔥 Ingredients Input */}
      <div className="suggest-form">
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)..."
          value={searchText}
          onChange={handleSuggest}
          className="suggest-input"
        />
      </div>

      {/* 🔥 Suggestions List */}
      <div className="suggested-recipes-list">
        {suggestedRecipes.length > 0 ? (
          suggestedRecipes.map(recipe => (
            <div key={recipe.id} className="suggested-recipe-card">
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
          searchText && <p>No matching recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default SuggestRecipe;
