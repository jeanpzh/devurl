import z, { object, string } from "zod";

export const termSchema = object({
  term: string()
    .min(2, "El término debe tener al menos 2 caracteres")
    .max(50, "El término debe tener como máximo 50 caracteres"),
});

export type TermInput = z.infer<typeof termSchema>;
