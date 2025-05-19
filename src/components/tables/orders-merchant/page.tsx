"use client"; // se necessário

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useOrders } from "@/data/contexts/OrdersContext";

export default function OrdersMerchantHomeDataTable() {
  const { orders } = useOrders();

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
