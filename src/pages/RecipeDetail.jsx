import React, { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import RecipeCard from '../components/Feed/RecipeCard';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [username, setUsername] = useState('Unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef1 = doc(db, 'recipes', id);
    const docRef2 = doc(db, 'AI-recipes', id);

    // Listen to real-time updates from 'recipes' or 'AI-recipes'
    const unsubscribe1 = onSnapshot(docRef1, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecipe({ id: docSnap.id, ...data });
        if (data.isAI) {
          setUsername(data.authorUsername || 'ChefBot');
        } else {
          fetchUsername(data.authorId);
        }
        setLoading(false);
      } else {
        // Try AI-recipes if not in recipes
        const unsubscribe2 = onSnapshot(docRef2, (docSnap2) => {
          if (docSnap2.exists()) {
            const data = docSnap2.data();
            setRecipe({ id: docSnap2.id, ...data });
            if (data.isAI) {
              setUsername(data.authorUsername || 'ChefBot');
            } else {
              fetchUsername(data.authorId);
            }
          } else {
            setRecipe(null);
          }
          setLoading(false);
        });

        // Clean up AI listener too
        return unsubscribe2;
      }
    });

    return () => unsubscribe1(); // Clean up listener
  }, [id]);

  const fetchUsername = async (authorId) => {
    try {
      const userDoc = await getDoc(doc(db, 'talkusers', authorId));
      if (userDoc.exists()) {
        setUsername(userDoc.data().username || 'Unknown');
      }
    } catch (err) {
      console.error('Failed to fetch username:', err);
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="recipe-detail-page">
      <RecipeCard recipe={recipe} username={username} setRecipes={() => {}} />
    </div>
  );
};

export default RecipeDetail;
