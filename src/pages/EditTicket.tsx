import EditTicketForm from "@/components/form/EditTicketForm";
import DashboardContentLayout from "@/components/layout/DashboardContentLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { iTicket } from "@/data/@types/ticket";
import { useHeader } from "@/data/contexts/HeaderContext";
import { Undo2 } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function EditTicket() {
  const { setTitle } = useHeader();
  const { state } = useLocation();
  const ticket: iTicket = state?.ticket as iTicket

  useEffect(() => {
    setTitle("Editar chamado");
  }, [setTitle]);

  if (!state?.ticket) {
    return <Navigate to="/tickets" replace />;
  }

  return (
    <ProtectedRoute>
      <DashboardContentLayout>
        <a href="/tickets" className="mb-4 block">
          <Button variant={"link"}>
            <Undo2 />
            Voltar
          </Button>
        </a>
        <EditTicketForm ticket={ticket} />
      </DashboardContentLayout>
    </ProtectedRoute>
  );
}
