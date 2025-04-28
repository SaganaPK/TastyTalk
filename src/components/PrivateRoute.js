import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

 // console.log("Current User inside PrivateRoute:", currentUser); // Debug line

  return currentUser ? children : <Navigate to="/" />;
};

export default PrivateRoute;
