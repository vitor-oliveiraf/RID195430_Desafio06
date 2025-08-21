import { Venda, IVenda } from "../entities/Venda";
import { CreateVendaDTO } from "../dtos/CreateVendaDTO";

export class VendaRepository {
  async create(data: CreateVendaDTO): Promise<IVenda> {
    try {
      // Calcular preços totais dos itens
      const itensComPrecoTotal = data.itens.map((item) => ({
        ...item,
        precoTotal: item.quantidade * item.precoUnitario - (item.desconto || 0),
      }));

      const venda = new Venda({
        ...data,
        itens: itensComPrecoTotal,
      });

      const savedVenda = await venda.save();

      if (!savedVenda) {
        throw new Error("Erro ao salvar venda no banco de dados");
      }

      return savedVenda;
    } catch (error) {
      console.error("Erro no repository ao criar venda:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<IVenda | null> {
    return await Venda.findById(id);
  }

  async findByClienteId(clienteId: number): Promise<IVenda[]> {
    return await Venda.find({ clienteId }).sort({ createdAt: -1 });
  }

  async findByVendedorId(vendedorId: number): Promise<IVenda[]> {
    return await Venda.find({ vendedorId }).sort({ createdAt: -1 });
  }

  async findByStatus(status: string): Promise<IVenda[]> {
    return await Venda.find({ status }).sort({ createdAt: -1 });
  }

  async findAll(): Promise<IVenda[]> {
    return await Venda.find().sort({ createdAt: -1 });
  }

  async updateStatus(id: string, status: string): Promise<IVenda | null> {
    return await Venda.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IVenda[]> {
    return await Venda.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });
  }

  async getVendasByProduto(produtoId: number): Promise<IVenda[]> {
    return await Venda.find({
      "itens.produtoId": produtoId,
    }).sort({ createdAt: -1 });
  }

  async getEstatisticasVendas(startDate?: Date, endDate?: Date) {
    const matchStage: any = {};

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    return await Venda.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalVendas: { $sum: 1 },
          totalReceita: { $sum: "$total" },
          mediaTicket: { $avg: "$total" },
          totalItens: { $sum: { $size: "$itens" } },
        },
      },
    ]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await Venda.findByIdAndDelete(id);
    return result !== null;
  }

  async disconnect(): Promise<void> {
    // MongoDB connection é gerenciada globalmente
  }
}
