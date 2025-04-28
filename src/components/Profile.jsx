import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import RecipeCard from './Feed/RecipeCard';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const { uid } = useParams(); // 🔥 fetch URL uid if present
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileUsername, setProfileUsername] = useState('User');

  const viewingUid = uid || currentUser?.uid; // 🔥 Priority to URL uid, else own profile

  useEffect(() => {
    if (!viewingUid) return;
  
    const fetchUserRecipes = async () => {
      try {
        // 🔥 Fetch recipes first
        const q = query(
          collection(db, 'recipes'),
          where('authorId', '==', viewingUid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const recipesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesList);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchProfileUsername = async () => {
      try {
        const usersRef = collection(db, 'talkusers');
        const usersSnapshot = await getDocs(query(usersRef, where('uid', '==', viewingUid)));
        if (!usersSnapshot.empty) {
          const userData = usersSnapshot.docs[0].data();
          setProfileUsername(userData.username.charAt(0).toUpperCase() + userData.username.slice(1).toLowerCase());
        } else {
          console.log('No user found for this UID.');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
  
    fetchUserRecipes();
    fetchProfileUsername(); // 🔥 also fetch username
  }, [viewingUid]);

  const deleteRecipe = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this recipe?')) {
        await deleteDoc(doc(db, 'recipes', id));
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (loading) return <p>Loading recipes...</p>;

  const isOwnProfile = currentUser?.uid === viewingUid; // 🔥 Check self or others

  return (
    <div className="profile-container">
      <h2 className="profile-heading">
        {isOwnProfile ? "My Recipes 🍽️" : `${profileUsername}'s Recipes 🍽️`}
      </h2>

      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            username={profileUsername}
            setRecipes={setRecipes}
            onDelete={isOwnProfile ? deleteRecipe : null} // 🔥 Only if own profile show Delete
          />
        ))
      ) : (
        <p className="no-recipes">No recipes posted yet!</p>
      )}
    </div>
  );
};

export default Profile;
