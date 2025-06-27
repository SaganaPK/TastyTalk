import React, { useState } from 'react';
import './SweetTooth.css';
import AISuggestedRecipeCard from '../../components/Feed/AISuggestedRecipeCard'; // update the path if needed

const SweetTooth = () => {
    const [sweetType, setSweetType] = useState('');
    const [flavor, setFlavor] = useState('');
    const [diet, setDiet] = useState([]);
    const [prepTime, setPrepTime] = useState('');
    const [error, setError] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    const dietOptions = ['Vegan', 'Gluten-Free', 'Nut-Free', 'Sugar-Free'];

    const handleDietChange = (e) => {
        const value = e.target.value;
        if (diet.includes(value)) {
            setDiet(diet.filter(d => d !== value));
        } else {
            setDiet([...diet, value]);
        }
    };

    const generatePrompt = () => {
        let prompt = `Suggest a ${sweetType} sweet recipe`;
        if (flavor) {
            prompt += ` with ${flavor} flavor`;
        }
        if (diet.length > 0) {
            prompt += ` that is ${diet.join(', ')}`;
        }
        if (prepTime) {
            prompt += ` and can be made within ${prepTime} minutes.`;
        }
        prompt += ` Respond in JSON with title, ingredients (array of {name, quantity}), preparation (array), and calorie_count.`;

        return prompt;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sweetType || !flavor || !prepTime) {
            setError('Please fill all required fields');
            return;
        }

        setError('');
        setLoading(true);
        setRecipes([]);

        const prompt = generatePrompt();

        try {
            const response = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': process.env.REACT_APP_GEMINI_API_KEY,
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

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            const jsonString = text.match(/```json\n([\s\S]*?)\n```/)?.[1];
            if (!jsonString) throw new Error('Invalid JSON format');

            const parsed = JSON.parse(jsonString);
            setRecipes(Array.isArray(parsed) ? parsed : [parsed]);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch recipes. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sweettooth-container">
            <h2 className="sweet-title">Sweet Tooth Recipe Suggester</h2>
            <form className="input-form" onSubmit={handleSubmit}>
                <label>Sweets Type</label>
                <select
                    className="sweettooth-input"
                    value={sweetType}
                    onChange={(e) => setSweetType(e.target.value)}
                    required
                >
                    <option value="">-- Select Type --</option>
                    <option value="Baked">Baked (cakes, cookies)</option>
                    <option value="Cold">Cold (ice cream, puddings)</option>
                    <option value="Candy">Candy / Chocolates</option>
                    <option value="Traditional">Traditional Sweets</option>
                </select>

                <label>Flavor Preferences</label>
                <input
                    type="text"
                    placeholder="e.g., chocolate, vanilla, fruit"
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    className="sweettooth-input"
                    required
                />

                <label>Dietary Restrictions</label>
                <div className="diet-options">
                    {dietOptions.map(option => (
                        <label key={option} className="diet-label">
                            <input
                                type="checkbox"
                                value={option}
                                checked={diet.includes(option)}
                                onChange={handleDietChange}
                            />
                            {option}
                        </label>
                    ))}
                </div>

                <label>Max Preparation Time (minutes)</label>
                <input
                    type="number"
                    min="1"
                    placeholder="e.g., 30"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="sweettooth-input"
                    required
                />

                <button type="submit" disabled={loading} className="sweettooth-button">
                    {loading ? 'Generating...' : 'Get Sweet Recipes'}
                </button>

                {error && <p className="error-msg">{error}</p>}
            </form>

            <div className="recipe-grid">
                {recipes.map((recipe, idx) => (
                    <AISuggestedRecipeCard key={idx} recipe={recipe} />
                ))}
            </div>
        </div>
    );
};

export default SweetTooth;
