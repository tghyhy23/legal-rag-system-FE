// src/services/dataService.js
const API_BASE_URL = "https://easter-unprofiteering-tristin.ngrok-free.dev"; // URL ngrok của bạn

const getHeaders = () => ({
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
});

// 1. Thêm văn bản thủ công
export const addDocumentManually = async (docData) => {
  const response = await fetch(`${API_BASE_URL}/documents/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(docData),
  });
  if (!response.ok) throw new Error("Lỗi khi thêm văn bản");
  return await response.json();
};

// 2. Crawl theo danh sách URL
export const crawlUrls = async (urls) => {
  const response = await fetch(`${API_BASE_URL}/crawl/urls`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ urls }),
  });
  if (!response.ok) throw new Error("Lỗi khi crawl URLs");
  return await response.json();
};

// 3. Crawl theo từ khóa search
export const crawlSearch = async (keyword, maxPages = 1) => {
  const response = await fetch(`${API_BASE_URL}/crawl/search`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ keyword, max_pages: maxPages }),
  });
  if (!response.ok) throw new Error("Lỗi khi crawl search");
  return await response.json();
};

// 4. Lấy thống kê hệ thống
export const getSystemStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Lỗi lấy thống kê");
  return await response.json();
};

// 5. Lưu Index xuống đĩa
export const saveIndex = async () => {
  const response = await fetch(`${API_BASE_URL}/index/save`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Lỗi lưu index");
  return await response.json();
};