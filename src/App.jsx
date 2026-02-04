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
    // 1. Load lịch sử từ LocalStorage khi khởi động
    const [sessions, setSessions] = useState(() => {
        const saved = getStoredSessions();
        return saved.length > 0 ? saved : [];
    });

    // 2. ID của cuộc trò chuyện đang mở
    const [currentSessionId, setCurrentSessionId] = useState(null);

    // 3. Lấy tin nhắn của session hiện tại để truyền vào ChatInterface
    const currentMessages = sessions.find((s) => s.id === currentSessionId)?.messages || [];

    // --- LOGIC HÀNH ĐỘNG ---

    const handleLogin = (username) => {
        setUser({ username: username, unit: "Phòng Pháp chế", role: "admin" });

        // Nếu có lịch sử, mở cuộc trò chuyện gần nhất
        // Lưu ý: Nếu sessions rỗng, User sẽ bấm nút "+" ở Sidebar để tạo mới (logic nằm ở Sidebar)
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
     * HÀM MỚI: Nhận danh sách session đã được cập nhật từ Sidebar (sau khi Sidebar tạo mới)
     * @param {Array} updatedSessions - Danh sách session mới
     * @param {string} newSessionId - ID của session vừa tạo
     */
    const handleSessionUpdate = (updatedSessions, newSessionId) => {
        setSessions(updatedSessions);
        if (newSessionId) {
            setCurrentSessionId(newSessionId);
        }
        setActiveCategory(""); // Quay về màn hình chat
    };

    // LOGIC CẬP NHẬT TIN NHẮN (Khi chat - Vẫn giữ ở App vì ChatInterface gọi lên)
    const handleMessagesUpdate = useCallback(
        (newMessages) => {
            setSessions((prevSessions) => {
                const updatedSessions = prevSessions.map((session) => {
                    if (session.id === currentSessionId) {
                        return {
                            ...session,
                            messages: newMessages,
                            title: newMessages.length > 1 && session.title === "Cuộc trò chuyện mới" ? newMessages[1].content.slice(0, 30) + "..." : session.title,
                        };
                    }
                    return session;
                });

                // Side effect: Lưu storage (tốt nhất nên dùng useEffect riêng, nhưng để đây tạm cũng được)
                saveStoredSessions(updatedSessions);

                return updatedSessions;
            });
        },
        [currentSessionId],
    );

    // LOGIC CHUYỂN ĐỔI GIỮA CÁC CUỘC TRÒ CHUYỆN
    const handleSelectSession = (sessionId) => {
        setCurrentSessionId(sessionId);
        setActiveCategory(""); // Quay về màn hình chat
    };

    // LOGIC XÓA CUỘC TRÒ CHUYỆN
    const handleDeleteSession = (e, sessionId) => {
        e.stopPropagation(); // Ngăn click nhầm vào chọn session
        const updatedSessions = sessions.filter((s) => s.id !== sessionId);
        setSessions(updatedSessions);
        saveStoredSessions(updatedSessions);

        // Nếu xóa session đang mở, chuyển về session đầu tiên hoặc null
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
                    // State quản lý session
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    // Thay vì truyền onNewChat, ta truyền callback cập nhật state
                    onSessionUpdate={handleSessionUpdate}
                    onSelectSession={handleSelectSession}
                    onDeleteSession={handleDeleteSession}
                >
                    {activeCategory === "Tra cứu văn bản" ? (
                        <DocumentSearch />
                    ) : activeCategory === "Quản lý dữ liệu" ? (
                        <DataManagement />
                    ) : (
                        <ChatInterface
                            // Quan trọng: Thêm key để React reset component khi đổi session
                            key={currentSessionId}
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
