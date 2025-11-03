import React from "react";
import { useLinks } from "../hooks";
import { Modal } from "../components";

export const DeleteLink = ({ currentLink }) => {
  const { deleteLink } = useLinks();
  const { closeModal } = Modal.useModal();

  const deleteHandler = () => {
    closeModal();
    deleteLink(currentLink.uuid);
  };

  return (
    <div>
      <p className="text-xl text-gray-700">
        Are you sure you wish to delete this link?
      </p>
      <button
        className="ml-auto btn text-white bg-red-500 hover:bg-red-300"
        onClick={deleteHandler}
      >
        Delete
      </button>
    </div>
  );
};
