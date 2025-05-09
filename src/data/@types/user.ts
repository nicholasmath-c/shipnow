export interface iUser {
  id: number;
  nome: string;
  login: string;
  senha: string;
  nivel_acesso: string;
  matricula: string;
  celular: string;
  email: string;
  id_setor: number;
  nome_setor: string;
  id_cargo: number;
  nome_cargo: string;
}

export interface iUserPost {
  nome?: string;
  login?: string;
  senha?: string;
  nivel_acesso?: string;
  matricula?: string;
  celular?: string | null;
  email?: string | null;
  id_setor?: number | null;
  id_cargo?: number | null;
}

export interface User {
  id: number;
  name: string;
  login: string;
  role: string;
}