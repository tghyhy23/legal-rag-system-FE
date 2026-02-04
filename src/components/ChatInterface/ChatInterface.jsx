// src/components/ChatInterface/ChatInterface.jsx
import React, { useState, useRef, useEffect } from "react";
import { QUICK_ACTIONS, DISCLAIMER_TEXT } from "../../constants";
// Import service
import { sendMessageToModel } from "../../apiRequest/chatService"; 
import "./ChatInterface.css";

const ChatInterface = ({ 
    category, 
    initialMessages = [], 
    onMessagesUpdate, 
    username 
}) => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // Ref cho textarea để focus khi chọn quick action
    const textareaRef = useRef(null); 
    const messagesEndRef = useRef(null);
    const isFirstRender = useRef(true);

    // Effect 1: Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Effect 2: Sync state
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (onMessagesUpdate) {
            onMessagesUpdate(messages);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    // Helper functions (Avatar, Name)
    const getAvatarLabel = (role) => {
        if (role === "model") return "TL";
        if (username && username.length > 0) return username.charAt(0).toUpperCase();
        return "CB";
    };

    const getUserDisplayName = (role) => {
        if (role === "model") return "Trợ lý Pháp luật";
        return username || "Cán bộ";
    };

    // --- LOGIC GỬI TIN NHẮN ---
    const handleSendMessage = async (text = input) => {
        if (!text.trim() || isLoading) return;

        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const data = await sendMessageToModel(text);

            let formattedContent = data.answer;
            if (data.sources && data.sources.length > 0) {
                formattedContent += "\n\n**Nguồn tham khảo:**\n";
                const uniqueSources = data.sources.filter(
                    (v, i, a) => a.findIndex((t) => t.doc_number === v.doc_number) === i
                );

                uniqueSources.forEach((source, index) => {
                    formattedContent += `${index + 1}. **${source.doc_number}** - [${source.title}](${source.url})\n`;
                });
            }

            const botMsg = {
                id: (Date.now() + 1).toString(),
                role: "model",
                content: formattedContent,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 2).toString(),
                    role: "model",
                    content: `⚠️ Hệ thống gặp sự cố: ${error.message || "Không thể kết nối server"}. Vui lòng thử lại sau.`,
                    timestamp: new Date(),
                    isError: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // --- LOGIC MỚI: Xử lý khi click Quick Action ---
    const handleQuickActionClick = (actionText) => {
        setInput(actionText); // 1. Điền text vào input
        // 2. Focus vào textarea để người dùng sửa luôn
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const renderContent = (text) => {
        if (!text) return null;
        return text.split("\n").map((line, index) => (
            <React.Fragment key={index}>
                {line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g).map((part, i) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
                        const titleStart = 1;
                        const titleEnd = part.indexOf("]");
                        const urlStart = part.indexOf("](") + 2;
                        const urlEnd = part.length - 1;
                        const title = part.substring(titleStart, titleEnd);
                        const url = part.substring(urlStart, urlEnd);
                        return (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" title={url}>
                                {title}
                            </a>
                        );
                    }
                    return <span key={i}>{part}</span>;
                })}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div className="chat-interface">
            <div className="warning-banner">
                <p className="warning-content">
                    <span className="warning-icon">⚠️</span>
                    {DISCLAIMER_TEXT}
                </p>
            </div>

            <div className="chat-area">
                {category && (
                    <div className="category-badge-wrapper">
                        <span className="category-badge">Chuyên mục: {category}</span>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.role === "user" ? "msg-user" : "msg-bot"}`}>
                        <div className={`message-bubble ${msg.role === "user" ? "bubble-user" : "bubble-bot"} ${msg.isError ? "bubble-error" : ""}`}>
                            <div className="msg-header">
                                <div className={`avatar ${msg.role === "user" ? "avatar-user" : "avatar-bot"}`}>
                                    {getAvatarLabel(msg.role)}
                                </div>
                                <span className="msg-role-name">
                                    {getUserDisplayName(msg.role)}
                                </span>
                                <span className="msg-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                            <div className="msg-content">
                                {msg.role === "model" ? renderContent(msg.content) : msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="loading-indicator">
                        <div className="dots"><div></div><div></div><div></div></div>
                        <span>Đang tra cứu dữ liệu...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                {/* Quick Actions */}
                {messages.length < 3 && !input && (
                    <div className="quick-actions">
                        {QUICK_ACTIONS.map((action) => (
                            <button 
                                key={action} 
                                // THAY ĐỔI Ở ĐÂY: Gọi handleQuickActionClick thay vì handleSendMessage
                                onClick={() => handleQuickActionClick(action)} 
                                className="btn-quick-action"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                <div className="input-wrapper">
                    <input
                        ref={textareaRef} // Gán ref để focus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập câu hỏi pháp luật (không nhập thông tin mật/OTP/vụ việc nhạy cảm)..."
                        className="chat-input"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={() => handleSendMessage()} 
                        disabled={!input.trim() || isLoading} 
                        className="btn-send"
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
                <p className="footer-note">Hệ thống lưu vết truy cập theo quy định an ninh nội bộ.</p>
            </div>
        </div>
    );
};

export default ChatInterface;