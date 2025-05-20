"use client"; // se necessário

import { DataTable } from "./data-table";
import { useOrders } from "@/data/contexts/OrdersContext";

export default function OrdersMerchantHomeDataTable() {
  const { orders } = useOrders();

  return (
    <div className="container mx-auto">
      <DataTable data={orders} />
    </div>
  );
}
