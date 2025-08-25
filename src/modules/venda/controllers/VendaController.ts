import { Request, Response } from "express";
import { VendaService } from "../services/VendaService";
import {
  CreateVendaDTO,
  CreateVendaFromPedidoDTO,
} from "../dtos/CreateVendaDTO";
import { response } from "../../../shared/utils/response";

export class VendaController {
  private vendaService: VendaService;

  constructor() {
    this.vendaService = new VendaService();
  }

  // Criar nova venda
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateVendaDTO = req.body;
      const venda = await this.vendaService.create(data);

      response(res, 201, "Venda criada com sucesso", venda);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Criar venda a partir de um pedido
  async createFromPedido(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateVendaFromPedidoDTO = req.body;
      const venda = await this.vendaService.createFromPedido(data.pedidoId);
      response(res, 201, "Venda criada a partir do pedido com sucesso", venda);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar venda por ID
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        response(res, 400, "ID da venda é obrigatório");
        return;
      }

      const venda = await this.vendaService.findById(id);
      response(res, 200, "Venda encontrada", venda);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar vendas por cliente
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

      const vendas = await this.vendaService.findByClienteId(clienteIdNum);
      response(res, 200, "Vendas do cliente encontradas", vendas);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar vendas por pedido
  async findByPedidoId(req: Request, res: Response): Promise<void> {
    try {
      const { pedidoId } = req.params;

      if (!pedidoId) {
        response(res, 400, "ID do pedido é obrigatório");
        return;
      }

      const vendas = await this.vendaService.findByPedidoId(pedidoId);
      response(res, 200, "Vendas do pedido encontradas", vendas);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar vendas por status
  async findByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;

      if (!status) {
        response(res, 400, "Status é obrigatório");
        return;
      }

      const vendas = await this.vendaService.findByStatus(status);
      response(res, 200, `Vendas com status '${status}' encontradas`, vendas);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar todas as vendas
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const vendas = await this.vendaService.findAll();
      response(res, 200, "Vendas listadas com sucesso", vendas);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Atualizar status da venda
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        response(res, 400, "ID da venda é obrigatório");
        return;
      }

      if (!status) {
        response(res, 400, "Novo status é obrigatório");
        return;
      }

      const venda = await this.vendaService.updateStatus(id, status);
      response(res, 200, `Status da venda atualizado para '${status}'`, venda);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Cancelar venda
  async cancelarVenda(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      if (!id) {
        response(res, 400, "ID da venda é obrigatório");
        return;
      }

      if (!motivo) {
        response(res, 400, "Motivo do cancelamento é obrigatório");
        return;
      }

      const venda = await this.vendaService.cancelarVenda(id, motivo);
      response(res, 200, "Venda cancelada com sucesso", venda);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Reembolsar venda
  async reembolsarVenda(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      if (!id) {
        response(res, 400, "ID da venda é obrigatório");
        return;
      }

      if (!motivo) {
        response(res, 400, "Motivo do reembolso é obrigatório");
        return;
      }

      const venda = await this.vendaService.reembolsarVenda(id, motivo);
      response(res, 200, "Venda reembolsada com sucesso", venda);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar vendas por período
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

      const vendas = await this.vendaService.findByDateRange(start, end);
      response(res, 200, "Vendas do período encontradas", vendas);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  // Buscar vendas por produto
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

      const vendas = await this.vendaService.findByProduto(produtoIdNum);
      response(res, 200, "Vendas do produto encontradas", vendas);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }
}
