import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';

import Home from './pages/Home';
import PostTastySnap from './pages/PostTastySnap';
import SuggestRecipe from './pages/suggestrecipe/SuggestRecipe';
import Profile from './pages/Profile';
import AddTastyNote from './pages/AddTastyNote';
import TastyDiscoveries from './pages/TastyDiscoveries';
import Search from './pages/Search';
import RecipeDetail from './pages/RecipeDetail';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './PrivateRoute';
import RecipeCard from './components/Feed/RecipeCard';
import QuickBites from './pages/suggestrecipe/QuickBites';
import CalorieSmart from './pages/suggestrecipe/CalorieSmart';
import KidsFavorites from './pages/suggestrecipe/KidsFavorites';
import SweetTooth from './pages/suggestrecipe/SweetTooth';
import RecipeSuggester from './pages/suggestrecipe/RecipeSuggester';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes wrapped in PrivateRoute + MainLayout */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/post-tastysnap"
          element={
            <PrivateRoute>
              <MainLayout>
                <PostTastySnap />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/add-tastynote"
          element={
            <PrivateRoute>
              <MainLayout>
                <AddTastyNote />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/suggestrecipe"
          element={
            <PrivateRoute>
              <MainLayout>
                <SuggestRecipe />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/tasty-discoveries"
          element={
            <PrivateRoute>
              <MainLayout>
                <TastyDiscoveries />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/search"
          element={
            <PrivateRoute>
              <MainLayout>
                <Search />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/:uid"
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <RecipeDetail />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route path="/recipe/:id" element={<RecipeCard />} />
        <Route
          path="/suggest/quickbites"
          element={
            <PrivateRoute>
              <MainLayout>
                <QuickBites />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/suggest/calories"
          element={
            <PrivateRoute>
              <MainLayout>
                <CalorieSmart />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/suggest/kids"
          element={
            <PrivateRoute>
              <MainLayout>
                <KidsFavorites />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/suggest/sweet"
          element={
            <PrivateRoute>
              <MainLayout>
                <SweetTooth />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/suggest/available"
          element={
            <PrivateRoute>
              <MainLayout>
                <RecipeSuggester />
              </MainLayout>
            </PrivateRoute>
          }
        />


      </Routes>
    </Router>
  );
}

export default App;
