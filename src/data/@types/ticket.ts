export interface iTicket {
  id: number;
  numero_protocolo: string;
  id_solicitante: number;
  id_unidade: number;
  id_categoria: number;
  id_tecnico: number;
  nome_solicitante: string;
  nome_unidade: string;
  local?: string | null;
  nome_categoria: string;
  nome_tecnico: string | null;
  descricao?: string | null;
  situacao: string ;
  nivel_urgencia?: string | null;
  data_requisicao: Date;
  data_fechamento: Date | null;
}

export interface iTicketPost {
  numero_protocolo?: string | null;
  id_usuario?: number;
  id_unidade: number | null;
  id_categoria: number | null;
  id_tecnico?: number | null;
  local?: string | null;
  descricao?: string | null;
  situacao?: string | null;
  nivel_urgencia?: string | null;
  data_requisicao?: string | null;
  data_fechamento?: string | null;
}
