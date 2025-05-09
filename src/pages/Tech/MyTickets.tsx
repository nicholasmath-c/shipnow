import DashboardContentLayout from "@/components/layout/DashboardContentLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import SPLoader from "@/components/SpinnerLoader";
import TicketCard from "@/components/TicketCard";
import { iTicket } from "@/data/@types/ticket";
import { useAuth } from "@/data/contexts/AuthContext";
import { useHeader } from "@/data/contexts/HeaderContext";
import { listAllTicketsByTech } from "@/data/services/ticketService";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NothingFound from "../../assets/img/nothingFound.svg";

export default function MyTickets() {
  const { setTitle } = useHeader();
  const [tickets, setTickets] = useState<iTicket[]>();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setTitle("Meus Atendimentos");
  }, [setTitle]);

  useEffect(() => {
    const request = async () => {
      try {
        if (user) {
          const tickets = await listAllTicketsByTech(user?.id);
          setTickets(tickets);
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
    <ProtectedRoute allowedRoles={["tech", "admin"]}>
      <DashboardContentLayout>
        <div className="lg:grid-cols-2 xl:grid-cols-4 grid grid-cols-1 gap-4">
          {tickets &&
          tickets?.filter((ticket) => ticket?.situacao === "em_andamento")
            .length > 0 ? (
            tickets.map(
              (ticket) =>
                ticket.situacao === "em_andamento" && (
                  <TicketCard ticket={ticket} key={ticket.id} />
                )
            )
          ) : (
            <div className="flex flex-col mt-20 w-full justify-center items-center col-span-4 gap-16">
              <p className="font-medium text-neutral-600">
                Nenhum atendimento no momento...
              </p>
              <img src={NothingFound} alt="" className="block max-w-94" />
            </div>
          )}
        </div>
      </DashboardContentLayout>
    </ProtectedRoute>
  );
}
