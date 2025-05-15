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
import { SalesChart } from "@/components/charts/SalesChart.tsx";
import { OrdersChart } from "@/components/charts/OrdersChart.tsx";

export default function Home() {
  const { setTitle } = useHeader();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle("Página Inicial");
  }, [setTitle]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-24">
        <SPLoader />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardContentLayout>
        <SectionCards />
        <div className="flex md:flex-row flex-col w-full gap-4 md:gap-8 align-stretch [container-type:inline-size]">
          <div className="w-full">
            <SalesChart />
          </div>
          <div className="w-full">
            <OrdersChart />
          </div>
        </div>
      </DashboardContentLayout>
    </ProtectedRoute>
  );
}
