import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import RecipeCard from './Feed/RecipeCard';
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipesData);

      const usersSnapshot = await getDocs(collection(db, 'talkusers'));
      const userMap = {};
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        userMap[userDoc.id] = userData.username;
      });
      setUsernames(userMap);
    };

    fetchRecipes();
  }, []);

  return (
    <div className="feed-container">
      <h2 className="feed-heading">TastyTalks 🍳 Recipe Feed</h2>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} username={usernames[recipe.authorId]} setRecipes={setRecipes} />
      ))}
    </div>
  );
};

export default Home;
