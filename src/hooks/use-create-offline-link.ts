import { CreateOfflineLinkInput } from "@/schemas/create-offline-link.schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const createOfflineLink = async (data: CreateOfflineLinkInput) => {
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

export const useCreateOfflineLink = () => {
  return useMutation({
    mutationFn: (data: CreateOfflineLinkInput) => createOfflineLink(data),
    onSuccess: () => {
      toast.success("Link creado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
