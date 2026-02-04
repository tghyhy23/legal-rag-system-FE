// src/App.jsx
import React, { useCallback, useState } from "react";
import Login from "./pages/Login/Login";
import Layout from "./components/Layout/Layout";
import DocumentSearch from "./pages/DocumentSearch/DocumentSearch";
import ChatInterface from "./components/ChatInterface/ChatInterface";
import { saveStoredSessions, getStoredSessions } from "./services/storageService";
import DataManagement from "./pages/DataManagement/DataManagement";

function App() {
    const [user, setUser] = useState(null);
    const [activeCategory, setActiveCategory] = useState("");

    // --- QUẢN LÝ SESSION ---
    const [sessions, setSessions] = useState(() => {
        const saved = getStoredSessions();
        return saved.length > 0 ? saved : [];
    });

    const [currentSessionId, setCurrentSessionId] = useState(null);

    const currentMessages = sessions.find((s) => s.id === currentSessionId)?.messages || [];

    // --- LOGIC HÀNH ĐỘNG ---

    const handleLogin = (username) => {
        setUser({ username: username, unit: "Phòng Pháp chế", role: "admin" });
        if (sessions.length > 0) {
            setCurrentSessionId(sessions[0].id);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setActiveCategory("");
        setCurrentSessionId(null);
    };

    /**
     * HÀM MỚI: Nhận danh sách session đã được cập nhật từ Sidebar
     */
    const handleSessionUpdate = (updatedSessions, newSessionId) => {
        setSessions(updatedSessions);
        if (newSessionId) {
            setCurrentSessionId(newSessionId);
        }
        
        // --- SỬA LỖI TẠI ĐÂY ---
        // Không được reset activeCategory về "" ngay lập tức.
        // Vì nếu user click chọn danh mục từ Sidebar, activeCategory cần được giữ nguyên 
        // để truyền vào ChatInterface hiển thị header.
        
        // setActiveCategory(""); // <--- ĐÃ XÓA DÒNG NÀY
    };

    // LOGIC CẬP NHẬT TIN NHẮN
    const handleMessagesUpdate = useCallback(
        (newMessages) => {
            setSessions((prevSessions) => {
                const updatedSessions = prevSessions.map((session) => {
                    if (session.id === currentSessionId) {
                        return {
                            ...session,
                            messages: newMessages,
                            title: newMessages.length > 1 && session.title === "Cuộc trò chuyện mới" 
                                ? newMessages[1].content.slice(0, 30) + "..." 
                                : session.title,
                        };
                    }
                    return session;
                });
                saveStoredSessions(updatedSessions);
                return updatedSessions;
            });
        },
        [currentSessionId],
    );

    // LOGIC CHUYỂN ĐỔI GIỮA CÁC CUỘC TRÒ CHUYỆN
    const handleSelectSession = (sessionId) => {
        setCurrentSessionId(sessionId);
        // Khi chọn lịch sử cũ, ta nên reset category để về giao diện chat thường
        setActiveCategory(""); 
    };

    // LOGIC XÓA CUỘC TRÒ CHUYỆN
    const handleDeleteSession = (e, sessionId) => {
        e.stopPropagation(); 
        const updatedSessions = sessions.filter((s) => s.id !== sessionId);
        setSessions(updatedSessions);
        saveStoredSessions(updatedSessions);

        if (currentSessionId === sessionId) {
            if (updatedSessions.length > 0) {
                setCurrentSessionId(updatedSessions[0].id);
            } else {
                setCurrentSessionId(null);
            }
        }
    };

    return (
        <>
            {!user ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Layout
                    user={user}
                    onLogout={handleLogout}
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    onSessionUpdate={handleSessionUpdate}
                    onSelectSession={handleSelectSession}
                    onDeleteSession={handleDeleteSession}
                >
                    {/* Logic render màn hình chính */}
                    {activeCategory === "Tra cứu văn bản" ? (
                        <DocumentSearch />
                    ) : activeCategory === "Quản lý dữ liệu" ? (
                        <DataManagement />
                    ) : (
                        <ChatInterface
                            // Key quan trọng để React reset component khi đổi session/category
                            key={currentSessionId} 
                            // Truyền activeCategory vào đây để ChatInterface hiển thị Line
                            category={activeCategory} 
                            initialMessages={currentMessages}
                            onMessagesUpdate={handleMessagesUpdate}
                            username={user?.username} 
                        />
                    )}
                </Layout>
            )}
        </>
    );
}

export default App;