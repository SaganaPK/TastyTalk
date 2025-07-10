import React from 'react';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import './LikeButton.css';

const LikeButton = ({ recipe, setRecipes }) => {
  const { currentUser } = useAuth();

  const handleLike = async () => {
    if (!currentUser) return;

    const collectionName = recipe.isAI ? 'AI-recipes' : 'recipes'; // ✅ Choose correct collection
    const recipeRef = doc(db, collectionName, recipe.id); // ✅ Dynamic ref

    try {
      if (recipe.likes.includes(currentUser.uid)) {
        // 🔻 Unlike
        await updateDoc(recipeRef, {
          likes: arrayRemove(currentUser.uid),
        });

        // 🧠 Update local state
        setRecipes((prevRecipes) =>
          prevRecipes.map((r) =>
            r.id === recipe.id
              ? { ...r, likes: r.likes.filter((uid) => uid !== currentUser.uid) }
              : r
          )
        );
      } else {
        // ❤️ Like
        await updateDoc(recipeRef, {
          likes: arrayUnion(currentUser.uid),
        });

        // 🧠 Update local state
        setRecipes((prevRecipes) =>
          prevRecipes.map((r) =>
            r.id === recipe.id
              ? { ...r, likes: [...r.likes, currentUser.uid] }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <div className="like-section">
      <button className="like-button" onClick={handleLike}>
        {recipe.likes.includes(currentUser?.uid) ? '❤️ Unlike' : '🤍 Like'}
      </button>
      <p className="likes-count">{recipe.likes.length} likes</p>
    </div>
  );
};

export default LikeButton;
