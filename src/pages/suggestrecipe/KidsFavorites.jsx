import React, { useState } from 'react';
import AISuggestedRecipeCard from '../../components/Feed/AISuggestedRecipeCard';
import './KidsFavorites.css';

const KidsFavorites = () => {
  const [ageGroup, setAgeGroup] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [flavor, setFlavor] = useState('');
  const [mealType, setMealType] = useState('');
  const [time, setTime] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!ageGroup || !ingredient || !flavor || !mealType || !time) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    const prompt = `Suggest 2 kid-friendly ${mealType} recipes under ${time} minutes for a child aged ${ageGroup}, using ingredients like ${ingredient}. The recipes should be ${flavor} and fun to eat. Respond in JSON with an array of:
- title
- ingredients (array of {name, quantity})
- preparation (array of steps)
- cooking_time (minutes)
- fun_tip (optional)`;

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.REACT_APP_GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error: ${errorText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonString = text.match(/```json\n([\s\S]*?)\n```/)?.[1];
      if (!jsonString) throw new Error("Invalid response format");

      const parsed = JSON.parse(jsonString);
      setRecipes(parsed);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kidsfavorites-container">
      <h2 className="kids-title">Kids' Favorites </h2>
      <p className="kids-subtitle">Fun Recipes for Little Ones</p>
      <div className="input-form">
        <label>👶 Select Age Group:</label>
        <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="input-field">
          <option value="">-- Choose Age Group --</option>
          <option value="0-2">0-2</option>
          <option value="3-5">3-5</option>
          <option value="6-9">6-9</option>
          <option value="10-12">10-12</option>
        </select>

        <label>🍓 Favorite Ingredient:</label>
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="e.g., banana, potato"
          className="input-field"
        />

        <label>😋 Flavor Preference:</label>
        <input
          type="text"
          value={flavor}
          onChange={(e) => setFlavor(e.target.value)}
          placeholder="e.g., sweet, cheesy"
          className="input-field"
        />

        <label>🍽️ Meal Type:</label>
        <input
          type="text"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          placeholder="e.g., snack, lunch"
          className="input-field"
        />

        <label>⏱️ Max Prep Time (minutes):</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g., 15"
          className="input-field"
        />

        <button onClick={handleGenerate} className="generate-button">
          {loading ? 'Generating...' : 'Get Recipes'}
        </button>

        {error && <p className="error-msg">{error}</p>}
      </div>

      <div className="recipe-card-list">
        {Array.isArray(recipes) &&
          recipes.map((recipe, idx) => (
            <AISuggestedRecipeCard key={idx} recipe={recipe} type="kids" />
          ))}
      </div>
    </div>
  );
};

export default KidsFavorites;
