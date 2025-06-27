import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
      setEmail("");
      
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="forgot-container">
      <h2>Reset Your Password 🔑</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {message && (
        <div>
          <p className="message-text">{message}</p>
          <Link to="/">
            <button style={{ marginTop: "10px", padding: "8px 20px", borderRadius: "5px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
              Go to Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
