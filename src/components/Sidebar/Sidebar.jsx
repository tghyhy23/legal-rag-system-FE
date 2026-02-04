import React from "react";
import { CATEGORIES } from "../../constants";
import "./Sidebar.css";

const Sidebar = ({
    activeCategory,
    onSelectCategory,
    isOpen,
    sessions = [],
    currentSessionId,
    onNewChat,           // Đổi tên prop cho rõ nghĩa: Hàm reset về nháp
    onSelectSession,
    onDeleteSession,
    onStartCategoryDraft,
}) => {
    
    // --- 1. CLICK NEW CHAT (CHUYỂN VỀ CHẾ ĐỘ NHÁP) ---
    const handleNewChatClick = () => {
        // Reset category về rỗng
        onSelectCategory("");
        
        // Gọi hàm reset bên App (Không tạo session ngay)
        if (onNewChat) {
            onNewChat();
        }
    };

    // --- 2. CLICK CATEGORY (CHUYỂN TAB NHÁP - LAZY) ---
    const handleCategoryClick = (categoryName) => {
        onSelectCategory(categoryName);
        if (onStartCategoryDraft) {
            onStartCategoryDraft();
        }
    };

    // --- 3. BÁO CÁO ---
    const handleContactSupport = () => {
        const email = "hotro.phapluat@cand.gov.vn";
        const subject = encodeURIComponent("Báo cáo nội dung cần hiệu chỉnh");
        const body = encodeURIComponent("Kính gửi bộ phận kỹ thuật...");
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <aside className={`sidebar-container ${isOpen ? "open" : ""}`}>
            <div className="sidebar-inner">
                {/* Header */}
                <div className="sidebar-header">
                    <span className="sidebar-brand">Trợ Lý Pháp Luật CAND</span>
                </div>

                {/* New Chat Button */}
                <div className="sidebar-new-chat-wrapper">
                    <button onClick={handleNewChatClick} className="btn-new-chat">
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="btn-text-bold">Cuộc trò chuyện mới</span>
                    </button>
                </div>

                {/* Navigation Area */}
                <nav className="sidebar-nav">
                    {/* Phần Lịch Sử */}
                    {sessions.length > 0 && (
                        <div className="nav-group group-history scrollbar-thin">
                            <div className="nav-group-header">
                                <h3 className="nav-heading">Lịch sử</h3>
                            </div>
                            <ul className="nav-list">
                                {sessions.map((session) => (
                                    <li key={session.id} className="nav-item-wrapper group">
                                        <button 
                                            onClick={() => onSelectSession(session.id)} 
                                            className={`nav-item history-item ${currentSessionId === session.id ? "active" : ""}`} 
                                            title={session.title}
                                        >
                                            <span>{session.title}</span>
                                        </button>
                                        <button onClick={(e) => onDeleteSession(e, session.id)} className="btn-delete-session" title="Xóa">
                                            <svg className="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Phần Đáy (Danh mục & Tiện ích) */}
                    <div className="nav-bottom-wrapper">
                        <div className="nav-group group-bottom">
                            <div className="nav-group-header">
                                <h3 className="nav-heading">Danh mục tra cứu</h3>
                            </div>
                            <ul className="nav-list">
                                {CATEGORIES.map((category) => (
                                    <li key={category}>
                                        <button 
                                            onClick={() => handleCategoryClick(category)} 
                                            className={`nav-item category-item ${activeCategory === category ? "active" : ""}`}
                                            title={category}
                                        >
                                            <span>{category}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="nav-group group-bottom">
                            <div className="nav-group-header">
                                <h3 className="nav-heading">Tiện ích</h3>
                            </div>
                            <ul className="nav-list">
                                <li>
                                    <button onClick={() => handleCategoryClick("Tra cứu văn bản")} className={`nav-item category-item ${activeCategory === "Tra cứu văn bản" ? "active" : ""}`}>
                                        <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>Tra cứu văn bản</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onSelectCategory("Quản lý dữ liệu")} className={`nav-item category-item ${activeCategory === "Quản lý dữ liệu" ? "active" : ""}`}>
                                        <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                        </svg>
                                        <span>Quản lý dữ liệu</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleContactSupport} className="btn-report">
                        Báo nội dung cần hiệu chỉnh
                    </button>
                </div>
            </div>
            {isOpen && <div className="sidebar-overlay-mobile" onClick={() => {}} />}
        </aside>
    );
};

export default Sidebar;