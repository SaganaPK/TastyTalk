import React, { useState , useEffect} from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // import this
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const { currentUser } = useAuth(); // get user
    const navigate = useNavigate();
  
    useEffect(() => {
      if (currentUser) {
        navigate("/home");
      }
    }, [currentUser, navigate]); // whenever currentUser changes, auto navigate
  
    const handleLogin = async (e) => {
      e.preventDefault();
    
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setErrorMsg(""); 
        setEmail("");
        setPassword("");
        // 🔥 no navigate here! navigate happens automatically from useEffect
      } catch (error) {
        console.error("Login Error:", error.message);
        setErrorMsg("Incorrect email or password");
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
