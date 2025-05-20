"use client";

import { Column } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DataTableDateFilterProps<T> {
  title: string;
  column: Column<T, unknown> | undefined;
}

export function DataTableDateFilter<T>({
  title,
  column,
}: DataTableDateFilterProps<T>) {
  const currentFilterRaw = column?.getFilterValue();
  const currentFilter =
    typeof currentFilterRaw === "string" ? currentFilterRaw : undefined;

  const [date, setDate] = useState<Date | undefined>(() => {
    return currentFilter ? new Date(currentFilter) : undefined;
  });

  useEffect(() => {
    if (date && column) {
      column.setFilterValue(date);
    } else if (!date && column) {
      column.setFilterValue(undefined);
    }
  }, [date, column]);

  if (
    !column ||
    typeof column.getFilterValue !== "function" ||
    typeof column.setFilterValue !== "function"
  ) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full md:max-w-xs justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: ptBR })
            ) : (
              <span>{title}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>
          Limpar
        </Button>
      )}
    </div>
  );
}
