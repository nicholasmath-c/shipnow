export interface iCompany {
  id?: number | null;
  name?: string;
  nif?: string;
  email?: string | null;
  phone?: string | null;
  address_id?: number;
  address_street?: string | null;
  address_number?: string | null;
  address_complement?: string | null;
  address_postal_code?: string | null;
  address_city?: string | null;
  address_district?: string | null;
  address_country?: string | null;
  is_active?: boolean;
  created_at?: Date | null;
  updated_at?: Date | null;
}
