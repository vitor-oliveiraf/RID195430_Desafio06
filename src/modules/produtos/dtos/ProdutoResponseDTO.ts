export interface ProdutoResponseDTO {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  createdAt: Date;
  updatedAt: Date;
  usuarioId: number;
}
