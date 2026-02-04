// src/services/chatService.js

// URL ngrok của bạn (Lưu ý: Ngrok URL thay đổi mỗi lần chạy lại, hãy cập nhật khi cần)
const API_BASE_URL = "https://easter-unprofiteering-tristin.ngrok-free.dev";

/**
 * Gọi API Demo (Gemini thuần, không RAG)
 * Endpoint: /ask-demo
 */
export const sendDemoMessage = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ask-demo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Header này giúp bypass màn hình cảnh báo của Ngrok khi dùng free tier
                "ngrok-skip-browser-warning": "true",
            },
            // Theo Swagger: AskDemoRequest chỉ yêu cầu field "query"
            body: JSON.stringify({
                query: query
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Lỗi server: ${response.status}`);
        }

        const data = await response.json();
        
        // Data format trả về theo AskDemoResponse:
        // {
        //    "query": "...",
        //    "answer": "...",
        //    "mode": "demo",
        //    "disclaimer": "..."
        // }
        return data;

    } catch (error) {
        console.error("Lỗi khi gọi API Demo:", error);
        throw error;
    }
};

/**
 * (Giữ lại hàm cũ nếu bạn vẫn cần dùng song song)
 * Gọi API RAG chuẩn
 * Endpoint: /ask
 */
export const sendMessageToModel = async (query, history = []) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                query: query,
                top_k: 3 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Lỗi server: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Lỗi khi gọi API RAG:", error);
        throw error;
    }
};