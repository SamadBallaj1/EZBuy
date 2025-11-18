import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await fetch(`http://localhost:3001/api/users/email/${firebaseUser.email}`);
          
          if (response.ok) {
            const userData = await response.json();
            const fullUser = {
              ...userData,
              email: firebaseUser.email,
              uid: firebaseUser.uid,
            };
            setUser(fullUser);
            localStorage.setItem('user', JSON.stringify(fullUser));
          } else {
            const tempUser = {
              email: firebaseUser.email,
              uid: firebaseUser.uid,
              is_student: firebaseUser.email.endsWith('.edu'),
            };
            setUser(tempUser);
            localStorage.setItem('user', JSON.stringify(tempUser));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const isStudent = () => {
    return user?.is_student || user?.email?.endsWith('.edu');
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, signOut, isStudent }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};