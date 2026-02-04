import React, { useCallback, useState } from "react";
import Login from "./pages/Login/Login";
import Layout from "./components/Layout/Layout";
import DocumentSearch from "./pages/DocumentSearch/DocumentSearch";
import ChatInterface from "./components/ChatInterface/ChatInterface";
import { saveStoredSessions, getStoredSessions } from "./services/storageService";
import DataManagement from "./pages/DataManagement/DataManagement";
import { WELCOME_MESSAGE_CONTENT } from "./constants";

function App() {
    const [user, setUser] = useState(null);
    const [activeCategory, setActiveCategory] = useState("");

    // --- QUẢN LÝ SESSION ---
    const [sessions, setSessions] = useState(() => {
        const saved = getStoredSessions();
        return saved.length > 0 ? saved : [];
    });

    const [currentSessionId, setCurrentSessionId] = useState(null);

    // --- STATE QUẢN LÝ VIỆC RESET CHAT (QUAN TRỌNG) ---
    // Dùng biến này làm key cho ChatInterface. 
    // Chỉ thay đổi biến này khi người dùng chủ động muốn reset khung chat.
    const [chatInstanceId, setChatInstanceId] = useState("init-session");

    // --- QUẢN LÝ TIN NHẮN HIỂN THỊ ---
    const currentMessages = currentSessionId 
        ? sessions.find((s) => s.id === currentSessionId)?.messages || []
        : [{
            id: "welcome",
            role: "model",
            content: WELCOME_MESSAGE_CONTENT,
            timestamp: new Date(),
          }];

    // --- LOGIC HÀNH ĐỘNG ---

    const handleLogin = (username) => {
        setUser({ username: username, unit: "Phòng Pháp chế", role: "admin" });
        setCurrentSessionId(null);
        setChatInstanceId(`login-${Date.now()}`);
    };

    const handleLogout = () => {
        setUser(null);
        setActiveCategory("");
        setCurrentSessionId(null);
    };

    // 1. Logic nút "Cuộc trò chuyện mới" -> RESET VỀ NHÁP
    const handleNewChatReset = () => {
        setCurrentSessionId(null);
        setActiveCategory("");
        // Đổi key để ép React vẽ lại khung chat mới tinh
        setChatInstanceId(`new-chat-${Date.now()}`);
    };

    // 2. Logic click Category -> CHUYỂN VỀ NHÁP CỦA CATEGORY
    const handleStartCategoryDraft = () => {
        setCurrentSessionId(null);
        // Đổi key để reset khung chat
        setChatInstanceId(`category-${Date.now()}`);
    };

    // 3. Logic chọn Session từ lịch sử
    const handleSelectSession = (sessionId) => {
        setCurrentSessionId(sessionId);
        setActiveCategory(""); 
        // Dùng ID session làm key để load nội dung cũ
        setChatInstanceId(`session-${sessionId}`);
    };

    // 4. Logic Xóa Session
    const handleDeleteSession = (e, sessionId) => {
        e.stopPropagation(); 
        const updatedSessions = sessions.filter((s) => s.id !== sessionId);
        setSessions(updatedSessions);
        saveStoredSessions(updatedSessions);

        // Nếu đang xem session bị xóa -> Reset về New Chat
        if (currentSessionId === sessionId) {
            handleNewChatReset();
        }
    };

    // --- LOGIC CẬP NHẬT TIN NHẮN (LAZY CREATION) ---
    const handleMessagesUpdate = useCallback(
        (newMessages) => {
            // CASE A: Đang chat trong một session đã lưu
            if (currentSessionId) {
                setSessions((prevSessions) => {
                    const updatedSessions = prevSessions.map((session) => {
                        if (session.id === currentSessionId) {
                            // Cập nhật title động
                            let updatedTitle = session.title;
                            if ((session.title === "Cuộc trò chuyện mới" || session.title.startsWith("Tra cứu:")) && newMessages.length > 1) {
                                const firstUserMsg = newMessages.find(m => m.role === 'user');
                                if (firstUserMsg) {
                                    updatedTitle = firstUserMsg.content.slice(0, 40) + "...";
                                }
                            }
                            return {
                                ...session,
                                messages: newMessages,
                                title: updatedTitle,
                            };
                        }
                        return session;
                    });
                    saveStoredSessions(updatedSessions);
                    return updatedSessions;
                });
            } 
            // CASE B: Đang ở chế độ NHÁP (Lazy) -> Tạo mới Session
            else {
                // Chỉ tạo khi có tin nhắn thực tế (bỏ qua welcome)
                if (newMessages.length > 1) {
                    const newId = Date.now().toString();
                    
                    let newTitle = "Cuộc trò chuyện mới";
                    const firstUserMsg = newMessages.find(m => m.role === 'user');
                    
                    if (activeCategory) {
                        newTitle = `Tra cứu: ${activeCategory}`;
                    } else if (firstUserMsg) { 
                        newTitle = firstUserMsg.content.slice(0, 40) + "...";
                    }

                    const newSession = {
                        id: newId,
                        title: newTitle,
                        timestamp: Date.now(),
                        messages: newMessages, 
                    };

                    setSessions((prev) => {
                        const updated = [newSession, ...prev];
                        saveStoredSessions(updated);
                        return updated;
                    });
                    
                    // QUAN TRỌNG: 
                    // 1. Cập nhật ID để chuyển trạng thái sang "Đã lưu".
                    // 2. KHÔNG thay đổi chatInstanceId. Việc này giúp ChatInterface KHÔNG bị re-render lại từ đầu.
                    //    -> Bot sẽ tiếp tục trả lời mượt mà.
                    setCurrentSessionId(newId);
                }
            }
        },
        [currentSessionId, activeCategory]
    );

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
                    
                    onNewChat={handleNewChatReset} 
                    onStartCategoryDraft={handleStartCategoryDraft}
                    onSelectSession={handleSelectSession}
                    onDeleteSession={handleDeleteSession}
                >
                    {activeCategory === "Tra cứu văn bản" ? (
                        <DocumentSearch />
                    ) : activeCategory === "Quản lý dữ liệu" ? (
                        <DataManagement />
                    ) : (
                        <ChatInterface
                            // Key cố định trong suốt quá trình chat (kể cả khi chuyển từ Nháp -> Đã lưu)
                            key={chatInstanceId}
                            
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