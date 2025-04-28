import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Home from './components/Home';
import PostRecipe from './components/PostRecipe';
import SuggestRecipe from './components/SuggestRecipe';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import QuickRecipe from './components/QuickRecipe'; 
import ViewRecipes from './components/ViewRecipes';
import Search from './components/Search';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<Layout />}>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/post"
            element={
              <PrivateRoute>
                <PostRecipe />
              </PrivateRoute>
            }
          />
          <Route
            path="/suggestrecipe"
            element={
              <PrivateRoute>
                <SuggestRecipe />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        <Route
            path="/profile/:uid"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

        <Route 
        path="/quick" 
        element={
          <PrivateRoute>
            <QuickRecipe />
          </PrivateRoute>
        } 
        />

        <Route 
        path="/search" 
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        } 
        />
        <Route 
        path="/viewrecipes" 
        element={
          <PrivateRoute>
            <ViewRecipes />
          </PrivateRoute>
        } 
        />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
