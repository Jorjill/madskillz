import React from "react";
import "./delete-modal.less";

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
  noteTitle: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  onClose,
  onConfirm,
  noteTitle,
}) => (
  <div className="delete-modal">
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Delete Confirmation</h2>
        <button className="close-button" onClick={onClose} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <p>Are you sure you want to delete <strong>"{noteTitle}"</strong>?</p>
        <p className="warning-text">This action cannot be undone.</p>
      </div>
      <div className="modal-footer">
        <button className="modal-button cancel" onClick={onClose}>Cancel</button>
        <button className="modal-button delete" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);