import React, { useState } from 'react';
import Navbar from '../components/Common/Navbar';
import PostTastySnap from '../pages/PostTastySnap'; // ✅ Updated import
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="main-layout">
      {/* Left Sidebar */}
      <aside className="sidebar-left">
        <Navbar setShowModal={setShowModal} />
      </aside>

      {/* Center Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="sidebar-right">
        <div className="right-widget">
          <h4>👨‍🍳 Chef of the Week</h4>
          <p><strong>@nila_cooks</strong></p>
          <p>✨ 10 tasty recipes shared!</p>
          <hr />
          <p>Try her latest: <em>Coconut Rasam</em></p>
        </div>
      </aside>

      {/* 🔥 Modal included from pages/PostTastySnap.jsx */}
      {showModal && <PostTastySnap onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default MainLayout;
