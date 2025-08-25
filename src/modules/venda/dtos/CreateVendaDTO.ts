import { z } from "zod";

const ItemVendaSchema = z.object({
  produtoId: z.number().positive(),
  nome: z.string().min(1),
  quantidade: z.number().positive(),
  precoUnitario: z.number().positive(),
});

export const CreateVendaSchema = z.object({
  clienteId: z.number().positive(),
  clienteNome: z.string().min(1),
  clienteEmail: z.string().email(),
  pedidoId: z.string().min(1),
  itens: z.array(ItemVendaSchema).min(1),
});

export const CreateVendaFromPedidoSchema = z.object({
  pedidoId: z.string().min(1),
});

export type CreateVendaDTO = z.infer<typeof CreateVendaSchema>;
export type CreateVendaFromPedidoDTO = z.infer<
  typeof CreateVendaFromPedidoSchema
>;

export interface CreateVendaResponseDTO {
  id: string;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  pedidoId: string;
  itens: {
    produtoId: number;
    nome: string;
    quantidade: number;
    precoUnitario: number;
  }[];
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
