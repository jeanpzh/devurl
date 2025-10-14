import z, { object, string, url } from "zod";

export const createOfflineLinkSchema = object({
  url: url("La URL no es válida"),
  slug: string("El slug es requerido")
    .min(3, "Slug demasiado corto")
    .max(20, "Slug demasiado largo")
    .regex(/^[a-zA-Z0-9-_]+$/, "Slug inválido"),
});

export type CreateOfflineLinkInput = z.infer<typeof createOfflineLinkSchema>;
