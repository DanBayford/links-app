import { useState, useEffect } from "react";

/*
Get current user ID from URL
*/
export const useUserUuid = () => {
  const [userUuid, setUserUuid] = useState(null);

  useEffect(() => {
    const splitPath = window.location.pathname.split("/");
    const uuid = splitPath[2];
    setUserUuid(uuid);
  }, []);

  return userUuid;
};
