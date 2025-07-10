import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Utensils,
  Camera,
  PlusSquare,
  Bot,
  User
} from 'lucide-react';
import './MobileBottomNav.css';

const MobileBottomNav = ({ setShowModal }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/home" className={isActive('/home') ? 'active' : ''}>
        <Home size={22} />
      </Link>
      <Link to="/search" className={isActive('/search') ? 'active' : ''}>
        <Search size={22} />
      </Link>
      <Link to="/tasty-discoveries" className={isActive('/tasty-discoveries') ? 'active' : ''}>
        <Utensils size={22} />
      </Link>
      <button className={isActive('/post-tastysnap') ? 'active' : ''} onClick={() => setShowModal(true)}>
        <Camera size={22} />
      </button>
      <Link to="/add-tastynote" className={isActive('/add-tastynote') ? 'active' : ''}>
        <PlusSquare size={22} />
      </Link>
      <Link to="/suggestrecipe" className={isActive('/suggestrecipe') ? 'active' : ''}>
        <Bot size={22} />
      </Link>
      <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
        <User size={22} />
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
