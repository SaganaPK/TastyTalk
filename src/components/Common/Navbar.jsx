import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiSearch, FiLogOut, FiMenu } from 'react-icons/fi';
import './Navbar.css';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dropdownRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/'); // 🔥 after logout, go to login
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">TastyTalks 🍳</h1>
      </div>

      {/* Desktop Center Links */}
      {!isMobile && (
        <div className="navbar-center">
          <Link to="/home" className="nav-link">
            <FiHome /> Home
          </Link>
          <Link to="/profile" className="nav-link">
            <FiUser /> Profile
          </Link>
          <Link to="/search" className="nav-link">
            <FiSearch /> Search
          </Link>
          {currentUser && (
            <button onClick={handleLogout} className="nav-link logout-button">
              <FiLogOut /> Logout
            </button>
          )}
        </div>
      )}

      {/* Mobile Hamburger */}
      <div className="navbar-right">
        <button className="menu-button" onClick={() => setMenuOpen((prev) => !prev)}>
          <FiMenu size={24} />
        </button>

        {menuOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <Link to="/home" className="dropdown-link" onClick={() => setMenuOpen(false)}>
              <FiHome /> Home
            </Link>
            <Link to="/profile" className="dropdown-link" onClick={() => setMenuOpen(false)}>
              <FiUser /> Profile
            </Link>
            <Link to="/search" className="dropdown-link" onClick={() => setMenuOpen(false)}>
              <FiSearch /> Search
            </Link>
            <Link to="/post" className="dropdown-link" onClick={() => setMenuOpen(false)}>
              📸 Post Recipe
            </Link>
            <Link to="/quick" className="dropdown-link" onClick={() => setMenuOpen(false)}>
              📝 Quick Recipe
            </Link>
            <Link to="/viewrecipes" className="dropdown-link" onClick={() => setMenuOpen(false)}>
              📚 View Recipes
            </Link>
            <Link to="/suggestrecipe" className="dropdown-link" onClick={() => setMenuOpen(false)}>
              💡 Suggest Recipe
            </Link>
            {currentUser && (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="dropdown-link logout-link">
                <FiLogOut /> Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
