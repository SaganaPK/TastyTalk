import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setErrorMsg(""); // clear any previous error
      setEmail("");
      setPassword("");
      navigate("/home"); // success
    } catch (error) {
      console.error("Login Error:", error.message);
      setErrorMsg("Incorrect email or password"); // custom simple message
    }
  };
  

  return (
    <div className="login-container">
      <h2>TastyTalks 🍲 Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      {errorMsg && <p className="error-text">{errorMsg}</p>}
      <p><Link to="/forgot-password">Forgot Password?</Link></p>
      <p>New user? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default Login;
