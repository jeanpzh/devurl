import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function setLinkStatus(linkId: number, isActive: boolean) {
  const response = await fetch(`/api/url/${linkId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  const body = await response.json();
  if (!response.ok)
    throw new Error(body.message ?? "No se pudo cambiar el estado");
  return body as { id: number; isActive: boolean };
}

export function useSetLinkStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ linkId, isActive }: { linkId: number; isActive: boolean }) =>
      setLinkStatus(linkId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("Estado del link actualizado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
