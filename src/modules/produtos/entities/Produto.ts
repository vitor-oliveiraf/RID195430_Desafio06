export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  createdAt: Date;
  updatedAt: Date;
  usuarioId: number;
}

export interface CreateProdutoData {
  nome: string;
  descricao: string;
  preco: number;
  quantidade?: number;
  usuarioId: number;
}

export interface UpdateProdutoData {
  nome?: string;
  descricao?: string;
  preco?: number;
}
