import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { getDocs, collection, query, where } from "firebase/firestore";
import "./Register.css";

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

   const handleRegister = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  try {
    // 🔍 Check if username exists (case-insensitive)
    const usersRef = collection(db, "talkusers");
    const q = query(usersRef, where("username", "==", username.toLowerCase()));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      alert("🚫 A chef already exists with this name. Please choose a unique name.");
      return;
    }

    // 👤 Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🗃️ Save user to Firestore
    await setDoc(doc(db, "talkusers", user.uid), {
      email: user.email,
      username: username.toLowerCase(),
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    alert("✅ Registered successfully!");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

  } catch (error) {
    console.error("Registration Error:", error.message);
    alert(error.message);
  }
};


    return (
        <div className="register-container">
            <h2>TastyTalks 🍳 Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Create Account</button>
            </form>
            <p>Already have an account? <Link to="/">Login here</Link></p>
        </div>
    );
}

export default Register;
