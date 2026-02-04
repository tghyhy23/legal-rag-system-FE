import React, { useState } from 'react';

import { APP_HEADER } from '../../constants';
import './Layout.css';
import Sidebar from '../Sidebar/Sidebar';
import logo from "../../assets/images/logo-cong-an.png";

const Layout = ({ 
  user, 
  onLogout, 
  children, 
  activeCategory, 
  onSelectCategory,
  sessions,
  currentSessionId,
  onSessionUpdate,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onStartCategoryDraft // <--- 1. NHẬN PROP TỪ APP
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar Component */}
      <Sidebar 
        activeCategory={activeCategory} 
        onSelectCategory={onSelectCategory} 
        isOpen={isSidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        sessions={sessions}
        onSessionUpdate={onSessionUpdate}
        currentSessionId={currentSessionId}
        onNewChat={onNewChat}
        onSelectSession={onSelectSession}
        onDeleteSession={onDeleteSession}
        onStartCategoryDraft={onStartCategoryDraft} // <--- 2. TRUYỀN TIẾP CHO SIDEBAR
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        
        {/* Top Header */}
        <header className="app-header">
          <div className="header-left">
            <button 
              className="menu-toggle-btn"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            
            <div className="header-brand">
              <div className="header-logo">
                <img src={logo} alt="Logo CAND" className="header-logo-image" />
              </div>
              <h1 className="header-title desktop-title">{APP_HEADER}</h1>
              <h1 className="header-title mobile-title">HỎI ĐÁP CAND</h1>
            </div>
          </div>

          <div className="header-right">
            <div className="user-info">
              <p className="user-name">{user?.username}</p>
              <p className="user-unit">{user?.unit}</p>
            </div>
            <button onClick={onLogout} className="btn-logout">
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="content-body">
           {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;