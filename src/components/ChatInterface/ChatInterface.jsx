import React, { useState, useRef, useEffect } from "react";
import { QUICK_ACTIONS, DISCLAIMER_TEXT } from "../../constants";
// Lưu ý: Đảm bảo đường dẫn import đúng với nơi bạn lưu file service
import { sendDemoMessage } from "../../apiRequest/chatService"; 
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
    
    // Ref cho input
    const inputRef = useRef(null); 
    const messagesEndRef = useRef(null);
    const isFirstRender = useRef(true);

    // Effect 1: Auto scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Effect 2: Sync state ra ngoài (nếu cần)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (onMessagesUpdate) {
            onMessagesUpdate(messages);
        }
    }, [messages, onMessagesUpdate]);

    // --- Helper Functions ---
    const getAvatarLabel = (role) => {
        if (role === "model") return "TL";
        return username && username.length > 0 ? username.charAt(0).toUpperCase() : "CB";
    };

    const getUserDisplayName = (role) => {
        return role === "model" ? "Trợ lý Pháp luật" : (username || "Cán bộ");
    };

    // --- XỬ LÝ GỬI TIN NHẮN ---
    const handleSendMessage = async (text = input) => {
        const queryText = text.trim();
        if (!queryText || isLoading) return;

        // 1. Tạo tin nhắn User
        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            content: queryText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput(""); // Xóa input ngay lập tức
        setIsLoading(true);

        try {
            // 2. Gọi API Demo (/ask-demo)
            const data = await sendDemoMessage(queryText);

            // 3. Format nội dung trả về
            // Demo API trả về: { answer, disclaimer, mode }
            let formattedContent = data.answer;

            // Nếu có disclaimer riêng từ API, ta nối thêm vào (hoặc xử lý hiển thị riêng tuỳ ý)
            if (data.disclaimer) {
                formattedContent += `\n\n_Lưu ý: ${data.disclaimer}_`;
            }

            // Nếu sau này bạn dùng lại RAG có sources, giữ logic này (optional)
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
                    content: `⚠️ Hệ thống gặp sự cố: ${error.message}. Vui lòng thử lại sau.`,
                    timestamp: new Date(),
                    isError: true,
                },
            ]);
        } finally {
            setIsLoading(false);
            // Focus lại vào input sau khi hoàn tất để gõ tiếp
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Xử lý khi chọn Quick Action (Gợi ý câu hỏi)
    const handleQuickActionClick = (actionText) => {
        setInput(actionText);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Render nội dung (Hỗ trợ Bold và Link cơ bản)
    const renderContent = (text) => {
        if (!text) return null;
        return text.split("\n").map((line, index) => (
            <div key={index} style={{ minHeight: "1.2em", marginBottom: "4px" }}>
                {line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\)|_.*?_)/g).map((part, i) => {
                    // Xử lý in đậm **text**
                    if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    // Xử lý in nghiêng _text_
                    if (part.startsWith("_") && part.endsWith("_")) {
                        return <em key={i} className="text-gray-500">{part.slice(1, -1)}</em>;
                    }
                    // Xử lý link [Title](url)
                    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
                        const titleEnd = part.indexOf("]");
                        const urlStart = part.indexOf("](") + 2;
                        const title = part.substring(1, titleEnd);
                        const url = part.substring(urlStart, part.length - 1);
                        return (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="link-ref">
                                {title}
                            </a>
                        );
                    }
                    return <span key={i}>{part}</span>;
                })}
            </div>
        ));
    };

    return (
        <div className="chat-interface">
            {/* Banner Cảnh báo */}
            <div className="warning-banner">
                <p className="warning-content">
                    <span className="warning-icon">⚠️</span>
                    {DISCLAIMER_TEXT}
                </p>
            </div>

            {/* Khu vực Chat */}
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

            {/* Khu vực Input */}
            <div className="input-area">
                {/* Quick Actions - Chỉ hiện khi ít tin nhắn và input rỗng */}
                {messages.length < 3 && !input && (
                    <div className="quick-actions">
                        {QUICK_ACTIONS.map((action) => (
                            <button 
                                key={action} 
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
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập câu hỏi pháp luật (không nhập thông tin mật/OTP)..."
                        className="chat-input"
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    <button 
                        onClick={() => handleSendMessage()} 
                        disabled={!input.trim() || isLoading} 
                        className="btn-send"
                        title="Gửi câu hỏi"
                    >
                        {/* Icon Send mũi tên */}
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                
                <p className="footer-note">
                    Hệ thống đang chạy chế độ Demo (Gemini AI). Thông tin mang tính tham khảo.
                </p>
            </div>
        </div>
    );
};

export default ChatInterface;