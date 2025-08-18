import { z } from "zod";

export const createProdutoSchema = z
  .object({
    nome: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    descricao: z
      .string()
      .min(2, "Descrição deve ter pelo menos 2 caracteres")
      .max(200, "Descrição deve ter no máximo 200 caracteres"),
    preco: z
      .number()
      .min(0, "Preço deve ser maior que 0")
      .max(1000000, "Preço deve ser menor que 1000000"),
    quantidade: z
      .number()
      .max(1000000, "Quantidade deve ser menor que 1000000")
      .optional(),
    usuarioId: z
      .number()
      .min(1, "Usuário deve ser maior que 0")
      .max(1000000, "Usuário deve ser menor que 1000000"),
  })
  .strict();

export type CreateProdutoSchema = z.infer<typeof createProdutoSchema>;
