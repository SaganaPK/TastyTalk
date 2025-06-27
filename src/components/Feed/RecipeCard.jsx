import React from 'react';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import './RecipeCard.css';

const RecipeCard = ({ recipe, username, setRecipes, onDelete }) => {
  
  return (

    <div className="recipe-card">
        {onDelete && (
        <button className="delete-button" onClick={() => onDelete(recipe.id)}>
          🗑️
        </button>
      )}
<p className="author-name">
  {recipe.authorUsername
    ? recipe.authorUsername.charAt(0).toUpperCase() + recipe.authorUsername.slice(1).toLowerCase()
    : 'Unknown'}
</p>     <h3 className="dish-title">{recipe.title}</h3>

      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="dish-image"
        />
      )}

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="ingredients-section">
          <h4>Ingredients:</h4>
          <ul className="ingredients-list">
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="dish-description">{recipe.description}</p>
      <LikeButton recipe={recipe} setRecipes={setRecipes} />
      <CommentSection recipe={recipe} setRecipes={setRecipes} />
    </div>
  );
};

export default RecipeCard;
