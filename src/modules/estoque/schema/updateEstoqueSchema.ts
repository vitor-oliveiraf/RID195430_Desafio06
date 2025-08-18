import { z } from "zod";

export const updateEstoqueSchema = z
  .object({
    quantidade: z.number().min(1, "Quantidade deve ser maior que 0").optional(),
  })
  .strict();

export type UpdateEstoqueSchema = z.infer<typeof updateEstoqueSchema>;
