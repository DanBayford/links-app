import React from "react";

export const Error = ({ errorMessage = "Something went wrong" }) => {
  return (
    <div className="col-span-full row-span-full h-full flex justify-center items-center">
      <p className="text-xl text-gray-500">{errorMessage}</p>
    </div>
  );
};
