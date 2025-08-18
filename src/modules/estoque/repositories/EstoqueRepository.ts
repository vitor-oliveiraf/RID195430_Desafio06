import { PrismaClient } from "@prisma/client";
import {
  Estoque,
  CreateEstoqueData,
  UpdateEstoqueData,
} from "../entities/Estoque";

export class EstoqueRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateEstoqueData): Promise<Estoque> {
    return this.prisma.estoque.create({
      data,
    });
  }

  async findById(id: number): Promise<Estoque | null> {
    return this.prisma.estoque.findUnique({
      where: { id },
    });
  }

  async findByProdutoId(produtoId: number): Promise<Estoque | null> {
    return this.prisma.estoque.findFirst({
      where: { produtoId },
    });
  }

  async findAll(): Promise<Estoque[]> {
    return this.prisma.estoque.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: number, data: UpdateEstoqueData): Promise<Estoque> {
    return this.prisma.estoque.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Estoque> {
    return this.prisma.estoque.delete({
      where: { id },
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
