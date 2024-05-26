import "./general-answer-modal.less";

interface DeleteModalProps {
  onClose: () => void;
  gptResponse: any;
}

export const GeneralAnswerModal: React.FC<DeleteModalProps> = ({
  onClose,
  gptResponse,
}) => (
  <div className="general-answer-modal">
    <div className="modal-content">
      <span className="close-button" onClick={onClose}>
        &times;
      </span>
      <div className="modal-header">
        <h4 className="modal-title">Feedback</h4>
      </div>
      <div className="modal-body">
        <p>Rate: "{gptResponse.result}"</p>
        <p>Reason: "{gptResponse.reason}"</p>
      </div>
      <div className="modal-footer">
        <button
          className="modal-button cancel"
          onClick={() => {
            console.log("confirm");
            onClose();
          }}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
