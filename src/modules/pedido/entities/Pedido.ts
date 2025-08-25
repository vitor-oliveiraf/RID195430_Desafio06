import mongoose, { Document, Schema } from "mongoose";

export interface ItemPedido {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface IPedido extends Document {
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  itens: ItemPedido[];
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemPedidoSchema = new Schema<ItemPedido>({
  produtoId: { type: Number, required: true },
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true, min: 1 },
  precoUnitario: { type: Number, required: true, min: 0 },
});

const PedidoSchema = new Schema<IPedido>({
  clienteId: { type: Number, required: true },
  clienteNome: { type: String, required: true },
  clienteEmail: { type: String, required: true },
  itens: [ItemPedidoSchema],
  total: { type: Number, default: 0 },
  status: {
    type: String,
    enum: [
      "recebido",
      "confirmado",
      "preparando",
      "pronto",
      "entregue",
      "vendido",
      "cancelado",
    ],
    default: "recebido",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware para calcular o total antes de salvar
PedidoSchema.pre("save", function (next) {
  // Calcular total dos itens
  const total = this.itens.reduce((acc, item) => {
    return acc + item.quantidade * item.precoUnitario;
  }, 0);

  // Definir o total
  this.total = total;

  // Atualizar a data de modificação
  this.updatedAt = new Date();

  console.log(`💰 Calculando total do pedido: ${total}`);
  next();
});

// Índices para performance
PedidoSchema.index({ clienteId: 1 });
PedidoSchema.index({ status: 1 });
PedidoSchema.index({ createdAt: -1 });

export const Pedido = mongoose.model<IPedido>("Pedido", PedidoSchema);
