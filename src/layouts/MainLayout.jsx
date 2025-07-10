import React, { useState } from 'react';
import Navbar from '../components/Common/Navbar';
import PostTastySnap from '../pages/PostTastySnap'; 
import SidebarRecipes from './SidebarRecipes';
import MobileBottomNav from '../components/Common/MobileBottomNav';

import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  return (
    <>
    <div className="main-layout">
      {/* 🧭 Left Sidebar for Desktop */}
      <aside className="sidebar-left">
        <div className="sidebar-scroll">
    <Navbar setShowModal={setShowModal} />
  </div>
      </aside>

      {/* ✨ Mobile toggle for right sidebar */}
      <button
        className="options-toggle"
        onClick={() => setShowRightSidebar(!showRightSidebar)}
      >
        ☰ 
      </button>

      {/* 📦 Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* ⭐ Right Sidebar (Desktop) */}
      <aside className="sidebar-right">
        <SidebarRecipes />
      </aside>

      {/* 📱 Mobile Sidebar Overlay */}
      {showRightSidebar && (
        <div className="mobile-sidebar">
          <button
            className="close-sidebar"
            onClick={() => setShowRightSidebar(false)}
          >
            ×
          </button>
          <SidebarRecipes />
        </div>
      )}

      {/* 📸 Modal (Post TastySnap) */}
      {showModal && <PostTastySnap onClose={() => setShowModal(false)} />}
    </div>
    {/* ✅ Add mobile bottom nav OUTSIDE layout */}
<MobileBottomNav setShowModal={setShowModal} />
    </>
  );
};

export default MainLayout;
