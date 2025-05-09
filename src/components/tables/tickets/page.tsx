import { columns } from "../tickets/columns.tsx";
import { DataTable } from "./data-table";
import {
  listAllTicketsByRequester,
  listAllTickets,
  deleteTicket,
} from "@/data/services/ticketService";
import { useAuth } from "@/data/contexts/AuthContext.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { iTicket } from "@/data/@types/ticket.ts";
import { useNavigate } from "react-router-dom";
import SPLoader from "@/components/SpinnerLoader.tsx";

// TicketsDataTable.tsx
export default function TicketsDataTable() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<iTicket[]>();
  const [isAlertOpened] = useState(false);
  const isAlertOpenRef = useRef(false);
  const navigate = useNavigate();

  const fetchTickets = useCallback(async () => {
    try {
      if (!user) return;
      const data =
        user.role === "user"
          ? await listAllTicketsByRequester(user.id)
          : await listAllTickets();
      setTickets(data);
    } catch (error) {
      toast.error("Erro ao buscar os chamados");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTickets();

    const interval = setInterval(() => {
      if (!isAlertOpenRef.current) {
        fetchTickets();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchTickets, isAlertOpened]);

  const handleDeleteTicket = async (ticketId: number, protocolo: string) => {
    try {
      await deleteTicket(ticketId);
      setTickets((prev) => prev?.filter((t) => t.id !== ticketId));
      toast.success(`Ticket ${protocolo} excluído!`);
    } catch (error) {
      toast.error("Erro ao excluir ticket");
    } finally {
      isAlertOpenRef.current = false;
    }
  };

  const handleEditTicket = (ticket: iTicket) => {
    navigate("/edit-ticket", {
      state: {
        ticket: ticket,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-24">
        <SPLoader />
      </div>
    );
  }

  console.log(tickets?.filter((t) => t.id_tecnico === user?.id));

  if (user) {
    return (
      <div className="container mx-auto">
        <DataTable
          columns={columns(
            handleDeleteTicket,
            handleEditTicket,
            isAlertOpenRef,
            user
          )}
          data={tickets}
        />
      </div>
    );
  }
}
