import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast, useConfig } from "../hooks";
import api from "../services/api";

export const useLinks = () => {
  const queryClient = useQueryClient();
  const { platforms } = useConfig();

  const { data, isPending, isError } = useQuery({
    queryKey: ["links"],
    queryFn: api.Links.reorderLinks,
  });
  const { successToast, errorToast } = useToast();

  const reorderLinksMutation = useMutation({
    mutationFn: (links) => api.Links.updateLinks(links),
    // Optimistic UI update
    onMutate: async (links) => {
      // 1) stop any running refetches for this query
      await queryClient.cancelQueries({ queryKey: ["links"] });

      // 2) snapshot previous value for rollback
      const prev = queryClient.getQueryData(["links"]);

      // 3) apply optimistic reorder to cached data
      queryClient.setQueryData(["links"], links);

      // 4) return context to use in onSucess/onError if required
      const context = {};
      context["prev"] = prev;
      return context;
    },
    onError: (error, _variables, ctx) => {
      if (ctx?.prev) queryClient.setQueryData("links", ctx.prev);
      errorToast(error?.response?.data || "Error reordering links");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  const createLinkMutation = useMutation({
    mutationFn: (link) => api.Links.createLink(link),
    onSuccess: () => successToast("Link created"),
    onError: (error, _variables, _ctx) =>
      errorToast(error?.response?.data || "Error creating link"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  const updateLinkMutation = useMutation({
    mutationFn: (link) => api.Links.updateLink(link),
    onMutate: async (link) => {
      await queryClient.cancelQueries({ queryKey: ["links"] });
      const prev = queryClient.getQueryData(["links"]);

      // Get platform details from config
      const linkPlatformObj = platforms.find(
        (p) => p.platform_name == link.platform
      );

      // Optimistic update of links cache data
      const updatedLinks = prev.map((prevLink) =>
        prevLink.uuid === link.id
          ? { ...link, uuid: link.id, platform: linkPlatformObj }
          : prevLink
      );
      await queryClient.setQueryData(["links"], updatedLinks);

      const context = {};
      context["prev"] = prev;
      return context;
    },
    onSuccess: () => successToast("Link updated"),
    onError: (error, _variables, _ctx) =>
      errorToast(error?.response?.data || "Error updating link"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  const deleteLinkMutation = useMutation({
    mutationFn: (linkId) => api.Links.deleteLink(linkId),
    onSuccess: () => successToast("Link deleted"),
    onError: (error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData("links", ctx.prev);
      errorToast(error?.response?.data || "Error deleting link");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  return {
    linksData: data,
    linksDataLoading: isPending,
    linksDataError: isError,
    reorderLinks: (links) => reorderLinksMutation.mutate(links),
    isReorderingLinks: reorderLinksMutation.isPending,
    createLink: (platform, url) => createLinkMutation.mutate(platform, url),
    updateLink: (id, platform, url) =>
      updateLinkMutation.mutate(id, platform, url),
    deleteLink: (linkId) => deleteLinkMutation.mutate(linkId),
    isDeletingLink: deleteLinkMutation.isPending,
  };
};
