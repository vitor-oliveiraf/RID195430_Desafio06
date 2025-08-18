import { z } from "zod";

export const createUsuarioSchema = z
  .object({
    nome: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .optional(),
    name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .optional(),
    email: z
      .string()
      .email("Email inválido")
      .max(100, "Email deve ter no máximo 100 caracteres"),
    senha: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(100, "Senha deve ter no máximo 100 caracteres"),
  })
  .strict();

export type CreateUsuarioSchema = z.infer<typeof createUsuarioSchema>;
