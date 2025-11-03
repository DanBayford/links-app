import React from "react";
import LargeDevLinksLogo from "../assets/logo-devlinks-large.svg";
import SmallDevLinksLogo from "../assets/logo-devlinks-small.svg";
import LinkLogo from "../assets/icon-link.svg";
import ProfileLogo from "../assets/icon-profile-details-header.svg";

export const NavBar = ({ VIEWS, currentView, setCurrentView }) => {
  return (
    <section className="col-start-2 lg:col-start-2 col-span-8 lg:col-span-12 bg-white mt-4">
      <nav className="flex h-full justify-between sm:items-center p-2 sm:p-4">
        <LargeDevLinksLogo className="hidden sm:block" />
        <SmallDevLinksLogo className="my-auto sm:hidden" />
        <div className="flex gap-1 md:gap-2 text-gray-500">
          <button
            className={`btn px-10 sm:px-4 ${
              currentView === VIEWS.LINKS_EDITOR
                ? "btn__link--active"
                : "btn__link"
            }`}
            onClick={() => setCurrentView(VIEWS.LINKS_EDITOR)}
          >
            <LinkLogo />
            <span className="hidden sm:block">Links</span>
          </button>
          <button
            className={`btn px-10 sm:px-4 ${
              currentView === VIEWS.PROFILE_EDITOR
                ? "btn__link--active"
                : "btn__link"
            }`}
            onClick={() => setCurrentView(VIEWS.PROFILE_EDITOR)}
          >
            <ProfileLogo />
            <span className="hidden sm:block">Profile Details</span>
          </button>
        </div>
        <a className="btn btn__secondary" href="/confirm">
          Logout
        </a>
      </nav>
    </section>
  );
};
