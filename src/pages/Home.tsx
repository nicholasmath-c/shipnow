import { useHeader } from "../data/contexts/HeaderContext.tsx";
import { useEffect, useState } from "react";
import DashboardContentLayout from "@/components/layout/DashboardContentLayout.tsx";
import SectionCards from "@/components/SectionCards.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import {
  listAllTickets,
  listAllTicketsByRequester,
} from "@/data/services/ticketService.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { useAuth } from "@/data/contexts/AuthContext.tsx";
import { useTicket } from "@/data/contexts/TicketsContext.tsx";
import TicketCard from "@/components/TicketCard.tsx";
import { toast } from "sonner";
import SPLoader from "@/components/SpinnerLoader.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function Home() {
  const { setTitle } = useHeader();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { tickets, setTicket } = useTicket();

  useEffect(() => {
    setTitle("Página Inicial");
  }, [setTitle]);

  useEffect(() => {
    const request = async () => {
      try {
        if (user) {
          const tickets =
            user.role === "user"
              ? await listAllTicketsByRequester(user.id)
              : await listAllTickets();
          setTicket(tickets);
        }
      } catch (error) {
        toast.error("Erro ao carregar os chamados.");
      } finally {
        setIsLoading(false);
      }
    };

    request();
    const interval = setInterval(() => {
      console.log(user);
      request();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-24">
        <SPLoader />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["user", "tech", "admin"]}>
      <DashboardContentLayout>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {user?.role === "user" ? (
                <div className="flex justify-center mb-4 w-full">
                  <a href="/create-ticket" className="block w-full md:w-fit">
                    <Button className="text-md w-full md:w-56 h-12 hover:animate-pulse">
                      ABRIR CHAMADO
                    </Button>
                  </a>
                </div>
              ) : (
                <>
                  <SectionCards tickets={tickets} />
                  <Separator />
                </>
              )}
              <h2 className="font-medium text-xl">
                Últimos chamados{" "}
                {user?.role === "user" ? "em andamento" : "abertos"}
              </h2>
              <div className="lg:grid-cols-2 xl:grid-cols-4 grid grid-cols-1 gap-4">
                {!tickets ||
                  tickets.map((ticket) => {
                    if (
                      (ticket.situacao === "aberto" && user?.role !== "user") ||
                      (user?.role === "user" &&
                        ticket.situacao === "em_andamento")
                    )
                      return <TicketCard ticket={ticket} key={ticket.id} />;
                  })}
              </div>
            </div>
          </div>
        </div>
      </DashboardContentLayout>
    </ProtectedRoute>
  );
}
