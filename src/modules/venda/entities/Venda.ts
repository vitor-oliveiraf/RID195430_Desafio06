import mongoose, { Document, Schema } from "mongoose";

export interface ItemVenda {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface IVenda extends Document {
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  pedidoId: string; // ID do pedido relacionado
  itens: ItemVenda[];
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemVendaSchema = new Schema<ItemVenda>({
  produtoId: { type: Number, required: true },
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true, min: 1 },
  precoUnitario: { type: Number, required: true, min: 0 },
});

const VendaSchema = new Schema<IVenda>({
  clienteId: { type: Number, required: true },
  clienteNome: { type: String, required: true },
  clienteEmail: { type: String, required: true },
  pedidoId: { type: String, required: true },
  itens: [ItemVendaSchema],
  total: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pago", "cancelado", "reembolsado"],
    default: "pago",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware para calcular o total antes de salvar
VendaSchema.pre("save", function (next) {
  // Calcular total dos itens
  const total = this.itens.reduce((acc, item) => {
    return acc + item.quantidade * item.precoUnitario;
  }, 0);

  // Definir o total
  this.total = total;

  // Atualizar a data de modificação
  this.updatedAt = new Date();

  console.log(`💰 Calculando total da venda: ${total}`);
  next();
});

// Índices para performance
VendaSchema.index({ clienteId: 1 });
VendaSchema.index({ pedidoId: 1 });
VendaSchema.index({ status: 1 });
VendaSchema.index({ createdAt: -1 });

export const Venda = mongoose.model<IVenda>("Venda", VendaSchema);
