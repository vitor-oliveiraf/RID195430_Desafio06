import { UsuarioRepository } from "../repositories/UsuarioRepository";
import {
  CreateUsuarioData,
  UpdateUsuarioData,
  Usuario,
} from "../entities/Usuario";
import { AppError } from "../../../shared/errors/AppError";
import { UsuarioResponseDTO } from "../dtos/UsuarioResponseDTO";
import { CreateUsuarioResponseDTO } from "../dtos/CreateUsuarioDTO";
import { UpdateUsuarioResponseDTO } from "../dtos/UpdateUsuarioDTO";

export class UsuarioService {
  private usuarioRepository: UsuarioRepository;

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  private mapToResponseDTO(usuario: Usuario): UsuarioResponseDTO {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    };
  }

  async create(data: CreateUsuarioData): Promise<CreateUsuarioResponseDTO> {
    // Verificar se o email já existe
    const existingUsuario = await this.usuarioRepository.findByEmail(
      data.email
    );
    if (existingUsuario) {
      throw new AppError("Email já está em uso", 409);
    }

    // Criar o usuário
    const usuario = await this.usuarioRepository.create(data);
    return this.mapToResponseDTO(usuario);
  }

  async findById(id: number): Promise<UsuarioResponseDTO> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return this.mapToResponseDTO(usuario);
  }

  async findByEmail(email: string): Promise<UsuarioResponseDTO> {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return this.mapToResponseDTO(usuario);
  }

  async findAll(): Promise<UsuarioResponseDTO[]> {
    const usuarios = await this.usuarioRepository.findAll();
    return usuarios.map((usuario) => this.mapToResponseDTO(usuario));
  }

  async update(
    id: number,
    data: UpdateUsuarioData
  ): Promise<UpdateUsuarioResponseDTO> {
    // Verificar se o usuário existe
    const existingUsuario = await this.usuarioRepository.findById(id);
    if (!existingUsuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    // Se estiver atualizando o email, verificar se já existe
    if (data.email && data.email !== existingUsuario.email) {
      const emailExists = await this.usuarioRepository.findByEmail(data.email);
      if (emailExists) {
        throw new AppError("Email já está em uso", 409);
      }
    }

    // Se estiver atualizando o email, verificar se é o mesmo email atual
    if (data.email === existingUsuario.email) {
      throw new AppError("Este é seu email atual", 400);
    }

    const usuario = await this.usuarioRepository.update(id, data);
    return this.mapToResponseDTO(usuario);
  }

  async delete(id: number): Promise<void> {
    // Verificar se o usuário existe
    const existingUsuario = await this.usuarioRepository.findById(id);
    if (!existingUsuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    await this.usuarioRepository.delete(id);
  }

  async disconnect(): Promise<void> {
    await this.usuarioRepository.disconnect();
  }
}
