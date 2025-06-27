import React, { useState } from 'react';
import AISuggestedRecipeCard from '../../components/Feed/AISuggestedRecipeCard'; // 🔁 adjust path as per file
import './CalorieSmart.css';

const CalorieSmart = () => {
    const [calories, setCalories] = useState('');
    const [foodType, setFoodType] = useState('');
    const [recipes, setRecipes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setRecipes('');

        const prompt = `Give 3 healthy recipe under ${calories} calories based on ${foodType}. Respond only in JSON with:
- title
- ingredients (array of {name, quantity})
- preparation (array of steps)
- calorie_count (number)`;
        try {
            const response = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key": process.env.REACT_APP_GEMINI_API_KEY, // 
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: prompt }],
                            },
                        ],
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
            console.error('Error:', err);
            setError('Failed to fetch recipes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="caloriesmart-container">
            <h2 className="calorie-title">CalorieSmart </h2>
            <p className="calorie-subtitle">A Healthy Recipe Generator</p>

            <div className="input-form">
                <input
                    type="number"
                    placeholder="Enter your target calories (e.g. 500)"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Preferred food type (e.g.Salad, Protein-rich)"
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />

                <button
                    onClick={handleGenerate}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Get Healthy Recipe'}
                </button>

            </div>
            {error && <p className="error-msg">{error}</p>}
            {/* 🔥 Display Recipes */}
            <div className="recipe-grid">
                {Array.isArray(recipes) ? (
                    recipes.map((recipe, idx) => (
                        <AISuggestedRecipeCard key={idx} recipe={recipe} type="calorie" />
                    ))
                ) : recipes ? (
                    <AISuggestedRecipeCard recipe={recipes} type="calorie" />
                ) : null}

            </div>
        </div>
    );
};

export default CalorieSmart;







