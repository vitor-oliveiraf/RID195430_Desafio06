import { z } from "zod";

export const createEstoqueSchema = z
  .object({
    produtoId: z.number().min(1, "Produto ID deve ser maior que 0"),
    quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  })
  .strict();

export type CreateEstoqueSchema = z.infer<typeof createEstoqueSchema>;
