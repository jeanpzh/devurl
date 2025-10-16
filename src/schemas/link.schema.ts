import z, { number, object, string, url } from "zod";

export const createLinkSchema = object({
  id: number().optional(),
  url: url("La URL no es válida"),
  slug: string("El slug es requerido")
    .min(3, "Slug demasiado corto")
    .max(20, "Slug demasiado largo")
    .regex(/^[a-zA-Z0-9-_]+$/, "Slug inválido"),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
