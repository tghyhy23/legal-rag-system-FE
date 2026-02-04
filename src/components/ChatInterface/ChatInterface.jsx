// src/components/ChatInterface/ChatInterface.jsx
import React, { useState, useRef, useEffect } from "react";
import { QUICK_ACTIONS, DISCLAIMER_TEXT } from "../../constants";
import { sendDemoMessage } from "../../apiRequest/chatService"; // Đảm bảo đường dẫn đúng
import "./ChatInterface.css";

const ChatInterface = ({ category, initialMessages = [], onMessagesUpdate, username }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);
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
    }, [messages, onMessagesUpdate]);

    // Helper Functions
    const getAvatarLabel = (role) => {
        if (role === "model") return "TL";
        return username && username.length > 0 ? username.charAt(0).toUpperCase() : "CB";
    };

    const getUserDisplayName = (role) => {
        return role === "model" ? "Trợ lý Pháp luật" : username || "Cán bộ";
    };

    // --- XỬ LÝ GỬI TIN NHẮN ---
    const handleSendMessage = async (text = input) => {
        const queryText = text.trim();
        if (!queryText || isLoading) return;

        // 1. Tạo tin nhắn User và hiển thị ngay
        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            content: queryText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput(""); 
        setIsLoading(true);

        try {
            // --- KIỂM TRA ĐỘ DÀI QUERY ---
            if (queryText.length < 10) {
                // Giả lập độ trễ 1 chút cho tự nhiên (0.5s)
                await new Promise(resolve => setTimeout(resolve, 500));

                const hardcodedResponse = "Xin chào, tôi là Trợ lý Pháp luật CAND. Vui lòng nhập câu hỏi cụ thể để tôi có thể hỗ trợ tra cứu chính xác.";
                
                const botMsg = {
                    id: (Date.now() + 1).toString(),
                    role: "model",
                    content: hardcodedResponse,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botMsg]);
            } else {
                // --- GỌI API NẾU ĐỦ DÀI ---
                
                // 2. Gọi API Demo (/ask-demo)
                const data = await sendDemoMessage(queryText);

                // 3. Format nội dung trả về
                let formattedContent = data.answer;

                if (data.sources && data.sources.length > 0) {
                    formattedContent += "\n\n**Nguồn tham khảo:**\n";
                    const uniqueSources = data.sources.filter((v, i, a) => a.findIndex((t) => t.doc_number === v.doc_number) === i);
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
                setMessages((prev) => [...prev, botMsg]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [
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
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickActionClick = (actionText) => {
        setInput(actionText);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const renderContent = (text) => {
        if (!text) return null;
        return text.split("\n").map((line, index) => (
            <div key={index} style={{ minHeight: "1.2em", marginBottom: "4px" }}>
                {line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\)|_.*?_)/g).map((part, i) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith("_") && part.endsWith("_")) {
                        return <em key={i} className="text-gray-500">{part.slice(1, -1)}</em>;
                    }
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
            <div className="warning-banner">
                <p className="warning-content">
                    <span className="warning-icon">⚠️</span>
                    {DISCLAIMER_TEXT}
                </p>
            </div>

            <div className="chat-area">
                {category && (
                    <div className="chat-category-divider">
                        <span className="category-label">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: "6px" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <p>Đang xem: <strong> {category} </strong></p>
                        </span>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.role === "user" ? "msg-user" : "msg-bot"}`}>
                        <div className={`message-bubble ${msg.role === "user" ? "bubble-user" : "bubble-bot"} ${msg.isError ? "bubble-error" : ""}`}>
                            <div className="msg-header">
                                <div className={`avatar ${msg.role === "user" ? "avatar-user" : "avatar-bot"}`}>{getAvatarLabel(msg.role)}</div>
                                <span className="msg-role-name">{getUserDisplayName(msg.role)}</span>
                                <span className="msg-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                            <div className="msg-content">{msg.role === "model" ? renderContent(msg.content) : msg.content}</div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="loading-indicator">
                        <div className="dots"><div></div><div></div><div></div></div>
                        <span>Đang xử lý...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                {messages.length < 3 && !input && (
                    <div className="quick-actions">
                        {QUICK_ACTIONS.map((action) => (
                            <button key={action} onClick={() => handleQuickActionClick(action)} className="btn-quick-action">
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                <div className="input-wrapper">
                    <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Nhập câu hỏi pháp luật (không nhập thông tin mật/OTP)..." className="chat-input" disabled={isLoading} autoComplete="off" />
                    <button onClick={() => handleSendMessage()} disabled={!input.trim() || isLoading} className="btn-send" title="Gửi câu hỏi">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;