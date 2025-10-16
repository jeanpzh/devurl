import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteLinkParams {
  linkId: string;
}

async function deleteShortUrl(linkId: string): Promise<void> {
  const response = await fetch(`/api/url/${linkId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al eliminar el link");
  }
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId }: DeleteLinkParams) => deleteShortUrl(linkId),
    onSuccess: () => {
      // Invalidate all queries that start with "urls"
      queryClient.invalidateQueries({
        queryKey: ["urls"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Link eliminado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el link: ${error.message}`);
    },
  });
}
