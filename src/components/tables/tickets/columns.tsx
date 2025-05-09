import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { iTicket } from "@/data/@types/ticket";
import { User } from "@/data/@types/user";
import { badgeColors, verifyUserTicketOpen } from "@/data/hooks/helpers";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { RefObject } from "react";

type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  adminAndTechOnly?: boolean;
};

export const columns = (
  onTicketDeleteHandler: (id: number, protocolo: string) => void,
  onTicketEditHandler: (ticket: iTicket) => void,
  isAlertOpenRef: RefObject<boolean>,
  user: User
): ExtendedColumnDef<iTicket>[] => [
  {
    accessorKey: "acao",
    header: "Ação",
    cell: ({ row }) => {
      const ticket = row.original;

      return (
        <div className="flex gap-2">
          <DialogTrigger asChild>
            <Button className="w-8 h-8 bg-emerald-600 hover:bg-emerald-500">
              <Eye />
            </Button>
          </DialogTrigger>
          {verifyUserTicketOpen({ user, ticket }) ? (
            <>
              <Button
                className="w-8 h-8 bg-amber-600 hover:bg-amber-500"
                onClick={() => {
                  onTicketEditHandler(ticket);
                }}
              >
                <Pencil />
              </Button>

              <AlertDialog
                onOpenChange={(open) => {
                  isAlertOpenRef.current = open; // Atualiza sem causar re-render
                }}
              >
                <AlertDialogTrigger asChild>
                  <Button className="w-8 h-8 bg-rose-600 hover:bg-rose-500">
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja excluir este chamado?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Ela irá permanentemente
                      excluir este chamado.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => {
                        isAlertOpenRef.current = false;
                      }}
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-rose-600 hover:bg-rose-500"
                      onClick={async () => {
                        onTicketDeleteHandler(
                          ticket.id,
                          ticket.numero_protocolo
                        );
                      }}
                    >
                      Sim, quero excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button className="w-8 h-8 bg-neutral-600" disabled>
                <Pencil />
              </Button>

              <Button className="w-8 h-8 bg-neutral-600" disabled>
                <Trash />
              </Button>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "numero_protocolo",
    header: "Numero de Protocolo",
  },
  {
    accessorKey: "nome_unidade",
    header: "Unidade",
  },
  {
    accessorKey: "local",
    header: "Local",
  },
  {
    accessorKey: "nome_categoria",
    header: "Categoria",
  },
  {
    accessorKey: "nome_solicitante",
    header: "Solicitante",
  },

  {
    accessorKey: "nome_tecnico",
    header: "Técnico",
  },
  {
    accessorKey: "situacao",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Situação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      // 1. Primeiro defina um tipo para os níveis de urgência
      type UrgencyLevel = "aberto" | "em_andamento" | "finalizado";

      // 2. Crie o objeto de prioridades com tipo explícito
      const urgencyPriority: Record<UrgencyLevel, number> = {
        aberto: 1,
        em_andamento: 2,
        finalizado: 3,
        // "a definir": 4,
      };
      const a = String(rowA.getValue(columnId)).toLowerCase() as UrgencyLevel;
      const b = String(rowB.getValue(columnId)).toLowerCase() as UrgencyLevel;

      // Valores padrão para casos não mapeados
      const priorityA = urgencyPriority[a];
      const priorityB = urgencyPriority[b];

      return priorityA - priorityB;
    },
    cell: ({ row }) => {
      const situacao = row.getValue("situacao") as string; // Tipagem opcional
      const situacaoFormatada = situacao.toUpperCase().replace("_", " ");

      return (
        <Badge className={`${badgeColors(situacao)} text-white w-full`}>
          {situacaoFormatada}
        </Badge>
      );
    },
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },

  {
    accessorKey: "nivel_urgencia",
    adminAndTechOnly: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nível de Urgência
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      // 1. Primeiro defina um tipo para os níveis de urgência
      type UrgencyLevel = "baixo" | "medio" | "alto" | "a definir";

      // 2. Crie o objeto de prioridades com tipo explícito
      const urgencyPriority: Record<UrgencyLevel, number> = {
        baixo: 1,
        medio: 2,
        alto: 3,
        "a definir": 4,
      };
      const a = String(rowA.getValue(columnId)).toLowerCase() as UrgencyLevel;
      const b = String(rowB.getValue(columnId)).toLowerCase() as UrgencyLevel;

      // Valores padrão para casos não mapeados
      const priorityA = urgencyPriority[a] ?? urgencyPriority["a definir"];
      const priorityB = urgencyPriority[b] ?? urgencyPriority["a definir"];

      return priorityA - priorityB;
    },
    cell: ({ row }) => {
      const nivelUrgencia = row.getValue("nivel_urgencia") as string;
      let nivelUrgenciaFormatada;
      if (nivelUrgencia) {
        nivelUrgenciaFormatada = nivelUrgencia.toUpperCase().replace("_", " ");
      } else {
        nivelUrgenciaFormatada = "A DEFINIR";
      }

      return (
        <Badge className={`${badgeColors(nivelUrgencia)} text-white w-full`}>
          {nivelUrgenciaFormatada}
        </Badge>
      );
    },
  },
  {
    accessorKey: "data_requisicao",
    header: "Data de Abertura",
    cell: ({ row }) => {
      const dataFormatadaRaw = new Date(row.getValue("data_requisicao"));
      const dataFormatada = dataFormatadaRaw.toLocaleString("pt-br", {
        timeZone: "utc",
      });

      return <>{dataFormatada}</>;
    },
  },
  {
    accessorKey: "data_fechamento",
    header: "Data de Fechamento",
    cell: ({ row }) => {
      if (row.getValue("data_fechamento")) {
        const dataFormatadaRaw = new Date(row.getValue("data_fechamento"));
        const dataFormatada = dataFormatadaRaw.toLocaleString("pt-br", {
          timeZone: "utc",
        });

        return <>{dataFormatada}</>;
      }
    },
  },
];
