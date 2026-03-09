import React, { useState } from 'react';
import { X } from 'lucide-react';
import './ReportModal.css';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (reason: string, shouldDelete: boolean) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onReport }) => {
  const [reason, setReason] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmitReport = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for reporting');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleDeleteDecision = (shouldDelete: boolean) => {
    onReport(reason, shouldDelete);
    setReason('');
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleClose = () => {
    setReason('');
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="report-modal-overlay" onClick={handleClose}>
      <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="report-modal-header">
          <h2 className="report-modal-title">
            {showDeleteConfirm ? 'Delete Transaction?' : 'Report Transaction'}
          </h2>
          <button className="report-modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="report-modal-body">
          {!showDeleteConfirm ? (
            <>
              <p className="report-modal-description">
                Please provide a reason for reporting this transaction:
              </p>
              <textarea
                className="report-modal-textarea"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for reporting..."
                rows={4}
                autoFocus
              />
              <div className="report-modal-actions">
                <button className="report-modal-btn report-modal-btn-cancel" onClick={handleClose}>
                  Cancel
                </button>
                <button className="report-modal-btn report-modal-btn-submit" onClick={handleSubmitReport}>
                  Submit Report
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="report-modal-description">
                Do you want to delete this transaction from your records?
              </p>
              <p className="report-modal-note">
                Note: Deleted transactions will still be included in CSV exports with their report data.
              </p>
              <div className="report-modal-actions">
                <button 
                  className="report-modal-btn report-modal-btn-keep" 
                  onClick={() => handleDeleteDecision(false)}
                >
                  Keep Transaction
                </button>
                <button 
                  className="report-modal-btn report-modal-btn-delete" 
                  onClick={() => handleDeleteDecision(true)}
                >
                  Delete Transaction
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
