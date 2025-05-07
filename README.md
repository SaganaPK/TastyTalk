# TastyTalks 🍳 – Cooking Social Media App

A full-stack social platform to post and discover recipes with login, image upload, likes, and comments.

## 🔐 Login Navigation Fix
Instead of navigating immediately after login, we wait for `currentUser` to be set via AuthContext.  
A `useEffect` listens for the user and triggers `navigate("/home")` only when login is confirmed.

✅ This avoids double login or page not loading after logout.

## 📁 Project Structure Highlights
- React + Firebase
- Firebase Auth for secure login/register
- Firestore to store users, recipes, likes, and comments
- Firebase Storage for image uploads
