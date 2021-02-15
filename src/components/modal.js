import react from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
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
          <IoCloseCircleOutline />
        </button>
      </div>
      <div className="modal-div" onClick={handleCloseModal}></div>
    </>
  );
};

export default Modal;
