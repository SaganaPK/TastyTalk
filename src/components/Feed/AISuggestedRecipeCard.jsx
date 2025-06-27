import React from 'react';
import './AISuggestedRecipeCard.css';

const AISuggestedRecipeCard = ({ recipe, type }) => {
    const { title, ingredients, preparation } = recipe;
    const cookingTime = recipe.cooking_time;
    const calories = recipe.calories;
    console.log(recipe['cooking time'] + "," + type);
    return (
        <div className="ai-recipe-card">
            <h3>{title}</h3>

            {type === 'quick' && cookingTime && (
                <p className="ai-recipe-meta">⏱️ Cooking Time: {cookingTime}</p>
            )}

            {type === 'calorie' && calories && (
                <p className="ai-recipe-meta">🔥 Calories: {calories}</p>
            )}

            <h4>🧂 Ingredients</h4>
            <ul >
                {recipe.ingredients.map((item, idx) => (
                    <li key={idx}>
                        {typeof item === 'string'
                            ? item
                            : `${item.name}${item.quantity ? ` – ${item.quantity}` : ''}`}
                    </li>
                ))}
            </ul>


            <h4>👨‍🍳 Preparation</h4>
            <p>{preparation}</p>
        </div>
    );
};

export default AISuggestedRecipeCard;
