import react from "react";
import "./modal.css";

const Modal = ({ children, closeModal, className }) => {
  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <>
      <div className={`modal-content ${className}`}>
        {children}

        <button className="close" onClick={handleCloseModal}>
          x
        </button>
      </div>
      <div className="modal-div" onClick={handleCloseModal}></div>
    </>
  );
};

export default Modal;
