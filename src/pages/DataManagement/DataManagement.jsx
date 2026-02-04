import React, { useState, useEffect } from "react";
import { 
  addDocumentManually, 
  crawlUrls, 
  crawlSearch, 
  getSystemStats, 
  saveIndex 
} from "../../apiRequest/dataService";
import "./DataManagement.css";

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState("manual"); // manual | crawl | stats
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [stats, setStats] = useState(null);

  // Form states
  const [manualForm, setManualForm] = useState({
    doc_id: "", title: "", content: "", doc_number: "", doc_type: "", issued_date: "", effective_date: "", url: ""
  });
  const [crawlUrlInput, setCrawlUrlInput] = useState("");
  const [crawlKeyword, setCrawlKeyword] = useState("");

  useEffect(() => {
    if (activeTab === "stats") loadStats();
  }, [activeTab]);

  const showNotify = (type, msg) => {
    setNotification({ type, message: msg });
    setTimeout(() => setNotification({ type: "", message: "" }), 5000);
  };

  const loadStats = async () => {
    try {
      const data = await getSystemStats();
      setStats(data);
    } catch (e) {
      showNotify("error", "Không thể tải thống kê hệ thống.");
    }
  };

  // --- HANDLERS ---
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Tự sinh doc_id nếu rỗng
      const payload = { 
        ...manualForm, 
        doc_id: manualForm.doc_id || `doc_${Date.now()}` 
      };
      await addDocumentManually(payload);
      showNotify("success", `Đã thêm văn bản: ${payload.doc_number}`);
      setManualForm({ doc_id: "", title: "", content: "", doc_number: "", doc_type: "", issued_date: "", effective_date: "", url: "" });
    } catch (e) {
      showNotify("error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrawlUrl = async () => {
    if (!crawlUrlInput.trim()) return;
    setLoading(true);
    try {
      const urls = crawlUrlInput.split("\n").filter(u => u.trim());
      const res = await crawlUrls(urls);
      showNotify("success", `Đã crawl thành công ${res.processed_count || 0} link.`);
    } catch (e) {
      showNotify("error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrawlSearch = async () => {
    if (!crawlKeyword.trim()) return;
    setLoading(true);
    try {
      const res = await crawlSearch(crawlKeyword, 1); // Default 1 page
      showNotify("success", `Tìm thấy và crawl thành công ${res.processed_count || 0} văn bản.`);
    } catch (e) {
      showNotify("error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIndex = async () => {
    setLoading(true);
    try {
      await saveIndex();
      showNotify("success", "Đã lưu Index xuống ổ cứng thành công!");
    } catch (e) {
      showNotify("error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dm-container">
      <h2 className="dm-title">Quản trị Cơ sở tri thức</h2>

      {/* Notification */}
      {notification.message && (
        <div className={`dm-notify ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Tabs */}
      <div className="dm-tabs">
        <button className={`dm-tab ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>Thêm thủ công</button>
        <button className={`dm-tab ${activeTab === "crawl" ? "active" : ""}`} onClick={() => setActiveTab("crawl")}>Cào dữ liệu (Crawl)</button>
        <button className={`dm-tab ${activeTab === "stats" ? "active" : ""}`} onClick={() => setActiveTab("stats")}>Hệ thống & Thống kê</button>
      </div>

      <div className="dm-content">
        {loading && <div className="dm-loading-overlay"><div className="spinner"></div>Đang xử lý...</div>}

        {/* TAB 1: MANUAL ADD */}
        {activeTab === "manual" && (
          <form className="dm-form" onSubmit={handleManualSubmit}>
            <div className="form-row">
              <div className="form-group half">
                <label>Số hiệu văn bản</label>
                <input required type="text" placeholder="VD: 100/2015/QH13" value={manualForm.doc_number} onChange={e => setManualForm({...manualForm, doc_number: e.target.value})} />
              </div>
              <div className="form-group half">
                <label>Loại văn bản</label>
                <input required type="text" placeholder="VD: Bộ luật" value={manualForm.doc_type} onChange={e => setManualForm({...manualForm, doc_type: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Tên/Trích yếu văn bản</label>
              <input required type="text" placeholder="Nhập tên đầy đủ của văn bản" value={manualForm.title} onChange={e => setManualForm({...manualForm, title: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group half">
                <label>Ngày ban hành</label>
                <input type="text" placeholder="DD/MM/YYYY" value={manualForm.issued_date} onChange={e => setManualForm({...manualForm, issued_date: e.target.value})} />
              </div>
              <div className="form-group half">
                <label>Ngày hiệu lực</label>
                <input type="text" placeholder="DD/MM/YYYY" value={manualForm.effective_date} onChange={e => setManualForm({...manualForm, effective_date: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Link gốc (nếu có)</label>
              <input type="text" placeholder="https://..." value={manualForm.url} onChange={e => setManualForm({...manualForm, url: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Nội dung toàn văn (Quan trọng)</label>
              <textarea required rows="10" placeholder="Paste nội dung văn bản vào đây để hệ thống học..." value={manualForm.content} onChange={e => setManualForm({...manualForm, content: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn-submit-dm">Thêm vào CSDL</button>
          </form>
        )}

        {/* TAB 2: CRAWL */}
        {activeTab === "crawl" && (
          <div className="crawl-section">
            <div className="crawl-card">
              <h3>Cào theo danh sách Link</h3>
              <p>Nhập danh sách URL từ thuvienphapluat.vn (mỗi link 1 dòng)</p>
              <textarea rows="5" placeholder="https://thuvienphapluat.vn/..." value={crawlUrlInput} onChange={e => setCrawlUrlInput(e.target.value)}></textarea>
              <button className="btn-action" onClick={handleCrawlUrl}>Bắt đầu Crawl URL</button>
            </div>
            
            <div className="crawl-divider">HOẶC</div>

            <div className="crawl-card">
              <h3>Cào theo từ khóa</h3>
              <p>Hệ thống sẽ tự tìm kiếm và cào các kết quả đầu tiên.</p>
              <input type="text" placeholder="VD: Luật Đất đai 2024" value={crawlKeyword} onChange={e => setCrawlKeyword(e.target.value)} />
              <button className="btn-action" onClick={handleCrawlSearch}>Tìm & Crawl</button>
            </div>
          </div>
        )}

        {/* TAB 3: STATS */}
        {activeTab === "stats" && (
          <div className="stats-section">
            <div className="stats-grid">
               <div className="stat-card">
                 <h4>Tổng văn bản</h4>
                 <div className="stat-value">{stats?.total_documents || 0}</div>
               </div>
               <div className="stat-card">
                 <h4>Tổng Chunks (Vector)</h4>
                 <div className="stat-value">{stats?.total_chunks || 0}</div>
               </div>
               <div className="stat-card">
                 <h4>Kích thước Index</h4>
                 <div className="stat-value">{stats?.index_size || 0}</div>
               </div>
            </div>

            <div className="stats-actions">
               <h3>Thao tác hệ thống</h3>
               <p>Hãy lưu Index sau khi thêm dữ liệu mới để tránh mất mát khi khởi động lại server.</p>
               <button className="btn-save-index" onClick={handleSaveIndex}>Lưu dữ liệu xuống ổ cứng (Save Index)</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;