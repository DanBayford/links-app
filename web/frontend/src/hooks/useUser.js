import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useUser = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["user"],
    queryFn: api.User.getUser,
  });

  const queryClient = useQueryClient();

  const invalidateUser = () => {
    queryClient.invalidateQueries({
      queryKey: ["user"],
    });
  };

  return {
    userData: data,
    userDataLoading: isPending,
    userDataError: isError,
    invalidateUser,
  };
};
