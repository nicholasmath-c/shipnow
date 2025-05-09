import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { iTicket } from "@/data/@types/ticket";

interface SectionCardsProps {
  tickets?: iTicket[] | null;
}

export default function SectionCards({ tickets }: SectionCardsProps) {
  const counts = {
    aberto: tickets?.filter(t => t.situacao === 'aberto').length || 0,
    emAndamento: tickets?.filter(t => t.situacao === 'em_andamento').length || 0,
    finalizado: tickets?.filter(t => t.situacao === 'finalizado').length || 0
  }

  return (
    <div>
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card items-center text-center">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Abertos</CardDescription>
            <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
              {counts.aberto}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Em Andamento</CardDescription>
            <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
              {counts.emAndamento}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Finalizados</CardDescription>
            <CardTitle className="@[250px]/card:text-4xl text-2xl font-semibold tabular-nums">
              {counts.finalizado}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
