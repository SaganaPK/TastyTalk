import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, Search, PlusSquare, LogOut, Menu,
  Utensils, Camera, Bot
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = ({ setShowModal }) => {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const MenuItems = () => (
    <>
      <Link to="/home" className="nav-link"><Home size={18} /> Home</Link>
      <Link to="/search" className="nav-link"><Search size={18} /> Search</Link>
      <Link to="/tasty-discoveries" className="nav-link"><Utensils size={18} /> Tasty Discoveries</Link>
     
  <button onClick={() => {
  setShowModal(true);
}} className="nav-link">
  <Camera size={20} /> Post TastySnap
</button>


      <Link to="/add-tastynote" className="nav-link"><PlusSquare size={18} /> Add TastyNote</Link>
      <Link to="/suggestrecipe" className="nav-link"><Bot size={18} /> Recipe Genie</Link>
      <Link to="/profile" className="nav-link">
        {currentUser?.username
          ? currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)
          : 'User'}
      </Link>
      <button onClick={handleLogout} className="logout-button"><LogOut size={18} /> Logout</button>
    </>
  );

  return (
    <nav className="navbar">
      {/* 👨‍💻 Desktop Sidebar */}
      <div className="nav-desktop">
        <h2 className="logo">🍽️ TastyTalks</h2>
        <MenuItems />
      </div>

      {/* 📱 Mobile hamburger */}
      <div className="nav-mobile">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={24} />
        </button>
        {menuOpen && (
          <div className="dropdown-menu">
            <MenuItems /> {/* ✅ used here as well */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
