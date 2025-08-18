import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";
import { CreateUsuarioData, UpdateUsuarioData } from "../entities/Usuario";
import { response } from "../../../shared/utils/response";

export class UsuarioController {
  private usuarioService: UsuarioService;

  constructor() {
    this.usuarioService = new UsuarioService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, senha }: CreateUsuarioData = req.body;

      const usuario = await this.usuarioService.create({ nome, email, senha });

      response(res, 201, "Usuário criado com sucesso", usuario);
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

      const usuarioId = parseInt(id);

      if (isNaN(usuarioId)) {
        response(res, 400, "ID inválido");
        return;
      }

      const usuario = await this.usuarioService.findById(usuarioId);
      response(res, 200, "Usuário encontrado", usuario);
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }

  async findByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      if (!email) {
        response(res, 400, "Email é obrigatório");
        return;
      }

      const usuario = await this.usuarioService.findByEmail(email);
      response(res, 200, "Usuário encontrado", usuario);
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
      const usuarios = await this.usuarioService.findAll();
      response(res, 200, "Usuários listados com sucesso", usuarios);
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

      const usuarioId = parseInt(id);

      if (isNaN(usuarioId)) {
        response(res, 400, "ID inválido");
        return;
      }

      const data: UpdateUsuarioData = req.body;
      const usuario = await this.usuarioService.update(usuarioId, data);

      response(res, 200, "Usuário atualizado com sucesso", usuario);
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

      const usuarioId = parseInt(id);

      if (isNaN(usuarioId)) {
        response(res, 400, "ID inválido");
        return;
      }

      await this.usuarioService.delete(usuarioId);
      response(res, 200, "Usuário deletado com sucesso");
    } catch (error: any) {
      response(
        res,
        error.statusCode || 500,
        error.message || "Erro interno do servidor"
      );
    }
  }
}
