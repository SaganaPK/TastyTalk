import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AddTastyNote.css';

// 🔊 Clean and Format Speech Result
const cleanAndAdd = (text, setter, format = 'line') => {
  const cleaned = text.trim();
  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  if (format === 'line') {
    setter(prev => prev + '\n• ' + capitalized + '.');
  } else if (format === 'comma') {
    setter(prev => (prev ? prev + ', ' : '') + capitalized);
  }
};

// 🎤 Speech-to-Text Handler
const startSpeechRecognition = (onResult) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("🎙️ Listening...");
  };

  recognition.onspeechend = () => {
    console.log("✅ Speech ended.");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.start();
};

const AddTastyNote = () => {
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
        imageUrl: '', // No image for quick recipe
        authorId: currentUser.uid,
        isAI: false,
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
      <h2>Add a Quick Bite to the Feed </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Dish Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="voice-input">
          <textarea
            placeholder="Ingredients (comma separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <button
            type="button"
            onClick={() =>
              startSpeechRecognition((text) =>
                cleanAndAdd(text, setIngredients, 'comma')
              )
            }
          >
            🎤
          </button>
        </div>

        <div className="voice-input">
          <textarea
            placeholder="Instructions"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="button"
            onClick={() =>
              startSpeechRecognition((text) =>
                cleanAndAdd(text, setDescription, 'line')
              )
            }
          >
            🎤
          </button>
        </div>

        <button type="submit">Post Now 🚀</button>
      </form>
    </div>
  );
};

export default AddTastyNote;
