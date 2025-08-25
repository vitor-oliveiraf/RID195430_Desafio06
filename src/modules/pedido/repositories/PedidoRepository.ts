import { Pedido, IPedido } from "../entities/Pedido";

export class PedidoRepository {
  async create(data: any): Promise<IPedido> {
    try {
      const pedido = new Pedido(data);
      const savedPedido = await pedido.save();

      if (!savedPedido) {
        throw new Error("Erro ao salvar pedido no banco de dados");
      }

      return savedPedido;
    } catch (error) {
      console.error("Erro no repository ao criar pedido:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<IPedido | null> {
    return await Pedido.findById(id);
  }

  async findByClienteId(clienteId: number): Promise<IPedido[]> {
    return await Pedido.find({ clienteId }).sort({ createdAt: -1 });
  }

  async findByStatus(status: string): Promise<IPedido[]> {
    return await Pedido.find({ status }).sort({ createdAt: -1 });
  }

  async findAll(): Promise<IPedido[]> {
    return await Pedido.find().sort({ createdAt: -1 });
  }

  async updateStatus(id: string, status: string): Promise<IPedido | null> {
    return await Pedido.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IPedido[]> {
    return await Pedido.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });
  }

  async getPedidosByProduto(produtoId: number): Promise<IPedido[]> {
    return await Pedido.find({
      "itens.produtoId": produtoId,
    }).sort({ createdAt: -1 });
  }

  async getEstatisticasPedidos(startDate?: Date, endDate?: Date) {
    const matchStage: any = {};

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    return await Pedido.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPedidos: { $sum: 1 },
          totalReceita: { $sum: "$total" },
          mediaTicket: { $avg: "$total" },
          totalItens: { $sum: { $size: "$itens" } },
        },
      },
    ]);
  }

  async getPedidosPorStatus(startDate?: Date, endDate?: Date) {
    const matchStage: any = {};

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    return await Pedido.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          quantidade: { $sum: 1 },
          totalReceita: { $sum: "$total" },
        },
      },
      { $sort: { quantidade: -1 } },
    ]);
  }

  async getPedidosEmPreparo(): Promise<IPedido[]> {
    return await Pedido.find({
      status: { $in: ["confirmado", "preparando"] },
    }).sort({ createdAt: 1 });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Pedido.findByIdAndDelete(id);
    return result !== null;
  }

  async disconnect(): Promise<void> {
    // MongoDB connection é gerenciada globalmente
  }
}
