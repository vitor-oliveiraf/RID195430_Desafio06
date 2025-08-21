import { VendaRepository } from "../repositories/VendaRepository";
import { CreateVendaDTO, CreateVendaResponseDTO } from "../dtos/CreateVendaDTO";
import { IVenda } from "../entities/Venda";
import { AppError } from "../../../shared/errors/AppError";
import { PrismaClient } from "@prisma/client";

export class VendaService {
  private vendaRepository: VendaRepository;
  private prisma: PrismaClient;

  constructor() {
    this.vendaRepository = new VendaRepository();
    this.prisma = new PrismaClient();
  }

  // Mapear venda para DTO de resposta
  private mapToResponseDTO(venda: IVenda): CreateVendaResponseDTO {
    return {
      id: String(venda._id || ""),
      clienteId: venda.clienteId,
      clienteNome: venda.clienteNome,
      clienteEmail: venda.clienteEmail,
      itens: venda.itens.map((item) => ({
        produtoId: item.produtoId,
        nome: item.nome,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        precoTotal: item.precoTotal,
        desconto: item.desconto,
      })),
      subtotal: venda.subtotal,
      descontoTotal: venda.descontoTotal,
      total: venda.total,
      formaPagamento: venda.formaPagamento,
      status: venda.status,
      observacoes: venda.observacoes,
      vendedorId: venda.vendedorId,
      vendedorNome: venda.vendedorNome,
      createdAt: venda.createdAt,
      updatedAt: venda.updatedAt,
    };
  }

  // Criar nova venda
  async create(data: CreateVendaDTO): Promise<CreateVendaResponseDTO> {
    try {
      // 1. Validar se cliente existe
      const cliente = await this.prisma.usuario.findUnique({
        where: { id: data.clienteId },
      });

      if (!cliente) {
        throw new AppError("Cliente não encontrado", 404);
      }

      // 2. Validar se vendedor existe
      const vendedor = await this.prisma.usuario.findUnique({
        where: { id: data.vendedorId },
      });

      if (!vendedor) {
        throw new AppError("Vendedor não encontrado", 404);
      }

      // 3. Validar estoque e produtos
      await this.validarEstoque(data.itens);

      // 4. Criar venda
      const venda = await this.vendaRepository.create(data);

      // 5. Atualizar estoque (debitar produtos)
      await this.atualizarEstoque(data.itens, "debitar");

      const responseDTO = this.mapToResponseDTO(venda);

      // Verificar se o ID foi gerado corretamente
      if (!responseDTO.id) {
        console.error("ID não foi gerado para a venda:", venda);
        throw new AppError("Erro interno: ID não foi gerado", 500);
      }

      return responseDTO;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao criar venda", 500);
    }
  }

  // Buscar venda por ID
  async findById(id: string): Promise<CreateVendaResponseDTO> {
    const venda = await this.vendaRepository.findById(id);
    if (!venda) {
      throw new AppError("Venda não encontrada", 404);
    }
    return this.mapToResponseDTO(venda);
  }

  // Buscar vendas por cliente
  async findByClienteId(clienteId: number): Promise<CreateVendaResponseDTO[]> {
    const vendas = await this.vendaRepository.findByClienteId(clienteId);
    return vendas.map((venda) => this.mapToResponseDTO(venda));
  }

  // Buscar vendas por vendedor
  async findByVendedorId(
    vendedorId: number
  ): Promise<CreateVendaResponseDTO[]> {
    const vendas = await this.vendaRepository.findByVendedorId(vendedorId);
    return vendas.map((venda) => this.mapToResponseDTO(venda));
  }

  // Buscar vendas por status
  async findByStatus(status: string): Promise<CreateVendaResponseDTO[]> {
    const vendas = await this.vendaRepository.findByStatus(status);
    return vendas.map((venda) => this.mapToResponseDTO(venda));
  }

  // Buscar todas as vendas
  async findAll(): Promise<CreateVendaResponseDTO[]> {
    const vendas = await this.vendaRepository.findAll();
    return vendas.map((venda) => this.mapToResponseDTO(venda));
  }

  // Atualizar status da venda
  async updateStatus(
    id: string,
    novoStatus: string
  ): Promise<CreateVendaResponseDTO> {
    const venda = await this.vendaRepository.findById(id);
    if (!venda) {
      throw new AppError("Venda não encontrada", 404);
    }

    // Validar transição de status
    this.validarTransicaoStatus(venda.status, novoStatus);

    // Aplicar regras específicas por status
    await this.aplicarRegrasStatus(venda, novoStatus);

    // Atualizar status
    const vendaAtualizada = await this.vendaRepository.updateStatus(
      id,
      novoStatus
    );
    if (!vendaAtualizada) {
      throw new AppError("Erro ao atualizar status da venda", 500);
    }

    return this.mapToResponseDTO(vendaAtualizada);
  }

  // Cancelar venda
  async cancelarVenda(
    id: string,
    motivo: string
  ): Promise<CreateVendaResponseDTO> {
    const venda = await this.vendaRepository.findById(id);
    if (!venda) {
      throw new AppError("Venda não encontrada", 404);
    }

    // Só pode cancelar vendas pendentes
    if (venda.status !== "pendente") {
      throw new AppError("Só é possível cancelar vendas pendentes", 400);
    }

    // Recreditar estoque
    await this.atualizarEstoque(venda.itens, "recreditar");

    // Atualizar venda com motivo do cancelamento
    const vendaCancelada = await this.vendaRepository.updateStatus(
      id,
      "cancelado"
    );
    if (!vendaCancelada) {
      throw new AppError("Erro ao cancelar venda", 500);
    }

    return this.mapToResponseDTO(vendaCancelada);
  }

  // Reembolsar venda
  async reembolsarVenda(
    id: string,
    motivo: string
  ): Promise<CreateVendaResponseDTO> {
    const venda = await this.vendaRepository.findById(id);
    if (!venda) {
      throw new AppError("Venda não encontrada", 404);
    }

    // Só pode reembolsar vendas pagas
    if (venda.status !== "pago") {
      throw new AppError("Só é possível reembolsar vendas pagas", 400);
    }

    // Recreditar estoque
    await this.atualizarEstoque(venda.itens, "recreditar");

    // Atualizar venda
    const vendaReembolsada = await this.vendaRepository.updateStatus(
      id,
      "reembolsado"
    );
    if (!vendaReembolsada) {
      throw new AppError("Erro ao reembolsar venda", 500);
    }

    return this.mapToResponseDTO(vendaReembolsada);
  }

  // Buscar vendas por período
  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<CreateVendaResponseDTO[]> {
    const vendas = await this.vendaRepository.findByDateRange(
      startDate,
      endDate
    );
    return vendas.map((venda) => this.mapToResponseDTO(venda));
  }

  // Buscar vendas por produto
  async findByProduto(produtoId: number): Promise<CreateVendaResponseDTO[]> {
    const vendas = await this.vendaRepository.getVendasByProduto(produtoId);
    return vendas.map((venda) => this.mapToResponseDTO(venda));
  }

  // Obter estatísticas de vendas
  async getEstatisticas(startDate?: Date, endDate?: Date) {
    return await this.vendaRepository.getEstatisticasVendas(startDate, endDate);
  }

  // Validar estoque disponível
  private async validarEstoque(itens: any[]): Promise<void> {
    for (const item of itens) {
      const estoque = await this.prisma.estoque.findFirst({
        where: { produtoId: item.produtoId },
      });

      if (!estoque) {
        throw new AppError(
          `Produto ${item.nome} não encontrado no estoque`,
          404
        );
      }

      if (estoque.quantidade < item.quantidade) {
        throw new AppError(
          `Quantidade insuficiente do produto ${item.nome}. Disponível: ${estoque.quantidade}`,
          400
        );
      }
    }
  }

  // Atualizar estoque (debitar ou recreditar)
  private async atualizarEstoque(
    itens: any[],
    operacao: "debitar" | "recreditar"
  ): Promise<void> {
    for (const item of itens) {
      const estoque = await this.prisma.estoque.findFirst({
        where: { produtoId: item.produtoId },
      });

      if (estoque) {
        const novaQuantidade =
          operacao === "debitar"
            ? estoque.quantidade - item.quantidade
            : estoque.quantidade + item.quantidade;

        await this.prisma.estoque.update({
          where: { id: estoque.id },
          data: { quantidade: novaQuantidade },
        });
      }
    }
  }

  // Validar transição de status
  private validarTransicaoStatus(
    statusAtual: string,
    novoStatus: string
  ): void {
    const transicoesValidas: { [key: string]: string[] } = {
      pendente: ["pago", "cancelado"],
      pago: ["reembolsado"],
      cancelado: [], // Não pode mudar
      reembolsado: [], // Não pode mudar
    };

    const transicoesPermitidas = transicoesValidas[statusAtual] || [];

    if (!transicoesPermitidas.includes(novoStatus)) {
      throw new AppError(
        `Transição de status inválida: ${statusAtual} → ${novoStatus}`,
        400
      );
    }
  }

  // Aplicar regras específicas por status
  private async aplicarRegrasStatus(
    venda: IVenda,
    novoStatus: string
  ): Promise<void> {
    switch (novoStatus) {
      case "pago":
        // Venda paga - estoque já foi debitado na criação
        break;

      case "cancelado":
        // Venda cancelada - estoque será recreditado no método cancelarVenda
        break;

      case "reembolsado":
        // Venda reembolsada - estoque será recreditado no método reembolsarVenda
        break;

      default:
        throw new AppError(`Status não suportado: ${novoStatus}`, 400);
    }
  }

  // Desconectar do banco
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
