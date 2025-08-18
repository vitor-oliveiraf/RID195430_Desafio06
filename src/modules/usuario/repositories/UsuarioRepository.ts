import { PrismaClient } from "@prisma/client";
import {
  Usuario,
  CreateUsuarioData,
  UpdateUsuarioData,
} from "../entities/Usuario";

export class UsuarioRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateUsuarioData): Promise<Usuario> {
    return this.prisma.usuario.create({
      data,
    });
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: number, data: UpdateUsuarioData): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Usuario> {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
