import z, { number, object, string, url } from "zod";

export const createLinkSchema = object({
  id: number().optional(),
  url: url("La URL no es válida").refine((value) => {
    // new URL() throws for malformed input; zod v4 runs .refine() even
    // when the base .url() check failed, so guard it to avoid breaking
    // the whole form/API validation with an uncaught exception.
    try {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    } catch {
      return false;
    }
  }, "Solo se permiten URLs HTTP o HTTPS"),
  slug: string()
    .trim()
    .max(20, "Slug demasiado largo")
    .refine(
      (value) =>
        value === "" || (value.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(value)),
      "Slug inválido",
    )
    .optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
