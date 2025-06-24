import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIKo9P8sSfLRsLWapduRq8Q2fPoC5y5_o",
  authDomain: "tastytalks-3a97d.firebaseapp.com",
  projectId: "tastytalks-3a97d",
  storageBucket: "tastytalks-3a97d.firebasestorage.app",
  messagingSenderId: "964685021756",
  appId: "1:964685021756:web:70e4eab478d70e66067939"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const updateRecipes = async () => {
  const recipesRef = collection(db, 'recipes');
  const snapshot = await getDocs(recipesRef);

  snapshot.forEach(async (docSnap) => {
    const data = docSnap.data();

    // Only update if isAI doesn't exist
    if (data.isAI === undefined) {
      const recipeRef = doc(db, 'recipes', docSnap.id);
      await updateDoc(recipeRef, {
        isAI: false,
      });
      console.log(`Updated recipe ${docSnap.id} with isAI: false`);
    }
  });
};

updateRecipes();
