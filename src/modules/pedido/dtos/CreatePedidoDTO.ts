import { z } from "zod";

// Schema de validação para item do pedido
const ItemPedidoSchema = z.object({
  produtoId: z.number().positive("ID do produto deve ser positivo"),
  nome: z.string().min(1, "Nome do produto é obrigatório"),
  quantidade: z.number().positive("Quantidade deve ser positiva"),
  precoUnitario: z.number().positive("Preço unitário deve ser positivo"),
  observacoes: z.string().optional(),
});

// Schema de validação para informações de entrega
const InformacoesEntregaSchema = z.object({
  endereco: z.string().min(1, "Endereço é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
  cep: z.string().min(8, "CEP deve ter pelo menos 8 caracteres"),
  complemento: z.string().optional(),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  instrucoes: z.string().optional(),
});

// Schema de validação para criação de pedido
export const CreatePedidoSchema = z.object({
  clienteId: z.number().positive("ID do cliente deve ser positivo"),
  clienteNome: z.string().min(1, "Nome do cliente é obrigatório"),
  clienteEmail: z.string().email("Email do cliente deve ser válido"),
  itens: z.array(ItemPedidoSchema).min(1, "Pedido deve ter pelo menos um item"),
  descontoTotal: z.number().min(0, "Desconto não pode ser negativo").optional(),
  taxaEntrega: z
    .number()
    .min(0, "Taxa de entrega não pode ser negativa")
    .optional(),
  formaPagamento: z.enum(
    ["dinheiro", "cartao_credito", "cartao_debito", "pix", "transferencia"],
    {
      errorMap: () => ({ message: "Forma de pagamento deve ser válida" }),
    }
  ),
  tipoEntrega: z.enum(["delivery", "retirada"], {
    errorMap: () => ({
      message: "Tipo de entrega deve ser 'delivery' ou 'retirada'",
    }),
  }),
  informacoesEntrega: InformacoesEntregaSchema.optional().refine(
    (data) => {
      // Se for delivery, informações de entrega são obrigatórias
      return true; // Será validado no service
    },
    {
      message: "Informações de entrega são obrigatórias para delivery",
    }
  ),
  tempoEstimado: z
    .number()
    .positive("Tempo estimado deve ser positivo")
    .optional(),
  observacoes: z.string().optional(),
  vendedorId: z.number().positive("ID do vendedor deve ser positivo"),
  vendedorNome: z.string().min(1, "Nome do vendedor é obrigatório"),
});

// Tipo TypeScript derivado do schema
export type CreatePedidoDTO = z.infer<typeof CreatePedidoSchema>;

// Interface para resposta de criação
export interface CreatePedidoResponseDTO {
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
    observacoes?: string;
  }>;
  subtotal: number;
  descontoTotal: number;
  taxaEntrega: number;
  total: number;
  formaPagamento: string;
  status: string;
  tipoEntrega: string;
  informacoesEntrega?: {
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
    telefone: string;
    instrucoes?: string;
  };
  tempoEstimado?: number;
  observacoes?: string;
  vendedorId: number;
  vendedorNome: string;
  createdAt: Date;
  updatedAt: Date;
}
