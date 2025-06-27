import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import RecipeCard from '../components/Feed/RecipeCard';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [username, setUsername] = useState('Unknown');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'recipes', id);
        const altRef = doc(db, 'AI-recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRecipe({ id: docSnap.id, ...data });

          if (data.authorUsername) {
            setUsername(data.authorUsername);
          } else {
            const userSnap = await getDoc(doc(db, 'talkusers', data.authorId));
            if (userSnap.exists()) {
              setUsername(userSnap.data().username);
            }
          }
        } else {
          // try AI collection
          const altSnap = await getDoc(altRef);
          if (altSnap.exists()) {
            const data = altSnap.data();
            setRecipe({ id: altSnap.id, ...data });
            setUsername(data.authorUsername || 'ChefBot');
          }
        }
      } catch (err) {
        console.error('Error loading recipe:', err);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <RecipeCard recipe={recipe} username={username} setRecipes={() => {}} />
    </div>
  );
};

export default RecipeDetail;
