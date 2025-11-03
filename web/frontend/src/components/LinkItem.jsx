import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useConfig } from "../hooks";
import { Modal, LinkForm, DeleteLink } from "../components";
import DragAndDropIcon from "../assets/icon-drag-and-drop.svg";

export const LinkItem = ({ linkItem, linkNumber }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: linkItem.uuid });

  const { platformLookup } = useConfig();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className="flex flex-col gap-3 p-3 bg-gray-50 rounded-xl"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex justify-between">
        <span
          className="flex items-center gap-2 hover:cursor-grab"
          {...attributes}
          {...listeners}
        >
          <DragAndDropIcon />
          <p className="font-extrabold text-gray-500">Link #{linkNumber}</p>
        </span>
        <Modal>
          <Modal.OpenModalElement>
            <span className="text-gray-500 hover:text-gray-300 hover:cursor-pointer">
              Remove
            </span>
          </Modal.OpenModalElement>
          <Modal.ModalWindow>
            <DeleteLink currentLink={linkItem} />
          </Modal.ModalWindow>
        </Modal>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="p-1 rounded-md"
          style={{ backgroundColor: linkItem.platform.platform_color }}
        >
          <img
            className="w-8 h-8"
            style={{
              filter: "brightness(0) invert(1)",
            }}
            src={linkItem.platform.platform_icon}
          />
        </span>
        <h2 className="font-bold text-lg text-gray-500">
          {platformLookup[linkItem.platform.platform_name]}
        </h2>
      </div>

      <div className="flex gap-4">
        <span className="p-2 grow text-gray-500 border border-gray-200 rounded">
          {linkItem.link_url}
        </span>
        <Modal>
          <Modal.OpenModalElement>
            <span className="btn basis-26 btn__secondary">Edit</span>
          </Modal.OpenModalElement>
          <Modal.ModalWindow>
            <LinkForm currentLink={linkItem} />
          </Modal.ModalWindow>
        </Modal>
      </div>
    </li>
  );
};
