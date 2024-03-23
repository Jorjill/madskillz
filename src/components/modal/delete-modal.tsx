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
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <div className="modal-header">
          <h4 className="modal-title">Confirm Deletion</h4>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete the note "{noteTitle}"?</p>
        </div>
        <div className="modal-footer">
          <button className="modal-button cancel" onClick={onClose}>Cancel</button>
          <button className="modal-button confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
  