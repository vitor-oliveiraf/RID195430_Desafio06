import { z } from "zod";

export const updateProdutoSchema = z
  .object({
    nome: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .optional(),
    descricao: z
      .string()
      .min(2, "Descrição deve ter pelo menos 2 caracteres")
      .max(200, "Descrição deve ter no máximo 200 caracteres")
      .optional(),
    preco: z
      .number()
      .min(0.01, "Preço deve ser maior que 0")
      .max(1000000, "Preço deve ser menor que 1000000")
      .optional(),
  })
  .strict();

export type UpdateProdutoSchema = z.infer<typeof updateProdutoSchema>;
