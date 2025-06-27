import React, { useState } from 'react';
import './QuickBites.css';
import AISuggestedRecipeCard from '../../components/Feed/AISuggestedRecipeCard'; // 🔁 adjust path as per file

const QuickBites = () => {
    const [time, setTime] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!time || !cuisine) {
            setError('Please enter both time and cuisine type.');
            return;
        }

        setError('');
        setLoading(true);

        const prompt = `Generate 3 unique ${cuisine} recipes that can be made in less than ${time} minutes in JSON format with 'title', 'ingredients' (as array), 'preparation', and 'cooking_time'.`;
        console.log("Prompt : " + prompt);
        console.log(process.env.REACT_APP_GEMINI_API_KEY);
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
        <div className="quickbites-container">
            <h2 className="quick-title"> Quick Bites</h2>
            <p className="quick-subtitle">Need something fast? Let AI suggest recipes under your time!</p>

            <div className="input-form">
                <input
                    type="number"
                    placeholder="Time in minutes (e.g., 15)"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Cuisine type (e.g., Indian)"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                />
                <button onClick={handleGenerate} disabled={loading}>
                    {loading ? 'Generating...' : 'Suggest Recipes'}
                </button>
                {error && <p className="error-msg">{error}</p>}
            </div>

            {/* 🔥 Display Recipes */}
            <div className="recipe-grid">
                {recipes.map((recipe, idx) => (
                    <AISuggestedRecipeCard key={idx} recipe={recipe} type="quick" />
                ))}
            </div>
        </div>
    );
};

export default QuickBites;
