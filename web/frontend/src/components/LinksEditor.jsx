import React from "react";
import { useLinks, useUserUuid, useToast } from "../hooks";
import { Modal, LinkForm, LinksList, Loader, Error } from "../components";
import PlusIcon from "../assets/icon-plus.svg";
import EmptyIllustration from "../assets/illustration-empty.svg";

export const LinksEditor = () => {
  const { linksData, linksDataLoading, linksDataError } = useLinks();
  const userUuid = useUserUuid();
  const { infoToast } = useToast();

  const maxLinks = linksData?.length >= 5;

  if (linksDataLoading) {
    return <Loader loadingMessage="Loading links" />;
  } else if (linksDataError) {
    return <Error errorMessage="Error loading links" />;
  }

  const maxLinksHandler = () => infoToast("Maximum of 5 links");

  return (
    <div className="flex flex-col gap-4 h-full">
      <h1 className="text-3xl font-bold">Customize your links</h1>
      <p className="text-gray-500">
        Add/edit/remove links below and then share all your profiles with the
        world!
      </p>
      {maxLinks ? (
        <div
          onClick={maxLinksHandler}
          className="flex justify-center items-center gap-2 p-3 border border-indigo-600 text-indigo-600 hover:cursor-pointer hover:bg-indigo-600/5"
        >
          <PlusIcon className="w-6 h-6 indigo__icon" />
          Add new link
        </div>
      ) : (
        <Modal>
          <Modal.OpenModalElement>
            <div className="flex justify-center items-center gap-2 p-3 border border-indigo-600 text-indigo-600 hover:cursor-pointer hover:bg-indigo-600/5">
              <PlusIcon className="w-6 h-6 indigo__icon" />
              Add new link
            </div>
          </Modal.OpenModalElement>
          <Modal.ModalWindow>
            <LinkForm />
          </Modal.ModalWindow>
        </Modal>
      )}
      {linksData.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full">
          <EmptyIllustration />
          <h2 className="text-xl font-bold">Let's get you started</h2>
          <p className="text-gray-500">
            Use the "Add new link" button to get started. Once you have more
            than one link, you can reorder and edit them!
          </p>
        </div>
      ) : (
        <LinksList linksData={linksData} />
      )}
      <div className="flex justify-end py-3 border-t border-t-gray-300">
        <a href={`/links/${userUuid}`} className="btn btn__primary">
          <span>Preview</span>
        </a>
      </div>
    </div>
  );
};
