export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface CreateUsuarioResponseDTO {
  id: number;
  nome: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
