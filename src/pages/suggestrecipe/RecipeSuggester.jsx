import React, { useState } from 'react';
import AISuggestedRecipeCard from '../../components/Feed/AISuggestedRecipeCard';
import './RecipeSuggester.css';

const RecipeSuggester = () => {
  const [ingredients, setIngredients] = useState('');
  const [dietPref, setDietPref] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ingredients || !cuisine) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setRecipes(null);
    setError('');

    const prompt = `Suggest 3 recipes based on the following:
Ingredients: ${ingredients}
Cuisine: ${cuisine}
Dietary Preference: ${dietPref || 'None'}

Respond in JSON array format like:
[
  {
    "title": "Recipe name",
    "ingredients": [{"name": "item", "quantity": "x"}],
    "preparation": ["step 1", "step 2"],
    "calorie_count": 400
  }
]`;

    try {
      const res = await fetch(
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

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) throw new Error("Invalid AI response format");

      const parsedRecipes = JSON.parse(jsonMatch[1]);
      setRecipes(parsedRecipes);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recipes. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipesuggester-container">
      <h2 className="recipe-title">Smart Recipe Suggester</h2>
      <p className="recipe-subtitle">Get recipes based on your ingredients, dietary needs, and cuisine!</p>

      <form className="input-form" onSubmit={handleSubmit}>
        <label>Available Ingredients</label>
        <textarea
          placeholder="e.g., tomato, rice, onion, garlic"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />

        <label>Dietary Preference</label>
        <select
          value={dietPref}
          onChange={(e) => setDietPref(e.target.value)}
          className="dropdown"
        >
          <option value="">-- None --</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Keto">Keto</option>
          <option value="Low Carb">Low Carb</option>
        </select>

        <label>Preferred Cuisine</label>
        <input
          type="text"
          placeholder="e.g., Indian, Italian, Chinese"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Generating...' : 'Get Recipes'}
        </button>

        {error && <p className="error-msg">{error}</p>}
      </form>

      <div className="recipe-grid">
        {recipes &&
          Array.isArray(recipes) &&
          recipes.map((recipe, idx) => (
            <AISuggestedRecipeCard key={idx} recipe={recipe} type="smart" />
          ))}
      </div>
    </div>
  );
};

export default RecipeSuggester;
