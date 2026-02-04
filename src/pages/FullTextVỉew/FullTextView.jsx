// src/FullTextView.jsx
import React from 'react';
import './FullTextView.css';

const FullTextView = ({ document, onClose }) => {
  return (
    <div className="full-text-view">
      {/* Toolbar */}
      <div className="ft-toolbar">
        <div className="ft-toolbar-left">
          <button onClick={onClose} className="btn-back" title="Quay lại">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="ft-doc-info-mini">
            <h2 className="ft-number-mini">{document.number}</h2>
            <p className="ft-name-mini">{document.name}</p>
          </div>
        </div>
        
        <div className="ft-toolbar-right">
            <button className="btn-toolbar btn-print">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                In văn bản
            </button>
            <button className="btn-toolbar btn-download">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Tải về
            </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="ft-content-wrapper">
        <div className="ft-paper">
            {/* Header Info */}
            <div className="ft-paper-header">
                <div className="ft-meta-grid">
                    <div><p className="ft-label">Số hiệu:</p><p className="ft-value">{document.number}</p></div>
                    <div><p className="ft-label">Loại văn bản:</p><p className="ft-value">{document.type}</p></div>
                    <div><p className="ft-label">Ngày ban hành:</p><p className="ft-value">{document.issueDate}</p></div>
                    <div><p className="ft-label">Ngày hiệu lực:</p><p className="ft-value">{document.effectiveDate}</p></div>
                    <div><p className="ft-label">Người ký:</p><p className="ft-value">{document.signer || '---'}</p></div>
                    <div>
                        <p className="ft-label">Trạng thái:</p>
                        <span className={`ft-badge ${
                             document.status === 'Còn hiệu lực' ? 'badge-green' : 
                             document.status === 'Hết hiệu lực' ? 'badge-red' : 'badge-gray'
                        }`}>
                            {document.status}
                        </span>
                    </div>
                </div>
                <h1 className="ft-title-main">{document.name}</h1>
            </div>

            {/* Body */}
            <div className="ft-body-text">
                {document.content ? (
                    <div dangerouslySetInnerHTML={{ __html: document.content }} />
                ) : (
                    <div className="ft-empty-state">Nội dung toàn văn đang được cập nhật...</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FullTextView;