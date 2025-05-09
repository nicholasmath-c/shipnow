import CreateTicketForm from "@/components/form/CreateTicketForm";
import DashboardContentLayout from "@/components/layout/DashboardContentLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/data/contexts/HeaderContext";
import { Undo2 } from "lucide-react";
import { useEffect } from "react";

export default function CreateTicket() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Novo chamado");
  }, [setTitle]);

  return (
    <ProtectedRoute>
      <DashboardContentLayout>
        <a href="/tickets" className="mb-4 block">
          <Button variant={"link"}>
            <Undo2 />
            Voltar
          </Button>
        </a>
        <CreateTicketForm />
      </DashboardContentLayout>
    </ProtectedRoute>
  );
}
