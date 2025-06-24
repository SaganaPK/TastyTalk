import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './PostRecipe.css'; // Import your CSS

const PostRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // 🔥 Base64 string store pannrom
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !image) {
      setError('Dish name and photo are required.');
      return;
    }

    try {
      await addDoc(collection(db, 'recipes'), {
        title,
        description,
        imageUrl: image, // 🔥 Base64 string saved
        authorId: currentUser.uid,
        authorUsername: currentUser.username,
        isAI: false,
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
      });

      navigate('/home');
    } catch (err) {
      console.error('Error adding document:', err);
      setError('Failed to post recipe.');
    }
  };

  return (
    <div className="post-recipe-container">
      <h2>Post a New Recipe 🍽️</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name of the Dish"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostRecipe;
