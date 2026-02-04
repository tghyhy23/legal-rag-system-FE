// src/LegalCard.jsx
import React from 'react';
import './LegalCard.css';

const LegalCard = ({ title, code, status, link, signer }) => {
  return (
    <div className="legal-card">
      <div className="card-header">
        <div className="card-info">
          <h4 className="card-code">{code}</h4>
          <p className="card-title">{title}</p>
          {signer && (
            <p className="card-signer">
              <span className="label">Người ký:</span> {signer}
            </p>
          )}
        </div>
        {status && (
          <span className={`card-status ${status === 'Còn hiệu lực' ? 'status-green' : 'status-orange'}`}>
            {status}
          </span>
        )}
      </div>
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="card-link"
        >
          Xem chi tiết &rarr;
        </a>
      )}
    </div>
  );
};

export default LegalCard;