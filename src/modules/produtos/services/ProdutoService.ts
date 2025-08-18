import { ProdutoRepository } from "../repositories/ProdutoRepository";
import {
  CreateProdutoData,
  UpdateProdutoData,
  Produto,
} from "../entities/Produto";
import { AppError } from "../../../shared/errors/AppError";
import { ProdutoResponseDTO } from "../dtos/ProdutoResponseDTO";
import { CreateProdutoResponseDTO } from "../dtos/CreateProdutoDTO";
import { UpdateProdutoResponseDTO } from "../dtos/UpdateProdutoDTO";
import { EstoqueService } from "../../estoque/services/EstoqueService";
import { UsuarioRepository } from "../../usuario/repositories/UsuarioRepository";

export class ProdutoService {
  private produtoRepository: ProdutoRepository;
  private estoqueService: EstoqueService;
  private usuarioRepository: UsuarioRepository;
  constructor() {
    this.produtoRepository = new ProdutoRepository();
    this.estoqueService = new EstoqueService();
    this.usuarioRepository = new UsuarioRepository();
  }

  private mapToResponseDTO(produto: Produto): ProdutoResponseDTO {
    return {
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      createdAt: produto.createdAt,
      updatedAt: produto.updatedAt,
      usuarioId: produto.usuarioId,
    };
  }

  async create(data: CreateProdutoData): Promise<CreateProdutoResponseDTO> {
    // Verificar se o nome já existe
    const ProdutoExiste = await this.produtoRepository.findByNome(data.nome);
    if (ProdutoExiste) {
      throw new AppError("Nome já está em uso", 409);
    }

    const UsuarioExiste = await this.usuarioRepository.findById(data.usuarioId);
    if (!UsuarioExiste) {
      throw new AppError("Usuário não encontrado", 404);
    }

    // Criar o produto
    const produto = await this.produtoRepository.create({
      nome: data.nome,
      descricao: data.descricao,
      preco: data.preco,
      usuarioId: data.usuarioId,
    });

    // // Criar o estoque
    await this.estoqueService.create({
      produtoId: produto.id,
      quantidade: data.quantidade || 0,
    });

    const produtoComEstoque = await this.produtoRepository.findById(produto.id);
    return this.mapToResponseDTO(produtoComEstoque as Produto);
  }

  async findById(id: number): Promise<ProdutoResponseDTO> {
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }
    return this.mapToResponseDTO(produto);
  }

  async findByNome(nome: string): Promise<ProdutoResponseDTO> {
    const produto = await this.produtoRepository.findByNome(nome);
    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }
    return this.mapToResponseDTO(produto);
  }

  async findAll(): Promise<ProdutoResponseDTO[]> {
    const produtos = await this.produtoRepository.findAll();
    return produtos.map((produto) => this.mapToResponseDTO(produto));
  }

  async update(
    id: number,
    data: UpdateProdutoData
  ): Promise<UpdateProdutoResponseDTO> {
    // Verificar se o produto existe
    const existingProduto = await this.produtoRepository.findById(id);
    if (!existingProduto) {
      throw new AppError("Produto não encontrado", 404);
    }

    // Se estiver atualizando o nome, verificar se já existe
    if (data.nome && data.nome !== existingProduto.nome) {
      const nomeExists = await this.produtoRepository.findByNome(data.nome);
      if (nomeExists) {
        throw new AppError("Nome já está em uso", 409);
      }
    }

    // Se estiver atualizando o nome, verificar se é o mesmo nome atual
    if (data.nome === existingProduto.nome) {
      throw new AppError("Este é seu nome atual", 400);
    }

    const produto = await this.produtoRepository.update(id, data);
    return this.mapToResponseDTO(produto);
  }

  async delete(id: number): Promise<void> {
    // Verificar se o produto existe
    const existingProduto = await this.produtoRepository.findById(id);
    if (!existingProduto) {
      throw new AppError("Produto não encontrado", 404);
    }

    // Deletar o estoque
    await this.estoqueService.deleteByProdutoId(id);

    // Deletar o produto
    await this.produtoRepository.delete(id);
  }

  async disconnect(): Promise<void> {
    await this.produtoRepository.disconnect();
    await this.estoqueService.disconnect();
  }
}
