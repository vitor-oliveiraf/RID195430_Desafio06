import { Request, Response } from "express";
import { EstoqueService } from "../services/EstoqueService";
import { CreateEstoqueData, UpdateEstoqueData } from "../entities/Estoque";
import { response } from "../../../shared/utils/response";

export class EstoqueController {
  private estoqueService: EstoqueService;

  constructor() {
    this.estoqueService = new EstoqueService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { produtoId, quantidade }: CreateEstoqueData = req.body;

      const estoque = await this.estoqueService.create({
        produtoId,
        quantidade,
      });

      response(res, 201, "Estoque criado com sucesso", estoque);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        response(res, 400, "ID é obrigatório");
        return;
      }

      const estoqueId = parseInt(id);

      if (isNaN(estoqueId)) {
        response(res, 400, "ID inválido");
        return;
      }

      const estoque = await this.estoqueService.findById(estoqueId);
      response(res, 200, "Estoque encontrado", estoque);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const estoques = await this.estoqueService.findAll();
      response(res, 200, "Estoques listados com sucesso", estoques);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        response(res, 400, "ID é obrigatório");
        return;
      }

      const estoqueId = parseInt(id);

      if (isNaN(estoqueId)) {
        response(res, 400, "ID inválido");
        return;
      }

      const data: UpdateEstoqueData = req.body;
      const estoque = await this.estoqueService.update(estoqueId, data);

      response(res, 200, "Estoque atualizado com sucesso", estoque);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        response(res, 400, "ID é obrigatório");
        return;
      }

      const estoqueId = parseInt(id);

      if (isNaN(estoqueId)) {
        response(res, 400, "ID inválido");
        return;
      }

      await this.estoqueService.delete(estoqueId);
      response(res, 200, "Estoque deletado com sucesso");
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }
}
