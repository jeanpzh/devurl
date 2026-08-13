import { z } from "zod";

export const urlQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z
    .string()
    .trim()
    .max(100)
    .regex(/^[^(),.*]*$/, "Search contains unsupported characters")
    .optional(),
  status: z.enum(["all", "active", "no_clicks"]).default("all"),
});

export type UrlQuery = z.infer<typeof urlQuerySchema>;
