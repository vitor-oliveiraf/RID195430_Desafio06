import { EstoqueRepository } from "../repositories/EstoqueRepository";
import {
  CreateEstoqueData,
  UpdateEstoqueData,
  Estoque,
} from "../entities/Estoque";
import { AppError } from "../../../shared/errors/AppError";
import { EstoqueResponseDTO } from "../dtos/EstoqueResponseDTO";
import { CreateEstoqueResponseDTO } from "../dtos/CreateEstoqueDTO";
import { UpdateEstoqueResponseDTO } from "../dtos/UpdateEstoqueDTO";
import { ProdutoRepository } from "../../produtos/repositories/ProdutoRepository";

export class EstoqueService {
  private estoqueRepository: EstoqueRepository;
  private produtoRepository: ProdutoRepository;

  constructor() {
    this.estoqueRepository = new EstoqueRepository();
    this.produtoRepository = new ProdutoRepository();
  }

  private mapToResponseDTO(estoque: Estoque): EstoqueResponseDTO {
    return {
      id: estoque.id,
      produtoId: estoque.produtoId,
      quantidade: estoque.quantidade,
      createdAt: estoque.createdAt,
      updatedAt: estoque.updatedAt,
    };
  }

  async create(data: CreateEstoqueData): Promise<CreateEstoqueResponseDTO> {
    // Criar o estoque
    const estoque = await this.estoqueRepository.create(data);
    return this.mapToResponseDTO(estoque);
  }

  async findById(id: number): Promise<EstoqueResponseDTO> {
    const estoque = await this.estoqueRepository.findById(id);
    if (!estoque) {
      throw new AppError("Estoque não encontrado", 404);
    }
    return this.mapToResponseDTO(estoque);
  }

  async findAll(): Promise<EstoqueResponseDTO[]> {
    const estoques = await this.estoqueRepository.findAll();
    return estoques.map((estoque) => this.mapToResponseDTO(estoque));
  }

  async update(
    id: number,
    data: UpdateEstoqueData
  ): Promise<UpdateEstoqueResponseDTO> {
    // Verificar se o estoque existe
    const existingEstoque = await this.estoqueRepository.findById(id);
    if (!existingEstoque) {
      throw new AppError("Estoque não encontrado", 404);
    }

    // Verificar se a quantidade é diferente do estoque atual
    if (data.quantidade === existingEstoque.quantidade) {
      throw new AppError("Quantidade não pode ser igual ao estoque atual", 400);
    }

    const estoque = await this.estoqueRepository.update(id, data);
    return this.mapToResponseDTO(estoque);
  }

  async delete(id: number): Promise<void> {
    // Verificar se o estoque existe
    const existingEstoque = await this.estoqueRepository.findById(id);
    if (!existingEstoque) {
      throw new AppError("Estoque não encontrado", 404);
    }

    await this.estoqueRepository.delete(id);
  }

  async deleteByProdutoId(produtoId: number): Promise<void> {
    // Verificar se o estoque existe para este produto
    const existingEstoque = await this.estoqueRepository.findByProdutoId(
      produtoId
    );
    if (!existingEstoque) {
      throw new AppError("Estoque não encontrado", 404);
    }

    await this.estoqueRepository.delete(existingEstoque.id);
  }

  async disconnect(): Promise<void> {
    await this.estoqueRepository.disconnect();
  }
}
