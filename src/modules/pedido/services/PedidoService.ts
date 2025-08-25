import { PedidoRepository } from "../repositories/PedidoRepository";
import {
  CreatePedidoSimpleDTO,
  CreatePedidoResponseDTO,
} from "../dtos/CreatePedidoDTO";
import { IPedido } from "../entities/Pedido";
import { AppError } from "../../../shared/errors/AppError";
import { PrismaClient } from "@prisma/client";

export class PedidoService {
  private pedidoRepository: PedidoRepository;
  private prisma: PrismaClient;

  constructor() {
    this.pedidoRepository = new PedidoRepository();
    this.prisma = new PrismaClient();
  }

  // Mapear pedido para DTO de resposta
  private mapToResponseDTO(pedido: IPedido): CreatePedidoResponseDTO {
    return {
      id: String(pedido._id || ""),
      clienteId: pedido.clienteId,
      clienteNome: pedido.clienteNome,
      clienteEmail: pedido.clienteEmail,
      itens: pedido.itens.map((item) => ({
        produtoId: item.produtoId,
        nome: item.nome,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
      total: pedido.total,
      status: pedido.status,
      createdAt: pedido.createdAt,
      updatedAt: pedido.updatedAt,
    };
  }

  // Criar novo pedido
  async create(data: CreatePedidoSimpleDTO): Promise<CreatePedidoResponseDTO> {
    try {
      // 1. Validar se cliente existe e buscar dados
      const cliente = await this.prisma.usuario.findUnique({
        where: { id: data.clienteId },
      });

      if (!cliente) {
        throw new AppError("Cliente não encontrado", 404);
      }

      // pegar dados do produto para mapToResponseDTO
      const produtos = await this.prisma.produto.findMany({
        where: { id: { in: data.itens.map((item) => item.produtoId) } },
      });

      // 2. Validar estoque e produtos
      await this.validarEstoque(data.itens);

      // 3. Preparar dados do pedido com informações do cliente
      const pedidoData = {
        ...data,
        clienteNome: cliente.nome,
        clienteEmail: cliente.email,
      };

      // 4. Criar pedido
      const pedido = await this.pedidoRepository.create(pedidoData);

      // 5. Atualizar estoque (debitar produtos)
      await this.atualizarEstoque(data.itens, "debitar");

      const responseDTO = this.mapToResponseDTO(pedido);

      // Verificar se o ID foi gerado corretamente
      if (!responseDTO.id) {
        console.error("ID não foi gerado para o pedido:", pedido);
        throw new AppError("Erro interno: ID não foi gerado", 500);
      }

      return responseDTO;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao criar pedido", 500);
    }
  }

  // Buscar pedido por ID
  async findById(id: string): Promise<CreatePedidoResponseDTO> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404);
    }
    return this.mapToResponseDTO(pedido);
  }

  // Buscar pedidos por cliente
  async findByClienteId(clienteId: number): Promise<CreatePedidoResponseDTO[]> {
    const pedidos = await this.pedidoRepository.findByClienteId(clienteId);
    return pedidos.map((pedido) => this.mapToResponseDTO(pedido));
  }

  // Buscar pedidos por status
  async findByStatus(status: string): Promise<CreatePedidoResponseDTO[]> {
    const pedidos = await this.pedidoRepository.findByStatus(status);
    return pedidos.map((pedido) => this.mapToResponseDTO(pedido));
  }

  // Buscar todos os pedidos
  async findAll(): Promise<CreatePedidoResponseDTO[]> {
    const pedidos = await this.pedidoRepository.findAll();
    return pedidos.map((pedido) => this.mapToResponseDTO(pedido));
  }

  // Atualizar status do pedido
  async updateStatus(
    id: string,
    novoStatus: string
  ): Promise<CreatePedidoResponseDTO> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // Validar transição de status
    this.validarTransicaoStatus(pedido.status, novoStatus);

    // Aplicar regras específicas por status
    await this.aplicarRegrasStatus(pedido, novoStatus);

    // Atualizar status
    const pedidoAtualizado = await this.pedidoRepository.updateStatus(
      id,
      novoStatus
    );
    if (!pedidoAtualizado) {
      throw new AppError("Erro ao atualizar status do pedido", 500);
    }

    return this.mapToResponseDTO(pedidoAtualizado);
  }

  // Cancelar pedido
  async cancelarPedido(
    id: string,
    motivo: string
  ): Promise<CreatePedidoResponseDTO> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // Só pode cancelar pedidos que não foram entregues
    if (pedido.status === "entregue") {
      throw new AppError("Não é possível cancelar pedidos já entregues", 400);
    }

    // Recreditar estoque
    await this.atualizarEstoque(pedido.itens, "recreditar");

    // Atualizar pedido
    const pedidoCancelado = await this.pedidoRepository.updateStatus(
      id,
      "cancelado"
    );
    if (!pedidoCancelado) {
      throw new AppError("Erro ao cancelar pedido", 500);
    }

    return this.mapToResponseDTO(pedidoCancelado);
  }

  // Buscar pedidos por período
  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<CreatePedidoResponseDTO[]> {
    const pedidos = await this.pedidoRepository.findByDateRange(
      startDate,
      endDate
    );
    return pedidos.map((pedido) => this.mapToResponseDTO(pedido));
  }

  // Buscar pedidos por produto
  async findByProduto(produtoId: number): Promise<CreatePedidoResponseDTO[]> {
    const pedidos = await this.pedidoRepository.getPedidosByProduto(produtoId);
    return pedidos.map((pedido) => this.mapToResponseDTO(pedido));
  }

  // Obter estatísticas de pedidos
  async getEstatisticas(startDate?: Date, endDate?: Date) {
    return await this.pedidoRepository.getEstatisticasPedidos(
      startDate,
      endDate
    );
  }

  // Obter pedidos por status
  async getPedidosPorStatus(startDate?: Date, endDate?: Date) {
    return await this.pedidoRepository.getPedidosPorStatus(startDate, endDate);
  }

  // Obter pedidos em preparo
  async getPedidosEmPreparo(): Promise<CreatePedidoResponseDTO[]> {
    const pedidos = await this.pedidoRepository.getPedidosEmPreparo();
    return pedidos.map((pedido) => this.mapToResponseDTO(pedido));
  }

  // Validar estoque disponível
  private async validarEstoque(itens: any[]): Promise<void> {
    for (const item of itens) {
      // 1. Validar se o produto existe na tabela de produtos
      const produto = await this.prisma.produto.findUnique({
        where: { id: item.produtoId },
      });

      if (!produto) {
        throw new AppError(
          `Produto com ID ${item.produtoId} não encontrado`,
          404
        );
      }

      // 2. Validar se o produto existe no estoque
      const estoque = await this.prisma.estoque.findFirst({
        where: { produtoId: item.produtoId },
      });

      if (!estoque) {
        throw new AppError(
          `Produto ${produto.nome} não encontrado no estoque`,
          404
        );
      }

      // 3. Validar se há quantidade disponível (maior que zero)
      if (estoque.quantidade <= 0) {
        throw new AppError(
          `Produto ${produto.nome} está sem estoque (quantidade: ${estoque.quantidade})`,
          400
        );
      }

      // 4. Validar se há quantidade suficiente
      if (estoque.quantidade < item.quantidade) {
        throw new AppError(
          `Quantidade insuficiente do produto ${produto.nome}. Disponível: ${estoque.quantidade}, Solicitado: ${item.quantidade}`,
          400
        );
      }

      // 5. Validar se a quantidade solicitada é válida
      if (item.quantidade <= 0) {
        throw new AppError(
          `Quantidade inválida para o produto ${produto.nome}. Deve ser maior que zero.`,
          400
        );
      }

      console.log(
        `✅ Produto ${produto.nome} validado: ${item.quantidade}/${estoque.quantidade}`
      );
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
      recebido: ["confirmado", "cancelado"],
      confirmado: ["preparando", "cancelado"],
      preparando: ["pronto", "cancelado"],
      pronto: ["entregue", "cancelado"],
      entregue: [], // Não pode mudar
      vendido: [], // Não pode mudar (status definido automaticamente)
      cancelado: [], // Não pode mudar
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
    pedido: IPedido,
    novoStatus: string
  ): Promise<void> {
    switch (novoStatus) {
      case "confirmado":
        // Pedido confirmado - estoque já foi debitado na criação
        break;

      case "preparando":
        // Pedido em preparo - iniciar contagem de tempo
        break;

      case "pronto":
        // Pedido pronto - notificar cliente
        break;

      case "entregue":
        // Pedido entregue - finalizar processo
        break;

      case "cancelado":
        // Pedido cancelado - estoque será recreditado no método cancelarPedido
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
