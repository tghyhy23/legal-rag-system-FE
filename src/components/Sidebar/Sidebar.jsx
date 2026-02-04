import React from "react";
import { CATEGORIES, WELCOME_MESSAGE_CONTENT } from "../../constants";
import { saveStoredSessions } from "../../services/storageService";
import "./Sidebar.css";

const Sidebar = ({
    activeCategory,
    onSelectCategory,
    isOpen,
    sessions = [],
    currentSessionId,
    onSessionUpdate,
    onSelectSession,
    onDeleteSession,
}) => {
    
    // --- 1. LOGIC TẠO CUỘC TRÒ CHUYỆN MỚI ---
    // Cập nhật: Nhận tham số title để đặt tên cho chat (dùng cho khi click Category)
    const handleCreateNewChat = (customTitle = null) => {
        const newSession = {
            id: Date.now().toString(),
            title: customTitle || "Cuộc trò chuyện mới", // Nếu có title riêng thì dùng, ko thì mặc định
            timestamp: Date.now(),
            messages: [
                {
                    id: "welcome",
                    role: "model",
                    content: WELCOME_MESSAGE_CONTENT,
                    timestamp: new Date(),
                },
            ],
        };

        const updatedSessions = [newSession, ...sessions];
        saveStoredSessions(updatedSessions);

        if (onSessionUpdate) {
            onSessionUpdate(updatedSessions, newSession.id);
        }
    };

    // --- 2. XỬ LÝ KHI CLICK VÀO DANH MỤC (Vấn đề 2) ---
    const handleCategoryClick = (categoryName) => {
        // Bước 1: Gọi hàm chọn danh mục (để App biết đang ở filter nào)
        onSelectCategory(categoryName);
        
        // Bước 2: Tạo ngay một cuộc trò chuyện mới với tên danh mục
        handleCreateNewChat(`Tra cứu: ${categoryName}`);
    };

    // --- 3. XỬ LÝ NÚT BÁO CÁO ---
    const handleContactSupport = () => {
        // Mở trình email mặc định
        const email = "hotro.phapluat@cand.gov.vn"; // Thay bằng email thực tế
        const subject = encodeURIComponent("Báo cáo nội dung cần hiệu chỉnh - Trợ lý Pháp luật");
        const body = encodeURIComponent("Kính gửi bộ phận kỹ thuật,\n\nTôi muốn báo cáo nội dung sau:\n...");
        
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
                    <button onClick={() => handleCreateNewChat()} className="btn-new-chat" aria-label="Start a new chat">
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="btn-text-bold">Cuộc trò chuyện mới</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav scrollbar-thin">
                    {/* History Section */}
                    {sessions.length > 0 && (
                        <div className="nav-group">
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
                                            {session.title}
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

                    {/* Categories Section */}
                    <div className="nav-group">
                        <div className="nav-group-header">
                            <h3 className="nav-heading">Danh mục tra cứu</h3>
                        </div>
                        <ul className="nav-list">
                            {CATEGORIES.map((category) => (
                                <li key={category}>
                                    {/* SỬ DỤNG HÀM handleCategoryClick MỚI TẠI ĐÂY */}
                                    <button 
                                        onClick={() => handleCategoryClick(category)} 
                                        className={`nav-item category-item ${activeCategory === category ? "active" : ""}`}
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Utilities Section */}
                    <div className="nav-group">
                        <div className="nav-group-header">
                            <h3 className="nav-heading">Tiện ích</h3>
                        </div>
                        <ul className="nav-list">
                            {/* Nút Tra cứu văn bản: Click vào cũng nên tạo chat mới */}
                            <li>
                                <button onClick={() => handleCategoryClick("Tra cứu văn bản")} className={`nav-item category-item ${activeCategory === "Tra cứu văn bản" ? "active" : ""}`}>
                                    <svg className="icon-sm mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Tra cứu văn bản</span>
                                </button>
                            </li>
                            {/* Nút Quản lý dữ liệu: Nút này thường là chuyển view khác, không tạo chat, nên giữ nguyên logic cũ */}
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
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    {/* SỬ DỤNG HÀM handleContactSupport MỚI TẠI ĐÂY */}
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