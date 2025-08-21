import mongoose, { Document, Schema } from "mongoose";

// Interface para o item da venda
export interface ItemVenda {
  produtoId: number; // ID do produto no SQL
  nome: string; // Nome do produto (cópia para consulta rápida)
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  desconto?: number; // Desconto aplicado no item
}

// Interface para a venda
export interface IVenda extends Document {
  clienteId: number; // ID do cliente no SQL
  clienteNome: string; // Nome do cliente (cópia para consulta rápida)
  clienteEmail: string; // Email do cliente (cópia para consulta rápida)
  itens: ItemVenda[];
  subtotal: number;
  descontoTotal: number;
  total: number;
  formaPagamento:
    | "dinheiro"
    | "cartao_credito"
    | "cartao_debito"
    | "pix"
    | "transferencia";
  status: "pendente" | "pago" | "cancelado" | "reembolsado";
  observacoes?: string;
  vendedorId: number; // ID do vendedor/usuário
  vendedorNome: string; // Nome do vendedor (cópia para consulta rápida)
  createdAt: Date;
  updatedAt: Date;
}

// Schema do MongoDB
const ItemVendaSchema = new Schema<ItemVenda>(
  {
    produtoId: { type: Number, required: true },
    nome: { type: String, required: true },
    quantidade: { type: Number, required: true, min: 1 },
    precoUnitario: { type: Number, required: true, min: 0 },
    precoTotal: { type: Number, required: true, min: 0 },
    desconto: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const VendaSchema = new Schema<IVenda>(
  {
    clienteId: { type: Number, required: true },
    clienteNome: { type: String, required: true },
    clienteEmail: { type: String, required: true },
    itens: [ItemVendaSchema],
    subtotal: { type: Number, required: true, min: 0 },
    descontoTotal: { type: Number, default: 0, min: 0 },
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
      enum: ["pendente", "pago", "cancelado", "reembolsado"],
      default: "pendente",
    },
    observacoes: { type: String },
    vendedorId: { type: Number, required: true },
    vendedorNome: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "vendas",
  }
);

// Índices para melhor performance
VendaSchema.index({ clienteId: 1 });
VendaSchema.index({ vendedorId: 1 });
VendaSchema.index({ status: 1 });
VendaSchema.index({ createdAt: -1 });
VendaSchema.index({ "itens.produtoId": 1 });

// Middleware para calcular totais automaticamente
VendaSchema.pre("save", function (next) {
  // Calcular subtotal
  this.subtotal = this.itens.reduce((sum, item) => sum + item.precoTotal, 0);

  // Calcular desconto total
  this.descontoTotal = this.itens.reduce(
    (sum, item) => sum + (item.desconto || 0),
    0
  );

  // Calcular total final
  this.total = this.subtotal - this.descontoTotal;

  next();
});

export const Venda = mongoose.model<IVenda>("Venda", VendaSchema);

