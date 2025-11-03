import React from "react";
import { useForm } from "react-hook-form";
import { useConfig, useLinks } from "../hooks";
import { Modal } from "../components";

export const LinkForm = ({ currentLink = null }) => {
  const { platformLookup, platformRegexes } = useConfig();
  const { createLink, updateLink } = useLinks();
  const { closeModal } = Modal.useModal();

  const isUpdateForm = !!currentLink;

  const PLATFORMS = Object.entries(platformLookup).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isUpdateForm
      ? {
          platform: currentLink?.platform?.platform_name,
          url: currentLink?.link_url,
        }
      : { platform: "", url: "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const submit = (data) => {
    closeModal();
    const { platform, url } = data;
    if (isUpdateForm) {
      updateLink({
        id: currentLink?.uuid,
        position: currentLink?.position,
        platform,
        link_url: url,
      });
    } else {
      createLink({ platform, link_url: url });
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-700">
        {isUpdateForm ? "Update link" : "Create new link"}
      </h2>
      <label className="relative w-full">
        <span className="block mb-2 text-gray-700 font-bold">Platform</span>
        <select
          {...register("platform", {
            required: true,
          })}
          placeholder="Please select a platform"
          className="w-full appearance-none"
        >
          <option value="" disabled>
            Select a platform
          </option>
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-3/4 -translate-y-1/2 w-8 h-8 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      <label>
        <span className="block mb-2 text-gray-700 font-bold">Profile URL</span>
        <input
          type="url"
          className="w-full placeholder-gray-500 hover:cursor-pointer"
          placeholder="Enter platform profile URL"
          {...register("url", {
            required: "",
            validate: (value) => {
              const platform = getValues("platform");
              const rx = new RegExp(platformRegexes[platform]);
              const platformName = platformLookup[platform];
              return (
                rx.test(value || "") ||
                `Profile URL must match ${platformName} format`
              );
            },
          })}
        />
        {errors.url && (
          <p className="text-red-600 mt-2">{errors.url.message}</p>
        )}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn__primary ml-auto"
      >
        {currentLink ? "Update" : "Create"} link
      </button>
    </form>
  );
};
