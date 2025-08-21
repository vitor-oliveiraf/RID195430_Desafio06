import { Request, Response } from "express";
import { PedidoService } from "../services/PedidoService";
import { CreatePedidoDTO } from "../dtos/CreatePedidoDTO";
import { response } from "../../../shared/utils/response";

export class PedidoController {
  private pedidoService: PedidoService;

  constructor() {
    this.pedidoService = new PedidoService();
  }

  // Criar novo pedido
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreatePedidoDTO = req.body;
      const pedido = await this.pedidoService.create(data);

      response(res, 201, "Pedido criado com sucesso", pedido);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar pedido por ID
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        response(res, 400, "ID do pedido é obrigatório");
        return;
      }

      const pedido = await this.pedidoService.findById(id);
      response(res, 200, "Pedido encontrado", pedido);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar pedidos por cliente
  async findByClienteId(req: Request, res: Response): Promise<void> {
    try {
      const { clienteId } = req.params;

      if (!clienteId) {
        response(res, 400, "ID do cliente é obrigatório");
        return;
      }

      const clienteIdNum = parseInt(clienteId);
      if (isNaN(clienteIdNum)) {
        response(res, 400, "ID do cliente deve ser um número válido");
        return;
      }

      const pedidos = await this.pedidoService.findByClienteId(clienteIdNum);
      response(res, 200, "Pedidos do cliente encontrados", pedidos);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar pedidos por vendedor
  async findByVendedorId(req: Request, res: Response): Promise<void> {
    try {
      const { vendedorId } = req.params;

      if (!vendedorId) {
        response(res, 400, "ID do vendedor é obrigatório");
        return;
      }

      const vendedorIdNum = parseInt(vendedorId);
      if (isNaN(vendedorIdNum)) {
        response(res, 400, "ID do vendedor deve ser um número válido");
        return;
      }

      const pedidos = await this.pedidoService.findByVendedorId(vendedorIdNum);
      response(res, 200, "Pedidos do vendedor encontrados", pedidos);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar pedidos por status
  async findByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;

      if (!status) {
        response(res, 400, "Status é obrigatório");
        return;
      }

      const pedidos = await this.pedidoService.findByStatus(status);
      response(res, 200, `Pedidos com status '${status}' encontrados`, pedidos);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar pedidos por tipo de entrega
  async findByTipoEntrega(req: Request, res: Response): Promise<void> {
    try {
      const { tipoEntrega } = req.params;

      if (!tipoEntrega) {
        response(res, 400, "Tipo de entrega é obrigatório");
        return;
      }

      const pedidos = await this.pedidoService.findByTipoEntrega(tipoEntrega);
      response(
        res,
        200,
        `Pedidos com tipo de entrega '${tipoEntrega}' encontrados`,
        pedidos
      );
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar todos os pedidos
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await this.pedidoService.findAll();
      response(res, 200, "Pedidos listados com sucesso", pedidos);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Atualizar status do pedido
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        response(res, 400, "ID do pedido é obrigatório");
        return;
      }

      if (!status) {
        response(res, 400, "Novo status é obrigatório");
        return;
      }

      const pedido = await this.pedidoService.updateStatus(id, status);
      response(
        res,
        200,
        `Status do pedido atualizado para '${status}'`,
        pedido
      );
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Atualizar tempo estimado
  async updateTempoEstimado(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { tempoEstimado } = req.body;

      if (!id) {
        response(res, 400, "ID do pedido é obrigatório");
        return;
      }

      if (!tempoEstimado) {
        response(res, 400, "Tempo estimado é obrigatório");
        return;
      }

      const tempoEstimadoNum = parseInt(tempoEstimado);
      if (isNaN(tempoEstimadoNum) || tempoEstimadoNum <= 0) {
        response(res, 400, "Tempo estimado deve ser um número positivo");
        return;
      }

      const pedido = await this.pedidoService.updateTempoEstimado(
        id,
        tempoEstimadoNum
      );
      response(res, 200, "Tempo estimado atualizado com sucesso", pedido);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Cancelar pedido
  async cancelarPedido(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      if (!id) {
        response(res, 400, "ID do pedido é obrigatório");
        return;
      }

      if (!motivo) {
        response(res, 400, "Motivo do cancelamento é obrigatório");
        return;
      }

      const pedido = await this.pedidoService.cancelarPedido(id, motivo);
      response(res, 200, "Pedido cancelado com sucesso", pedido);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar pedidos por período
  async findByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        response(res, 400, "Data inicial e final são obrigatórias");
        return;
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        response(res, 400, "Datas devem estar no formato válido");
        return;
      }

      if (start > end) {
        response(res, 400, "Data inicial deve ser menor que a data final");
        return;
      }

      const pedidos = await this.pedidoService.findByDateRange(start, end);
      response(res, 200, "Pedidos do período encontrados", pedidos);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar pedidos por produto
  async findByProduto(req: Request, res: Response): Promise<void> {
    try {
      const { produtoId } = req.params;

      if (!produtoId) {
        response(res, 400, "ID do produto é obrigatório");
        return;
      }

      const produtoIdNum = parseInt(produtoId);
      if (isNaN(produtoIdNum)) {
        response(res, 400, "ID do produto deve ser um número válido");
        return;
      }

      const pedidos = await this.pedidoService.findByProduto(produtoIdNum);
      response(res, 200, "Pedidos do produto encontrados", pedidos);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Obter estatísticas de pedidos
  async getEstatisticas(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      let start: Date | undefined;
      let end: Date | undefined;

      if (startDate && endDate) {
        start = new Date(startDate as string);
        end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          response(res, 400, "Datas devem estar no formato válido");
          return;
        }

        if (start > end) {
          response(res, 400, "Data inicial deve ser menor que a data final");
          return;
        }
      }

      const estatisticas = await this.pedidoService.getEstatisticas(start, end);
      response(res, 200, "Estatísticas de pedidos obtidas", estatisticas);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Obter pedidos por status
  async getPedidosPorStatus(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      let start: Date | undefined;
      let end: Date | undefined;

      if (startDate && endDate) {
        start = new Date(startDate as string);
        end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          response(res, 400, "Datas devem estar no formato válido");
          return;
        }

        if (start > end) {
          response(res, 400, "Data inicial deve ser menor que a data final");
          return;
        }
      }

      const pedidosPorStatus = await this.pedidoService.getPedidosPorStatus(
        start,
        end
      );
      response(res, 200, "Pedidos por status obtidos", pedidosPorStatus);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Obter pedidos urgentes
  async getPedidosUrgentes(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await this.pedidoService.getPedidosUrgentes();
      response(res, 200, "Pedidos urgentes encontrados", pedidos);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Obter pedidos em preparo
  async getPedidosEmPreparo(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await this.pedidoService.getPedidosEmPreparo();
      response(res, 200, "Pedidos em preparo encontrados", pedidos);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }
}
