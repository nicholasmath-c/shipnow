import { useHeader } from "../data/contexts/HeaderContext.tsx";
import { useEffect } from "react";
import DashboardContentLayout from "../components/layout/DashboardContentLayout";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import TicketsDataTable from "@/components/tables/tickets/page.tsx";

export default function Tickets() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Chamados");
  }, [setTitle]);

  return (
    <ProtectedRoute>
      <DashboardContentLayout>
          <TicketsDataTable />
      </DashboardContentLayout>
    </ProtectedRoute>
  );
}
