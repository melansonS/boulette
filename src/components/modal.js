import { IoCloseCircleOutline } from "react-icons/io5";
import "./modal.css";

const Modal = ({ children, closeModal, className, canClose = true }) => {
  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <>
      <div className={`modal-content ${className}`}>
        {children}
        {canClose && (
          <button className="close" onClick={handleCloseModal}>
            <IoCloseCircleOutline />
          </button>
        )}
      </div>
      <div
        className="modal-div"
        onClick={canClose ? handleCloseModal : undefined}
      ></div>
    </>
  );
};

export default Modal;
