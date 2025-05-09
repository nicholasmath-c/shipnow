export interface iUpdateTicket {
  id: number,
  id_chamado: number,
  numero_protocolo_chamado: string,
  id_usuario: number,
  nome_usuario: string,
  descricao: string,
  data_atualizacao: string
}

export interface iUpdateTicketPost {
  id_chamado?: number | null,
  id_usuario?: number | null,
  descricao?: string | null,
  data_atualizacao?: string | null
}