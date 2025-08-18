export interface Estoque {
  id: number;
  produtoId: number;
  quantidade: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEstoqueData {
  produtoId: number;
  quantidade: number;
}

export interface UpdateEstoqueData {
  quantidade: number;
}
