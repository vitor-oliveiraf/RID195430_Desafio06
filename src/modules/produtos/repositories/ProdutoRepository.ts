import { PrismaClient } from "@prisma/client";
import {
  Produto,
  CreateProdutoData,
  UpdateProdutoData,
} from "../entities/Produto";

export class ProdutoRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateProdutoData): Promise<Produto> {
    return this.prisma.produto.create({
      data,
    });
  }

  async findById(id: number): Promise<Produto | null> {
    return this.prisma.produto.findUnique({
      where: { id },
    });
  }

  async findByNome(nome: string): Promise<Produto | null> {
    return this.prisma.produto.findFirst({
      where: { nome },
    });
  }

  async findAll(): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: number, data: UpdateProdutoData): Promise<Produto> {
    return this.prisma.produto.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Produto> {
    return this.prisma.produto.delete({
      where: { id },
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
