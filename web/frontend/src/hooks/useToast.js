import { toast } from "react-toastify";

export const useToast = () => {
  const successToast = (message) => {
    toast.success(message);
  };

  const errorToast = (message) => {
    toast.error(message);
  };

  const infoToast = (message) => {
    toast.info(message);
  };

  const clearToasts = () => {
    toast.dismiss();
  };

  return {
    successToast,
    errorToast,
    infoToast,
    clearToasts,
  };
};
