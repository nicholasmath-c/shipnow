export interface iOrder {
  id?: number | null;
  company_id?: number;
  company_name?: string | null;
  company_nif?: string | null;
  company_email?: string | null;
  company_phone?: string | null;
  company_is_active?: boolean | null;
  company_address_id?: number | null;
  company_address_street?: string | null;
  company_address_number?: string | null;
  company_address_complement?: string | null;
  company_address_postal_code?: string | null;
  company_address_city?: string | null;
  company_address_district?: string | null;
  company_address_country?: string | null;
  client_name?: string | null;
  client_email?: string | null;
  client_phone?: string | null;
  client_nif?: string | null;
  order_type?: string | null;
  is_merchant_delivery?: boolean;
  delivery_address_id?: number | null;
  delivery_address_street?: string | null;
  delivery_address_number?: string | null;
  delivery_address_complement?: string | null;
  delivery_address_postal_code?: string | null;
  delivery_address_city?: string | null;
  delivery_address_district?: string | null;
  delivery_address_country?: string | null;
  shipping_value?: number;
  items_total_value?: number;
  carrier?: string | null;
  tracking_code?: string | null;
  pickup_schedule_date?: Date | null;
  status?: string;
  order_date?: Date;
  delivery_date_effective?: Date | null;
  notes?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

// export interface iTicketPost {
//   numero_protocolo?: string | null;
//   id_usuario?: number;
//   id_unidade: number | null;
//   id_categoria: number | null;
//   id_tecnico?: number | null;
//   local?: string | null;
//   descricao?: string | null;
//   situacao?: string | null;
//   nivel_urgencia?: string | null;
//   data_requisicao?: string | null;
//   data_fechamento?: string | null;
// }
