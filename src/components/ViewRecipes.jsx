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
    // 🔥 1. Get quick recipes from 'recipes' collection
    const q1 = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
    const snapshot1 = await getDocs(q1);
    const quickRecipes = snapshot1.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((recipe) => recipe.imageUrl === '');

    // 🤖 2. Get AI recipes from 'AI-recipes' collection
    const q2 = query(collection(db, 'AI-recipes'), orderBy('createdAt', 'desc'));
    const snapshot2 = await getDocs(q2);
    const aiRecipes = snapshot2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  // 🧠 3. Combine both
const combined = [...quickRecipes, ...aiRecipes];

// 📅 4. Sort by createdAt (if needed)
combined.sort((a, b) => {
  const timeA = a.createdAt?.toDate?.() || new Date();
  const timeB = b.createdAt?.toDate?.() || new Date();
  return timeB - timeA;
});

setQuickRecipes(combined);
setFilteredRecipes(combined); // Show all initially
setLoading(false); // ✅ Fix added here

  } catch (error) {
    console.error('❌ Error fetching recipes:', error);
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
  <h3 className="recipe-title">{recipe.title}</h3>

  {recipe.ingredients && recipe.ingredients.length > 0 && (
    <>
      <h4>Ingredients You’ll Need:</h4>
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  )}

  <h4>How to Make It:</h4>
  <p>{recipe.description}</p>
</div>

        ))
      ) : (
        <p>No matching quick recipes found.</p>
      )}
    </div>
  );
};

export default ViewRecipes;
