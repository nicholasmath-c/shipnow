import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableDateFilter } from "@/components/ui/data-table-date-filter";
import { Combobox } from "@/components/ui/combobox";
import { ListFilter } from "lucide-react";

export function OrderFilters({ table }: { table: any }) {
  const FiltersContent = (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <Input
        placeholder="Cliente"
        className="w-full md:max-w-xs"
        value={
          (table.getColumn("client_name")?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn("client_name")?.setFilterValue(event.target.value)
        }
      />

      <Combobox
        title="Tipo de pedido"
        options={[
          { value: "", label: "Sem filtro" },
          { value: "delivery", label: "Entrega" },
          { value: "pickup", label: "Recolhimento" },
        ]}
        value={
          (table.getColumn("order_type")?.getFilterValue() as string) || ""
        }
        onValueChange={(value) =>
          table.getColumn("order_type")?.setFilterValue(value)
        }
      />

      <DataTableDateFilter
        title="Data do pedido"
        column={table.getColumn("order_date")}
      />

      <DataTableDateFilter
        title="Data de entrega"
        column={table.getColumn("delivery_date_effective")}
      />
    </div>
  );

  return (
    <div className="w-full">
      {/* Filtros visíveis no desktop */}
      <div className="hidden md:flex items-center gap-4 flex-wrap">
        {FiltersContent}
      </div>

      {/* Filtros colapsados no mobile */}
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[90vw] max-w-sm p-4">
            {FiltersContent}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
