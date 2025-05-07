import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return null; // or spinner if you want
  }

  return currentUser ? children : <Navigate to="/" />;
};

export default PrivateRoute;
