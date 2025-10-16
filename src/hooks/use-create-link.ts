import { CreateLinkInput } from "@/schemas/link.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const createLink = async (data: CreateLinkInput) => {
  const res = await fetch("/api/slug", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: data.url,
      slug: data.slug,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After");
      const errorMsg = json.error || "Demasiadas solicitudes";
      const timeMsg = retryAfter
        ? ` Intenta en ${retryAfter} segundos.`
        : " Por favor, espera un momento.";
      throw new Error(errorMsg + timeMsg);
    }
    throw new Error(json.error);
  }
  return json;
};

export const useCreateLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLinkInput) => createLink(data),
    onSuccess: () => {
      toast.success("Link creado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["urls"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
