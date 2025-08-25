import { z } from "zod";

const ItemPedidoSchema = z.object({
  produtoId: z.number().positive(),
  nome: z.string().min(1),
  quantidade: z.number().positive(),
  precoUnitario: z.number().positive(),
});

// DTO para criação com dados do cliente obrigatórios
export const CreatePedidoSchema = z.object({
  clienteId: z.number().positive(),
  clienteNome: z.string().min(1),
  clienteEmail: z.string().email(),
  itens: z.array(ItemPedidoSchema).min(1),
});

// DTO para criação apenas com ID do cliente (dados serão buscados automaticamente)
export const CreatePedidoSimpleSchema = z.object({
  clienteId: z.number().positive(),
  itens: z.array(ItemPedidoSchema).min(1),
});

export type CreatePedidoDTO = z.infer<typeof CreatePedidoSchema>;
export type CreatePedidoSimpleDTO = z.infer<typeof CreatePedidoSimpleSchema>;

export interface CreatePedidoResponseDTO {
  id: string;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  itens: {
    produtoId: number;
    quantidade: number;
  }[];
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
