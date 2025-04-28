import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './QuickRecipe.css';

const QuickRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'recipes'), {
        title: title.trim() || 'Untitled Dish',
        ingredients: ingredients.split(',').map((ing) => ing.trim()),
        description: description.trim(),
        imageUrl: '', // 🔥 No image for Quick recipe
        authorId: currentUser.uid,
        authorUsername: currentUser.username || 'Unknown',
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
      });

      navigate('/home');
    } catch (error) {
      console.error('Error posting recipe:', error);
    }
  };

  return (
    <div className="quick-post-card">
      <h2>Quick Post ✨</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Dish Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <textarea
          placeholder="Instructions"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Post Now 🚀</button>
      </form>
    </div>
  );
};

export default QuickRecipe;
