import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export const useConfig = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["config"],
    queryFn: api.Config.getConfig,
  });

  return {
    platformLookup: data?.platformLookup,
    platformRegexes: data?.platformRegexes,
    platforms: data?.platforms,
    configLoading: isPending,
    configError: isError,
  };
};
