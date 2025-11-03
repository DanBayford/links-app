import React, {
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import CloseIcon from "../assets/icon-close.svg";

const ModalContext = createContext(undefined);

export const Modal = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e) => {
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

const OpenModalElement = ({ children, ...props }) => {
  const { openModal } = useModal();
  return cloneElement(children, {
    onClick: (e) => openModal(e),
    ...props,
  });
};

const ModalBackdrop = ({ children }) => {
  return (
    <div className="absolute min-h-screen w-full z-10 bg-gray-600/50 top-0 left-0 flex justify-center items-center">
      {children}
    </div>
  );
};

const ModalWindow = ({ children }) => {
  const { isModalOpen, closeModal } = useModal();

  if (!isModalOpen) {
    return null;
  }

  return createPortal(
    <ModalBackdrop>
      <aside className="bg-white w-[80%] md:w-[50%] h-[50%] max-w-[900px] px-4 pt-2 pb-4 rounded-xl">
        <CloseIcon
          className="w-10 h-10 ml-auto hover:cursor-pointer"
          onClick={closeModal}
        />
        {children}
      </aside>
    </ModalBackdrop>,
    document.body
  );
};

const useModal = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("Cannot use useModal outside ModalContext");
  }

  return context;
};

Modal.OpenModalElement = OpenModalElement;
Modal.ModalWindow = ModalWindow;
Modal.useModal = useModal;
