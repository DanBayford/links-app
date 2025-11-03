import React from "react";
import { BounceLoader } from "react-spinners";

export const Loader = ({ loadingMessage = "Loading" }) => {
  return (
    <div className="col-span-full row-span-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center">
        <BounceLoader
          color="#633CFF"
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="text-xl text-gray-500">{loadingMessage}</p>
      </div>
    </div>
  );
};
