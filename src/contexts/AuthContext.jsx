import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const fetchUserData = async () => {
        if (user) {
          try {
            const userDocRef = doc(db, 'talkusers', user.uid);
            const userDoc = await getDoc(userDocRef);
  
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                username: userData.username,
              });
            } else {
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                username: 'UnknownUser',
              });
            }
          } catch (error) {
            console.error('Error fetching user document:', error);
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              username: 'UnknownUser',
            });
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      };
  
      fetchUserData(); // 🔥 call async inside
    });
  
    return () => unsubscribe();
  }, []);
  

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
