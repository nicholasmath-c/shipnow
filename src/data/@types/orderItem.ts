export interface iOrderItem {
  id?: number | null;
  unit_price?: string | null;
  quantity?: number | null;
  created_at?: Date | null;

  order_id?: number | null;
  order_company_id?: number | null;
  order_company_name?: string | null;
  order_company_nif?: string | null;
  order_company_email?: string | null;
  order_company_phone?: string | null;
  order_company_address_id?: number | null;
  order_company_address_street?: string | null;
  order_company_address_number?: string | null;
  order_company_address_complement?: string | null;
  order_company_address_postal_code?: string | null;
  order_company_address_city?: string | null;
  order_company_address_district?: string | null;
  order_company_address_country?: string | null;
  order_company_is_active?: number | null;

  order_client_name?: string | null;
  order_client_email?: string | null;
  order_client_phone?: string | null;
  order_client_nif?: string | null;

  order_type?: string | null;
  order_is_merchant_delivery?: number | null;
  order_delivery_address_id?: number | null;
  order_delivery_address_street?: string | null;
  order_delivery_address_number?: string | null;
  order_delivery_address_complement?: string | null;
  order_delivery_address_postal_code?: string | null;
  order_delivery_address_city?: string | null;
  order_delivery_address_district?: string | null;
  order_delivery_address_country?: string | null;

  order_shipping_value?: string | null;
  order_items_total_value?: string | null;
  order_carrier?: string | null;
  order_tracking_code?: string | null;
  order_pickup_schedule_date?: string | null;
  order_status?: string | null;
  order_date?: string | null;
  order_delivery_date_effective?: string | null;
  order_notes?: string | null;
  order_created_at?: Date | null;
  order_updated_at?: Date | null;

  product_id?: number | null;
  product_name?: string | null;
  product_description?: string | null;
  product_sku?: string | null;
  product_stock_quantity?: number | null;
  product_unit_price?: string | null;
  product_weight?: string | null;
  product_width?: string | null;
  product_height?: string | null;
  product_depth?: string | null;
  product_is_active?: number | null;
  product_created_at?: Date | null;
  product_updated_at?: Date | null;
}
