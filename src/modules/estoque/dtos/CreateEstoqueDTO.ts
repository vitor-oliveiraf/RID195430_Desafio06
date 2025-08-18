export interface CreateEstoqueDTO {
  produtoId: number;
  quantidade: number;
}

export interface CreateEstoqueResponseDTO {
  id: number;
  produtoId: number;
  quantidade: number;
  createdAt: Date;
  updatedAt: Date;
}
