import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Monitor } from "lucide-react";
import { iTicket } from "@/data/@types/ticket";
import { badgeColors } from "@/data/hooks/helpers";
import TicketDialog from "./TicketDialog";

interface TicketCardProps {
  ticket: iTicket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const data_requisicao_raw = new Date(ticket.data_requisicao);
  const dataHora_requisicao_formatada = data_requisicao_raw.toLocaleString(
    "pt-BR",
    { timeZone: "utc" }
  );

  return (
    <TicketDialog ticket={ticket}>
      <Card className="justify-between">
        <CardHeader>
          <CardDescription className="text-neutral-500 text-xs font-medium mb-1">
            {dataHora_requisicao_formatada}
          </CardDescription>
          <div className="flex align-middle items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-4">
              <Monitor className="min-w-max" />
              <h3 className="line-clamp-2">{ticket.nome_unidade}</h3>
            </CardTitle>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs font-semibold">Prioridade</span>
              <Badge
                className={`uppercase font-semibold ${badgeColors(
                  ticket.nivel_urgencia as string
                )}`}
              >
                {ticket.nivel_urgencia || "A definir"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            <span className="font-medium">Nº de protocolo: </span>
            {ticket.numero_protocolo}
          </p>
          <p>
            <span className="font-medium">Categoria: </span>
            {ticket.nome_categoria}
          </p>
          <p>
            <span className="font-medium">Local: </span>
            {ticket.local}
          </p>
        </CardContent>
        <CardFooter>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Eye className="" /> Analisar chamado
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>
    </TicketDialog>
  );
}
