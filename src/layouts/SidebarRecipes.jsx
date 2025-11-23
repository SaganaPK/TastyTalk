import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './SidebarRecipes.css';

const SidebarRecipes = () => {
  const [topRecipes, setTopRecipes] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // 🥇 Fetch Top Liked Recipes
        const recipesSnap = await getDocs(collection(db, 'recipes'));
        const all = recipesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sorted = [...all].sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );
        const top3 = sorted.slice(0, 5);
        const randomTop = [...top3].sort(() => 0.5 - Math.random());
        setTopRecipes(randomTop);

        // 🤖 Fetch random AI suggestions
        const aiSnap = await getDocs(collection(db, 'AI-recipes'));
        const aiAll = aiSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const shuffled = aiAll.sort(() => 0.5 - Math.random()).slice(0, 3);
        setAiSuggestions(shuffled);
      } catch (err) {
        console.error("🔥 Failed to fetch sidebar recipes:", err);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="sidebar-recipes">
      <div className="section">
        <h4>🔥 Most Loved Dishes</h4>
        <ul className="recipe-list">
          {topRecipes.map(recipe => (
            <li
              key={recipe.id}
              className="recipe-item"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <span className="title">{recipe.title}</span>
              <span className="likes-count">❤️ {recipe.likes?.length || 0}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="section ai-section">
        <h4>🤖 Try Our Irresistible AI Picks</h4>
        <ul className="recipe-list">
          {aiSuggestions.map(recipe => (
            <li
              key={recipe.id}
              className="recipe-item"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <span className="title">{recipe.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarRecipes;
