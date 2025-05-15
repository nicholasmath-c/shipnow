export interface iUser {
  id?: number | null;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  nif?: string | null;
  phone?: string;
  role?: string;
  is_active?: boolean;
  company_id?: number;
  company_name?: string | null;
  company_nif?: string | null;
  company_email?: string | null;
  company_phone?: string | null;
  company_is_active?: boolean | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

// export interface iUserPost {
//   nome?: string;
//   login?: string;
//   senha?: string;
//   nivel_acesso?: string;
//   matricula?: string;
//   celular?: string | null;
//   email?: string | null;
//   id_setor?: number | null;
//   id_cargo?: number | null;
// }

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  company_id: number;
  company_name: string;
}
