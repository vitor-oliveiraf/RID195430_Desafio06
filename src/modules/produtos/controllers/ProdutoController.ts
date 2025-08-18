import { Request, Response } from "express";
import { ProdutoService } from "../services/ProdutoService";
import { CreateProdutoData, UpdateProdutoData } from "../entities/Produto";
import { response } from "../../../shared/utils/response";

export class ProdutoController {
  private produtoService: ProdutoService;

  constructor() {
    this.produtoService = new ProdutoService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        nome,
        descricao,
        preco,
        quantidade,
        usuarioId,
      }: CreateProdutoData = req.body;

      const produto = await this.produtoService.create({
        nome,
        descricao,
        preco,
        quantidade,
        usuarioId,
      });

      response(res, 201, "Produto criado com sucesso", produto);
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

      const produtoId = parseInt(id);

      if (isNaN(produtoId)) {
        response(res, 400, "ID inválido");
        return;
      }

      const produto = await this.produtoService.findById(produtoId);
      response(res, 200, "Produto encontrado", produto);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  async findByNome(req: Request, res: Response): Promise<void> {
    try {
      const { nome } = req.params;

      if (!nome) {
        response(res, 400, "Informe o nome do produto");
        return;
      }

      const produto = await this.produtoService.findByNome(nome);
      response(res, 200, "Produto encontrado", produto);
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
      const produtos = await this.produtoService.findAll();
      response(res, 200, "Produtos listados com sucesso", produtos);
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

      const produtoId = parseInt(id);

      if (isNaN(produtoId)) {
        response(res, 400, "ID inválido");
        return;
      }

      const data: UpdateProdutoData = req.body;
      const produto = await this.produtoService.update(produtoId, data);

      response(res, 200, "Produto atualizado com sucesso", produto);
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

      const produtoId = parseInt(id);

      if (isNaN(produtoId)) {
        response(res, 400, "ID inválido");
        return;
      }

      await this.produtoService.delete(produtoId);
      response(res, 200, "Produto deletado com sucesso");
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }
}
