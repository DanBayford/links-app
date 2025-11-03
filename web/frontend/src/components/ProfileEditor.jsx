import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser, useToast } from "../hooks";
import { Loader, Error } from "./index";
import api from "../services/api";
import ProfileImagePlaceholder from "../assets/icon-upload-image.svg";

const MAX_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const profileSchema = yup
  .object({
    firstName: yup.string().trim().required("first name is required").max(30),
    lastName: yup.string().trim().required("last name is required").max(30),
    email: yup.string().trim().email("must be a valid email").required(),
    // Profile picture is optional so test can return early
    profilePicture: yup
      .mixed()
      .test("fileType", "Please choose an image", (value) => {
        if (!value || value.length === 0) return true;
        return ACCEPTED_TYPES.includes(value[0].type);
      })
      .test("fileSize", `Max size is ${MAX_MB}MB`, (value) => {
        if (!value || value.length === 0) return true;
        return value[0].size <= MAX_MB * 1024 * 1024;
      }),
  })
  .required();

export const ProfileEditor = () => {
  const { userData, userDataIsLoading, userDataError, invalidateUser } =
    useUser();

  const { successToast, errorToast } = useToast();

  // Live preview for selected image
  const [profilePicturePreviewUrl, setProfilePicturePreviewUrl] =
    useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    mode: "onTouched",
  });

  // Watch for changes on 'profilePicture' input field to tirgger useEffect
  const profilePictureWatch = watch("profilePicture");

  useEffect(() => {
    if (profilePictureWatch && profilePictureWatch.length > 0) {
      const file = profilePictureWatch[0];
      const url = URL.createObjectURL(file);
      setProfilePicturePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [profilePictureWatch]);

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
      });
    }
  }, [userData, reset]);

  const submitHandler = async (data) => {
    if (data.profilePicture && data.profilePicture.length > 0) {
      try {
        const profileUploadForm = new FormData();
        profileUploadForm.append("profilePicture", data.profilePicture[0]);
        await api.User.uploadProfilePicture(profileUploadForm);
      } catch (e) {
        console.log("error uploading", e);
      }
    }

    const res = await api.User.updateUser({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
    });
    if (res.status === 204) {
      successToast("Profile successfully updated");
      invalidateUser();
    } else {
      errorToast("Error updating profile");
    }
  };

  if (userDataIsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader loadingMessage={"Loading user data"} />
      </div>
    );
  } else if (userDataError) {
    return (
      <div className="flex justify-center items-center h-full">
        <Error errorMessage={"Error loading user data"} />
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4 h-full"
      onSubmit={handleSubmit(submitHandler)}
      noValidate
    >
      <div className="basis-1/6 flex flex-col justify-around">
        <h1 className="text-3xl font-bold">Profile details</h1>
        <p className="text-gray-500">
          Add your details to create a personal touch to your profile
        </p>
      </div>

      <div className="relative w-full basis-3/6 flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <label className="basis-1/3 text-gray-500" htmlFor="profilePicture">
          Profile picture
        </label>
        <label
          className="relative w-full h-full basis-1/3 flex flex-col gap-2 justify-center items-center bg-cover bg-center rounded-xl hover:cursor-pointer"
          style={
            profilePicturePreviewUrl
              ? { backgroundImage: `url(${profilePicturePreviewUrl})` }
              : { backgroundColor: "#efebff" }
          }
        >
          {profilePicturePreviewUrl && (
            <div className="absolute inset-0 bg-black/30 rounded-xl"></div>
          )}
          <ProfileImagePlaceholder
            className={`${
              profilePicturePreviewUrl ? "invert brightness-0 saturate-0" : ""
            }`}
          />
          <p
            className={`font-bold z-5 ${
              profilePicturePreviewUrl ? "text-white" : "text-purple-600"
            }`}
          >
            {profilePicturePreviewUrl ? "Change image" : "Upload image"}
          </p>

          <input
            id="profilePicture"
            className="hidden"
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            {...register("profilePicture")}
          />
        </label>
        <p className="basis-1/3 text-gray-500">
          Max image size 5MB. <br />
          Use PNG or JPG format.
        </p>
        {errors.profilePicture && (
          <p className="form-error" role="alert">
            {errors.profilePicture.message}
          </p>
        )}
      </div>

      <div className="w-full basis-1/3 flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="relative flex items-center">
          <label className="basis-1/5 text-gray-500" htmlFor="firstName">
            First name*
          </label>
          <input
            type="text"
            id="firstName"
            className="basis-4/5 bg-white"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="absolute top-2 right-2 form-error" role="alert">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="relative flex items-center">
          <label className="basis-1/5 text-gray-500" htmlFor="lastName">
            Last name*
          </label>
          <input
            type="text"
            id="lastName"
            className="basis-4/5 bg-white"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="absolute top-2 right-2 form-error" role="alert">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="relative flex items-center">
          <label className="basis-1/5 text-gray-500" htmlFor="email">
            Email*
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="basis-4/5 bg-white"
            {...register("email")}
          />
          {errors.email && (
            <p className="absolute top-2 right-2 form-error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto flex justify-between py-3 border-t border-t-gray-300">
        <a className="btn btn__secondary" href="/confirm">
          Logout
        </a>
        <button
          type="submit"
          className="btn btn__primary"
          disabled={isSubmitting || !isDirty}
        >
          Update profile
        </button>
      </div>
    </form>
  );
};
