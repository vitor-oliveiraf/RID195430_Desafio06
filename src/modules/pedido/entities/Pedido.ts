import mongoose, { Document, Schema } from "mongoose";

// Interface para o item do pedido
export interface ItemPedido {
  produtoId: number; // ID do produto no SQL
  nome: string; // Nome do produto (cópia para consulta rápida)
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  observacoes?: string; // Observações específicas do item
}

// Interface para informações de entrega
export interface InformacoesEntrega {
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
  telefone: string;
  instrucoes?: string; // Instruções especiais para entrega
}

// Interface para o pedido
export interface IPedido extends Document {
  clienteId: number; // ID do cliente no SQL
  clienteNome: string; // Nome do cliente (cópia para consulta rápida)
  clienteEmail: string; // Email do cliente (cópia para consulta rápida)
  itens: ItemPedido[];
  subtotal: number;
  descontoTotal: number;
  taxaEntrega: number;
  total: number;
  formaPagamento:
    | "dinheiro"
    | "cartao_credito"
    | "cartao_debito"
    | "pix"
    | "transferencia";
  status:
    | "recebido"
    | "confirmado"
    | "preparando"
    | "pronto"
    | "em_entrega"
    | "entregue"
    | "cancelado";
  tipoEntrega: "delivery" | "retirada";
  informacoesEntrega?: InformacoesEntrega; // Apenas para delivery
  tempoEstimado?: number; // Tempo estimado em minutos
  observacoes?: string;
  vendedorId: number; // ID do vendedor/usuário
  vendedorNome: string; // Nome do vendedor (cópia para consulta rápida)
  createdAt: Date;
  updatedAt: Date;
}

// Schema do MongoDB para item do pedido
const ItemPedidoSchema = new Schema<ItemPedido>(
  {
    produtoId: { type: Number, required: true },
    nome: { type: String, required: true },
    quantidade: { type: Number, required: true, min: 1 },
    precoUnitario: { type: Number, required: true, min: 0 },
    precoTotal: { type: Number, required: true, min: 0 },
    observacoes: { type: String },
  },
  { _id: false }
);

// Schema do MongoDB para informações de entrega
const InformacoesEntregaSchema = new Schema<InformacoesEntrega>(
  {
    endereco: { type: String, required: true },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true },
    complemento: { type: String },
    telefone: { type: String, required: true },
    instrucoes: { type: String },
  },
  { _id: false }
);

// Schema do MongoDB para pedido
const PedidoSchema = new Schema<IPedido>(
  {
    clienteId: { type: Number, required: true },
    clienteNome: { type: String, required: true },
    clienteEmail: { type: String, required: true },
    itens: [ItemPedidoSchema],
    subtotal: { type: Number, required: true, min: 0 },
    descontoTotal: { type: Number, default: 0, min: 0 },
    taxaEntrega: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    formaPagamento: {
      type: String,
      required: true,
      enum: [
        "dinheiro",
        "cartao_credito",
        "cartao_debito",
        "pix",
        "transferencia",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: [
        "recebido",
        "confirmado",
        "preparando",
        "pronto",
        "em_entrega",
        "entregue",
        "cancelado",
      ],
      default: "recebido",
    },
    tipoEntrega: {
      type: String,
      required: true,
      enum: ["delivery", "retirada"],
    },
    informacoesEntrega: InformacoesEntregaSchema,
    tempoEstimado: { type: Number, min: 0 }, // Em minutos
    observacoes: { type: String },
    vendedorId: { type: Number, required: true },
    vendedorNome: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "pedidos",
  }
);

// Índices para melhor performance
PedidoSchema.index({ clienteId: 1 });
PedidoSchema.index({ vendedorId: 1 });
PedidoSchema.index({ status: 1 });
PedidoSchema.index({ tipoEntrega: 1 });
PedidoSchema.index({ createdAt: -1 });
PedidoSchema.index({ "itens.produtoId": 1 });

// Middleware para calcular totais automaticamente
PedidoSchema.pre("save", function (next) {
  // Calcular subtotal
  this.subtotal = this.itens.reduce((sum, item) => sum + item.precoTotal, 0);

  // Calcular total final (subtotal - desconto + taxa de entrega)
  this.total = this.subtotal - this.descontoTotal + this.taxaEntrega;

  next();
});

export const Pedido = mongoose.model<IPedido>("Pedido", PedidoSchema);
