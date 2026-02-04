// src/services/storageService.js

const STORAGE_KEY = 'cand_chat_history_v1';

export const getStoredSessions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Chuyển đổi chuỗi thời gian thành đối tượng Date
    return parsed.map(session => ({
      ...session,
      messages: session.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveStoredSessions = (sessions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error("Failed to save history", e);
  }
};