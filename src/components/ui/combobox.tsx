"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Option = {
  value: any;
  label: any;
};

interface ComboboxProps {
  title: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
}

export function Combobox({
  title,
  options,
  value,
  onValueChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:max-w-xs justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : `${title}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Buscar ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>Nenhum(a) {title} encontrado(a).</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const synonyms: Record<string, string[]> = {
                  delivery: ["entrega"],
                  pickup: ["rec"],
                };

                const searchTerms = [
                  option.label,
                  option.value,
                  ...(synonyms[option.value] || []),
                ];

                return (
                  <CommandItem
                    key={option.value}
                    value={searchTerms.join(" ").toLowerCase()} // inclui sinônimos
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
