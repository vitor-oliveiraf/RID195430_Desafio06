export interface CreateProdutoDTO {
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  usuarioId: number;
}

export interface CreateProdutoResponseDTO {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  createdAt: Date;
  updatedAt: Date;
  quantidade?: number;
  usuarioId: number;
}

export interface CreateProdutoResponseDTO {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  createdAt: Date;
  updatedAt: Date;
  quantidade?: number;
  usuarioId: number;
}
