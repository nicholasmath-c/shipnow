"use client";

import { iOrder } from "@/data/@types/order";
import { ColumnDef } from "@tanstack/react-table";
import { status } from "../../../data/hooks/helpers";
import { ChevronDown, ChevronUp, Truck, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startOfDay, isSameDay } from "date-fns";

export function getColumns({
  expandedRowId,
  setExpandedRowId,
}: {
  expandedRowId: string | null;
  setExpandedRowId: (id: string | null) => void;
}): ColumnDef<any>[] {
  return [
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
      filterFn: (row, columnId, filterValue) => {
        return row.getValue(columnId) === filterValue;
      },

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
                className={`m-1 w-3 h-3 rounded-full`}
                style={{ backgroundColor: value.cssVariable }}
              ></div>
              {value.label}
            </div>
          );
        }
      },
    },
    {
      accessorKey: "client_name",
      header: "Cliente",
      cell: ({ row }) => {
        if (row.getValue("order_type") === "pickup") {
          return <span className="text-muted-foreground">Vazio</span>;
        } else {
          return <>{row.getValue("client_name")}</>;
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
      filterFn: (row, columnId, filterValue) => {
        const rowDate = startOfDay(new Date(row.getValue(columnId)));
        const filterDate = startOfDay(new Date(filterValue));
        return isSameDay(rowDate, filterDate);
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
      filterFn: (row, columnId, filterValue) => {
        const rowDate = startOfDay(new Date(row.getValue(columnId)));
        const filterDate = startOfDay(new Date(filterValue));
        return isSameDay(rowDate, filterDate);
      },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const isExpanded = row.original.id === expandedRowId;

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // evita conflito com onClick na row
              setExpandedRowId((prev) =>
                prev === row.original.id ? null : row.original.id
              );
            }}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
    },
  ];
}
