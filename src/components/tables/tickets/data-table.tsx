"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import TicketDialog from "@/components/TicketDialog";
import { iTicket } from "@/data/@types/ticket";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/data/contexts/AuthContext";

// Adicione este filtro personalizado
const globalFilter: FilterFn<any> = (row, value) => {
  const search = value.toLowerCase();

  return Object.values(row.original).some((val) =>
    String(val).toLowerCase().includes(search)
  );
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { user } = useAuth();
  const isTechOrAdmin = user?.role === "admin" || user?.role === "tech"; // Ajuste conforme sua lógica de roles

  // Filtra as colunas baseado no papel do usuário
  const filteredColumns = columns.filter((column) => {
    if ((column as any).adminOnly && !isTechOrAdmin) {
      return false;
    }
    return true;
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const table = useReactTable({
    data: data as TData[],
    columns: filteredColumns, // Usa as colunas filtradas
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilterValue,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: globalFilter,
    state: {
      sorting,
      globalFilter: globalFilterValue,
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col-reverse items-center md:gap-4 md:justify-between md:flex-row">
        <div className="flex items-center py-4 gap-2">
          <p>Pesquisar: </p>
          <Input
            placeholder="Pesquisar todas as colunas..."
            value={globalFilterValue}
            onChange={(event) => setGlobalFilterValue(event.target.value)}
            className="w-full md:max-w-sm"
          />
        </div>
        <a href="/create-ticket">
          <Button>
            <Plus />
            Novo Chamado
          </Button>
        </a>
      </div>
      <div className="rounded-md border">
        <Table className="block overflow-scroll max-h-150 border-collapse">
          <TableHeader className="sticky top-0 bg-white z-1">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const ticketData = row.original as iTicket;

                return (
                  <TicketDialog key={ticketData.id} ticket={ticketData}>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="max-w-64 text-ellipsis overflow-hidden"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TicketDialog>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
