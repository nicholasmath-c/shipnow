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

export interface iCompanyCurrentMonthSales {
  current_month_sales: number,
  previous_month_sales: number,
  percentage_change: number
}

export interface iCompanyCurrentMonthDeliveredOrders {
  current_month_deliveries: number,
  previous_month_deliveries: number,
  percentage_change: number
}

export interface iCompanyCurrentMonthShippingValue {
  total_shipping_value: number,
}

export interface iCompanyStockQuantity {
  total_stock_quantity: number,
}