export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUsuarioData {
  nome: string;
  email: string;
  senha: string;
}

export interface UpdateUsuarioData {
  nome?: string;
  email?: string;
  senha?: string;
}
