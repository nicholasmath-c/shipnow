"use client";

import { iOrder } from "@/data/@types/order";
import { ColumnDef } from "@tanstack/react-table";
import { status } from "../../../data/hooks/helpers";
import { Truck, Warehouse } from "lucide-react";

export const columns: ColumnDef<iOrder>[] = [
  {
    accessorKey: "icon",
    header: undefined,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div
          className={`flex justify-center text-secondary items-center m-1 w-12 h-12 rounded-full bg-muted`}
        >
          {order.order_type === "delivery" ? <Truck /> : <Warehouse />}
        </div>
      );
    },
  },
  {
    accessorKey: "order_type",
    header: "Tipo",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="font-medium">
          {order.order_type === "delivery"
            ? "Entrega"
            : order.order_type === "pickup"
            ? "Recolhimento"
            : null}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const order = row.original;
      const entry = Object.entries(status).find(
        ([key, value]) => key === order.status
      );

      if (entry) {
        const [key, value] = entry;
        return (
          <div className="flex items-center gap-1">
            <div
              className={`m-1 w-3 h-3 rounded-full bg-${value.cssVariable}`}
            ></div>
            {value.label}
          </div>
        );
      }
    },
  },
  {
    accessorKey: "order_date",
    header: "Data do pedido",
    cell: ({ row }) => {
      const data_sem_formatar = new Date(row.getValue("order_date"));
      const data_formatada = data_sem_formatar.toLocaleString("pt", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return <div>{data_formatada}</div>;
    },
  },
  {
    accessorKey: "delivery_date_effective",
    header: "Data de entrega",
    cell: ({ row }) => {
      if (row.getValue("delivery_date_effective") !== null) {
        const data_sem_formatar = new Date(
          row.getValue("delivery_date_effective")
        );
        const data_formatada = data_sem_formatar.toLocaleString("pt", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return <div>{data_formatada}</div>;
      } else {
        return <div className="text-muted-foreground">Vazio</div>;
      }
    },
  },
];
