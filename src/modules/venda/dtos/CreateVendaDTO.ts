import { z } from "zod";

// Schema de validação para item da venda
const ItemVendaSchema = z.object({
  produtoId: z.number().positive("ID do produto deve ser positivo"),
  nome: z.string().min(1, "Nome do produto é obrigatório"),
  quantidade: z.number().positive("Quantidade deve ser positiva"),
  precoUnitario: z.number().positive("Preço unitário deve ser positivo"),
  desconto: z.number().min(0, "Desconto não pode ser negativo").optional(),
});

// Schema de validação para criação de venda
export const CreateVendaSchema = z.object({
  clienteId: z.number().positive("ID do cliente deve ser positivo"),
  clienteNome: z.string().min(1, "Nome do cliente é obrigatório"),
  clienteEmail: z.string().email("Email do cliente deve ser válido"),
  itens: z.array(ItemVendaSchema).min(1, "Venda deve ter pelo menos um item"),
  formaPagamento: z.enum(
    ["dinheiro", "cartao_credito", "cartao_debito", "pix", "transferencia"],
    {
      errorMap: () => ({ message: "Forma de pagamento deve ser válida" }),
    }
  ),
  observacoes: z.string().optional(),
  vendedorId: z.number().positive("ID do vendedor deve ser positivo"),
  vendedorNome: z.string().min(1, "Nome do vendedor é obrigatório"),
});

// Tipo TypeScript derivado do schema
export type CreateVendaDTO = z.infer<typeof CreateVendaSchema>;

// Interface para resposta de criação
export interface CreateVendaResponseDTO {
  id: string;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  itens: Array<{
    produtoId: number;
    nome: string;
    quantidade: number;
    precoUnitario: number;
    precoTotal: number;
    desconto?: number;
  }>;
  subtotal: number;
  descontoTotal: number;
  total: number;
  formaPagamento: string;
  status: string;
  observacoes?: string;
  vendedorId: number;
  vendedorNome: string;
  createdAt: Date;
  updatedAt: Date;
}

