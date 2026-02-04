// src/DocumentSearch.jsx
import React, { useState, useMemo } from 'react';
import { MOCK_DOCUMENTS } from '../../services/mockLegalData';

import './DocumentSearch.css';
import FullTextView from '../FullTextVỉew/FullTextView';

const ITEMS_PER_PAGE = 5;

const DocumentSearch = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  // Logic lọc dữ liệu
  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter(doc => {
      // 1. Lọc theo trạng thái
      if (statusFilter !== 'all' && doc.status !== statusFilter) {
        return false;
      }

      const term = searchTerm.toLowerCase();
      if (!term) return true;

      // 2. Lọc theo từ khóa
      switch (searchField) {
        case 'number': return doc.number.toLowerCase().includes(term);
        case 'name': return doc.name.toLowerCase().includes(term);
        case 'date': return doc.issueDate.includes(term);
        case 'all':
        default:
          return (
            doc.number.toLowerCase().includes(term) ||
            doc.name.toLowerCase().includes(term) ||
            doc.issueDate.includes(term)
          );
      }
    });
  }, [searchTerm, searchField, statusFilter]);

  // Logic phân trang
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDocuments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDocuments, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleViewFullText = (e, doc) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (để không kích hoạt toggleExpand)
    setViewingDoc(doc);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Còn hiệu lực': return 'status-valid';
      case 'Hết hiệu lực': return 'status-invalid';
      case 'Sắp có hiệu lực': return 'status-upcoming';
      case 'Một phần hiệu lực': return 'status-partial';
      default: return 'status-default';
    }
  };

  // Nếu đang xem chi tiết, hiển thị FullTextView
  if (viewingDoc) {
    return <FullTextView document={viewingDoc} onClose={() => setViewingDoc(null)} />;
  }

  return (
    <div className="doc-search-container">
      {/* Header Area */}
      <div className="search-header">
        <h2 className="search-title">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Tra cứu văn bản pháp luật
        </h2>
        
        <div className="search-controls">
          <div className="search-input-wrapper">
             <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                setExpandedId(null);
              }}
              className="search-input"
             />
          </div>
          
          <div className="search-filters">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="search-select"
            >
              <option value="all">Tất cả thông tin</option>
              <option value="number">Số hiệu</option>
              <option value="name">Tên văn bản</option>
              <option value="date">Ngày ban hành</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
                setExpandedId(null);
              }}
              className="search-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Còn hiệu lực">Còn hiệu lực</option>
              <option value="Hết hiệu lực">Hết hiệu lực</option>
              <option value="Sắp có hiệu lực">Sắp có hiệu lực</option>
            </select>
            
            <button className="btn-search">Tìm kiếm</button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="results-area">
        <div className="results-count">
          Tìm thấy <span className="count-number">{filteredDocuments.length}</span> kết quả
        </div>

        <div className="results-list">
          {currentData.length > 0 ? (
            currentData.map((doc) => {
              const isExpanded = expandedId === doc.id;
              return (
                <div 
                  key={doc.id} 
                  onClick={() => toggleExpand(doc.id)}
                  className={`result-card ${isExpanded ? 'card-expanded' : ''}`}
                >
                  <div className="card-top-row">
                    <span className="doc-number-badge">{doc.number}</span>
                    <span className={`doc-status-badge ${getStatusClass(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  
                  <h3 className="doc-name">{doc.name}</h3>
                  
                  {isExpanded ? (
                    <div className="card-details">
                      <div className="details-grid">
                        <div><span className="label">Loại văn bản</span><span className="value">{doc.type}</span></div>
                        <div><span className="label">Ban hành</span><span className="value">{doc.issueDate}</span></div>
                        <div><span className="label">Hiệu lực</span><span className="value">{doc.effectiveDate}</span></div>
                        <div><span className="label">Người ký</span><span className="value">{doc.signer || '---'}</span></div>
                      </div>

                      {doc.summary && (
                        <div className="summary-section">
                          <span className="label">Trích yếu / Nội dung chính</span>
                          <p className="summary-text">"{doc.summary}"</p>
                        </div>
                      )}
                      
                      <div className="card-actions">
                        <button 
                          className="btn-collapse"
                          onClick={(e) => { e.stopPropagation(); toggleExpand(doc.id); }}
                        >
                          Thu gọn
                        </button>
                        <button 
                          className="btn-fulltext"
                          onClick={(e) => handleViewFullText(e, doc)} 
                        >
                          Xem toàn văn
                          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="card-collapsed-hint">
                      <svg width="16" height="16" className="hint-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
             <div className="no-results">
               <p>Không tìm thấy văn bản nào phù hợp.</p>
             </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-area">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-page-nav"
          >
            &lt;
          </button>
          
          <div className="page-numbers">
             {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
               <button
                 key={page}
                 onClick={() => handlePageChange(page)}
                 className={`btn-page-number ${currentPage === page ? 'page-active' : ''}`}
               >
                 {page}
               </button>
             ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-page-nav"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentSearch;