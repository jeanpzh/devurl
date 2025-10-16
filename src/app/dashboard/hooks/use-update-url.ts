import { CreateLinkInput as UpdateLinkInput } from "@/schemas/link.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function updateShortUrl(
  linkId: number,
  data: UpdateLinkInput
): Promise<void> {
  const response = await fetch(`/api/url/${linkId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  return response.json();
}

export function useUpdateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, url, id }: UpdateLinkInput) =>
      updateShortUrl(id!, { slug, url }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["urls"],
      });
      toast.success("Link actualizado exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
