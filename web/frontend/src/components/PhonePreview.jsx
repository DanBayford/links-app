import React from "react";
import { Loader } from "../components";
import { useUser, useLinks, useConfig } from "../hooks/index";
import PhoneMockup from "../assets/illustration-phone-mockup.svg";

export const PhonePreview = () => {
  const { userData, userDataLoading } = useUser();
  const { linksData, linksDataLoading } = useLinks();

  return (
    <>
      <div className="relative z-10 w-full h-full">
        <PhoneMockup className="absolute top-4 left-1/2 -translate-x-1/2" />
        {(userDataLoading || linksDataLoading) && (
          <div className="absolute top-22 left-1/2 -translate-x-1/2">
            <Loader loadingMessage="" />
          </div>
        )}
        {userData && linksData && (
          <UserDetails userData={userData} linksData={linksData} />
        )}
      </div>
    </>
  );
};

const UserDetails = ({ userData, linksData }) => {
  const hasProfilePicture = !!userData.profile_image;
  const hasName = userData?.first_name || userData?.last_name;
  const hasEmail = userData?.email;
  const hasLink1 = linksData?.length > 0;
  const hasLink2 = linksData?.length > 1;
  const hasLink3 = linksData?.length > 2;
  const hasLink4 = linksData?.length > 3;
  const hasLink5 = linksData?.length > 4;

  const fullName = `${userData?.first_name} ${userData?.last_name}`;

  // Used to dynamically set the top offset of links to cover skeltons
  const topOffsetConstant = 230;
  const relativeOffset = 64;

  return (
    <>
      <div
        className={`absolute left-1/2 -translate-x-1/2 h-24 w-25 rounded-full top-20 ${
          hasProfilePicture ? "bg-white" : ""
        }`}
      >
        {hasProfilePicture ? (
          <img
            src={`/media/${userData.profile_image}`}
            alt="User profile image"
            className="border-4 border-purple-600 rounded-full h-24 w-25"
          />
        ) : null}
      </div>
      <div
        className={`absolute left-1/2 -translate-x-1/2 h-6 w-60 top-[200px] rounded-lg flex justify-center text-md font-bold ${
          hasName ? "bg-white" : ""
        }`}
      >
        {hasName && (
          <p className="text-2xl font-bold tracking-wide text-gray-700">
            {fullName}
          </p>
        )}
      </div>
      <div
        className={`absolute left-1/2 -translate-x-1/2 h-4 w-60 top-[230px] flex justify-center text-sm text-gray-500 ${
          hasEmail ? "bg-white" : ""
        }`}
      >
        {hasEmail && <p className="text-lg text-gray-500">{userData.email}</p>}
      </div>
      <div
        style={{ top: `${topOffsetConstant + relativeOffset * 1}px` }}
        className={`absolute left-1/2 -translate-x-1/2 w-60`}
      >
        {hasLink1 && <LinkDetails link={linksData[0]} />}
      </div>
      <div
        style={{ top: `${topOffsetConstant + relativeOffset * 2}px` }}
        className={`absolute left-1/2 -translate-x-1/2 w-60`}
      >
        {hasLink2 && <LinkDetails link={linksData[1]} />}
      </div>
      <div
        style={{ top: `${topOffsetConstant + relativeOffset * 3}px` }}
        className={`absolute left-1/2 -translate-x-1/2 w-60 top-[406px]`}
      >
        {hasLink3 && <LinkDetails link={linksData[2]} />}
      </div>
      <div
        style={{ top: `${topOffsetConstant + relativeOffset * 4}px` }}
        className={`absolute left-1/2 -translate-x-1/2 w-60 top-[470px]`}
      >
        {hasLink4 && <LinkDetails link={linksData[3]} />}
      </div>
      <div
        style={{ top: `${topOffsetConstant + relativeOffset * 5}px` }}
        className={`absolute left-1/2 -translate-x-1/2 w-60 top-[534px]`}
      >
        {hasLink5 && <LinkDetails link={linksData[4]} />}
      </div>
    </>
  );
};

/*
Note BG color has to be inline style as not available to compile by TW at build time
*/
const LinkDetails = ({ link }) => {
  const { platformLookup } = useConfig();
  const {
    link_url,
    platform: { platform_color, platform_name, platform_icon },
  } = link;

  return (
    <a
      href={link_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex gap-3 p-3 rounded-lg text-white hover:opacity-80`}
      style={{ backgroundColor: platform_color }}
    >
      <img style={{ filter: "brightness(0) invert(1)" }} src={platform_icon} />
      {platformLookup[platform_name]}
    </a>
  );
};
